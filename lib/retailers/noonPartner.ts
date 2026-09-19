import 'server-only';

import { randomUUID, sign } from 'node:crypto';

const NOON_API_BASE_URL = 'https://noon-api-gateway.noon.partners';
const DEFAULT_USER_AGENT = 'CatchThePrice/1.0';

type NoonCredentials = {
  keyId: string;
  privateKey: string;
  projectCode: string;
};

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

function credentialsFromEnvironment(): NoonCredentials {
  const encodedKey = requiredEnvironment('NOON_API_PRIVATE_KEY_BASE64');
  const privateKey = Buffer.from(encodedKey, 'base64').toString('utf8');
  if (!privateKey.includes('PRIVATE KEY')) throw new Error('NOON_API_PRIVATE_KEY_BASE64 is not a PEM private key');

  return {
    keyId: requiredEnvironment('NOON_API_KEY_ID'),
    privateKey,
    projectCode: requiredEnvironment('NOON_API_PROJECT_CODE'),
  };
}

function sessionCookies(response: Response) {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const cookies = headers.getSetCookie?.() ?? [response.headers.get('set-cookie')].filter(Boolean) as string[];
  return cookies.map((cookie) => cookie.split(';', 1)[0]).filter(Boolean).join('; ');
}

/** Official Noon Partner API service-account client. Server-only by design. */
export class NoonPartnerClient {
  private readonly credentials: NoonCredentials;
  private readonly userAgent: string;

  constructor(private readonly request: typeof fetch = fetch) {
    this.credentials = credentialsFromEnvironment();
    this.userAgent = process.env.NOON_API_USER_AGENT?.trim() || DEFAULT_USER_AGENT;
  }

  private createJwt() {
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({
      sub: this.credentials.keyId,
      iat: Math.floor(Date.now() / 1000),
      jti: randomUUID(),
    }));
    const input = `${header}.${payload}`;
    return `${input}.${sign('RSA-SHA256', Buffer.from(input), this.credentials.privateKey).toString('base64url')}`;
  }

  async authenticate() {
    const response = await this.request(`${NOON_API_BASE_URL}/identity/public/v1/api/login`, {
      method: 'POST',
      headers: { 'User-Agent': this.userAgent, 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: this.createJwt(), default_project_code: this.credentials.projectCode }),
      cache: 'no-store',
    });
    const cookie = sessionCookies(response);
    if (response.status !== 200 || !cookie) throw new Error(`Noon authentication failed (${response.status})`);
    return cookie;
  }

  async whoami() {
    const cookie = await this.authenticate();
    const response = await this.request(`${NOON_API_BASE_URL}/identity/v1/whoami`, {
      headers: { 'User-Agent': this.userAgent, Cookie: cookie },
      cache: 'no-store',
    });
    if (response.status !== 200) throw new Error(`Noon identity request failed (${response.status})`);
    return response.json() as Promise<unknown>;
  }
}

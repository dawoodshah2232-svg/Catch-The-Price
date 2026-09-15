import { spawn } from 'node:child_process';

const port = process.env.SMOKE_PORT || '3100';
const origin = `http://127.0.0.1:${port}`;
const timeoutMs = 60_000;

const routes = [
  { path: '/ae', status: 200, contains: 'CatchThePrice' },
  { path: '/us', status: 200, contains: 'CatchThePrice' },
  { path: '/ae/search', status: 200 },
  { path: '/ae/compare', status: 200 },
  { path: '/ae/blog', status: 200 },
  { path: '/about', status: 200 },
  { path: '/privacy', status: 200, contains: 'Privacy' },
  { path: '/affiliate-disclosure', status: 200 },
  { path: '/terms', status: 200 },
  { path: '/uk', status: 404 },
];

const forbiddenPublicCopy = [
  'Verified Rating',
  'guaranteed lowest price',
  '100% guaranteed lowest',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${origin}/ae`, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await sleep(750);
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms${lastError ? `: ${lastError.message}` : ''}`);
}

async function runChecks() {
  for (const route of routes) {
    const response = await fetch(`${origin}${route.path}`, { redirect: 'manual' });
    if (response.status !== route.status) {
      throw new Error(`${route.path}: expected HTTP ${route.status}, got ${response.status}`);
    }

    const body = await response.text();
    if (route.contains && !body.includes(route.contains)) {
      throw new Error(`${route.path}: expected rendered content to include ${JSON.stringify(route.contains)}`);
    }

    if (route.status === 200) {
      for (const forbidden of forbiddenPublicCopy) {
        if (body.toLowerCase().includes(forbidden.toLowerCase())) {
          throw new Error(`${route.path}: forbidden unsupported public copy found: ${forbidden}`);
        }
      }
    }

    console.log(`✓ ${route.path} → ${response.status}`);
  }
}

const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', port, '-H', '127.0.0.1'],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' },
  }
);

let serverOutput = '';
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
  process.stdout.write(chunk);
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
  process.stderr.write(chunk);
});

try {
  await waitForServer();
  await runChecks();
  console.log('Runtime smoke checks passed.');
} catch (error) {
  console.error('Runtime smoke checks failed:', error instanceof Error ? error.message : error);
  if (serverOutput) console.error('\nServer output captured above.');
  process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    sleep(3_000),
  ]);
  if (!server.killed) server.kill('SIGKILL');
}

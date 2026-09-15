'use client';

const SESSION_KEY = 'ctp-session-id';
const PRIVACY_KEY = 'ctp-privacy-v1';

export function isAnalyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(PRIVACY_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { version?: number; analytics?: boolean };
    return parsed.version === 1 && parsed.analytics === true;
  } catch {
    return false;
  }
}

export function getAnalyticsSessionId(): string | null {
  if (typeof window === 'undefined' || !isAnalyticsAllowed()) return null;

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    const id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  }

  return null;
}

export async function sendAnalyticsEvent(payload: Record<string, unknown>) {
  if (!isAnalyticsAllowed()) return;

  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId: payload.sessionId || getAnalyticsSessionId(),
      }),
      keepalive: true,
      cache: 'no-store',
    });
  } catch {
    // Analytics must never interrupt shopping or navigation.
  }
}

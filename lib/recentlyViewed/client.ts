'use client';

import { CountryCode } from '@/lib/types';

const KEY = 'ctp-recently-viewed-v1';
const MAX_ITEMS_PER_MARKET = 16;

type RecentState = Partial<Record<CountryCode, string[]>>;

function readState(): RecentState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeState(state: RecentState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('ctp:recently-viewed-updated'));
  } catch {
    // Device storage is optional; browsing must continue without it.
  }
}

export function getRecentlyViewedSlugs(country: CountryCode): string[] {
  const values = readState()[country];
  return Array.isArray(values) ? values.filter((value) => typeof value === 'string').slice(0, MAX_ITEMS_PER_MARKET) : [];
}

export function recordRecentlyViewed(country: CountryCode, slug: string) {
  if (typeof window === 'undefined') return;
  if (!['ae', 'us'].includes(country)) return;
  const safeSlug = slug.trim().toLowerCase().slice(0, 180);
  if (!safeSlug) return;

  const state = readState();
  const existing = Array.isArray(state[country]) ? state[country]! : [];
  state[country] = [safeSlug, ...existing.filter((item) => item !== safeSlug)].slice(0, MAX_ITEMS_PER_MARKET);
  writeState(state);
}

export function clearRecentlyViewed(country: CountryCode) {
  const state = readState();
  state[country] = [];
  writeState(state);
}

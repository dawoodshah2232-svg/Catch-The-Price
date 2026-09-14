import { CountryCode, CountryInfo } from '../types';

export const COUNTRIES: Record<CountryCode, CountryInfo> = {
  ae: {
    code: 'ae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    symbol: 'AED',
    locale: 'en-AE',
  },
  us: {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    locale: 'en-US',
  },
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    locale: 'en-GB',
  },
  ca: {
    code: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    symbol: 'C$',
    locale: 'en-CA',
  },
  au: {
    code: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    symbol: 'A$',
    locale: 'en-AU',
  },
};

export const DEFAULT_COUNTRY: CountryCode = 'ae';

export function formatPrice(amount: number, countryCode: CountryCode = 'ae'): string {
  const info = COUNTRIES[countryCode] || COUNTRIES.ae;
  
  if (countryCode === 'ae') {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

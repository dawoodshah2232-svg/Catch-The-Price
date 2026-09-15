'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem('ctp-theme');
    const initial: Theme = stored === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('ctp-theme', next);
    applyTheme(next);
  };

  const Icon = theme === 'light' ? Moon : Sun;
  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="theme-toggle touch-target inline-flex items-center justify-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors"
    >
      <Icon className="h-4 w-4" />
      {!compact && <span className="hidden xl:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>}
    </button>
  );
}

import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#F4F7F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://catchtheprice.com'),
  title: {
    template: '%s | CatchThePrice',
    default: 'CatchThePrice — TRACK IT. CATCH THE DROP. PAY LESS.',
  },
  description:
    'Global price comparison, price tracking, deals discovery and shopping intelligence platform. Smarter Shopping for a Brighter Tomorrow.',
  icons: {
    icon: '/images/emerald_growth_tag_icon.png',
    shortcut: '/images/emerald_growth_tag_icon.png',
    apple: '/images/emerald_growth_tag_icon.png',
  },
};

const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('ctp-theme');
    var theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`} data-theme="light" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-[#00D27A]/20 selection:text-[#083b28]">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}

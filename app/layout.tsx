import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const configuredSite = (process.env.NEXT_PUBLIC_SITE_URL || '').toLowerCase();
const isPreviewDeployment =
  process.env.VERCEL_ENV === 'preview' || configuredSite.includes('preview.catchtheprice.com');

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
  "Price comparison, price tracking, deals discovery and shopping intelligence for shoppers in the UAE and United States. Smarter Shopping for a Brighter Tomorrow.",

other: {
  "mitgo-verification": "c767fde4-f8bb-429c-836f-f215bd3f8d97",
  "impact-site-verification": "c7c1f8bd-95f2-4de6-9398-05a61992fb04",
},
  robots: isPreviewDeployment
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : {
        index: true,
        follow: true,
      },
  icons: {
    icon: '/images/emerald_growth_tag_icon.png',
    shortcut: '/images/emerald_growth_tag_icon.png',
    apple: '/images/emerald_growth_tag_icon.png',
  },
};

const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('ctp-theme-v2');
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

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
  themeColor: '#071015',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="bg-[#F4F7F6] text-[#102027] font-sans antialiased min-h-screen flex flex-col selection:bg-[#00D27A]/20 selection:text-[#083b28]">
        {children}
      </body>
    </html>
  );
}

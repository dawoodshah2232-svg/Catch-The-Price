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
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="bg-[#071015] text-[#F8FAFC] font-sans antialiased min-h-screen flex flex-col selection:bg-[#00D27A]/20 selection:text-[#00E6A2]">
        {children}
      </body>
    </html>
  );
}

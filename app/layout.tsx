import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#060911',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://catchtheprice.com'),
  title: {
    template: '%s | CatchThePrice',
    default: 'CatchThePrice — Track It. Catch the Drop. Pay Less.',
  },
  description:
    'Global price comparison and deals tracking platform. Compare tech prices across verified retailers in UAE, USA, UK, Canada, and Australia.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'CatchThePrice — Track It. Catch the Drop. Pay Less.',
    description:
      'Compare product prices, catch historical price drops, and discover verified deals across top electronics retailers.',
    url: 'https://catchtheprice.com',
    siteName: 'CatchThePrice',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'CatchThePrice Brand Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-ctp-base text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

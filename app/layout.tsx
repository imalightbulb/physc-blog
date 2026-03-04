import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { absoluteUrl, getSiteName, getSiteUrl } from '@/lib/site';
import './globals.css';

const siteName = getSiteName();
const siteDescription =
  'News, research updates, and insights from the Physics Department at Xiamen University Malaysia.';
const socialImage = absoluteUrl('/particle-in-box.svg');

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteName,
    template: '%s | XMUM Physics',
  },
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: siteName,
    description: siteDescription,
    siteName,
    url: absoluteUrl('/'),
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: 'XMUM Physics Department Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} antialiased min-h-screen flex flex-col`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

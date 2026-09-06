import './globals.css';
import type { Metadata } from 'next';
import { Figtree, Archivo } from 'next/font/google';
import { RoleProvider } from '@/lib/role-context';
import { Toaster } from '@/components/ui/toaster';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AutoDoc — Vehicle Maintenance & Repair Marketplace',
  description:
    'Connect with verified mechanics and garages. Post repair requests, compare quotes, track bookings, and keep your vehicle healthy.',
  openGraph: {
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${figtree.variable} ${archivo.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-body antialiased bg-[#F8FAFC] text-[#1E293B]">
        <RoleProvider>
          {children}
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  );
}

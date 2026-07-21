import './globals.css';
import React from 'react';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'AutoDoc - Vehicle Maintenance Marketplace & Diagnostic Reports',
  description: 'Track vehicle health, view detailed maintenance reports, and rate certified mechanics & garages post-service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080C14] text-gray-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800/60 bg-gray-950/60 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-300">AutoDoc Marketplace</span>
              <span>•</span>
              <span>Vehicle Diagnostics & Reviews Platform</span>
            </div>
            <div className="text-gray-400">
              Connected to Neon Database <code className="text-blue-400 font-mono">late-tooth-83673043</code>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

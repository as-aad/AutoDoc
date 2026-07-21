import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AutoDoc',
  description: 'Garage and mechanic finding web platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
            <Link href="/" className="flex items-center gap-3 font-semibold text-slate-950">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                AD
              </span>
              <span>AutoDoc</span>
            </Link>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm">
              <Link
                href="/admin/garages"
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-white hover:text-slate-950"
              >
                Garage Finder
              </Link>
              <Link
                href="/admin/mechanics"
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-white hover:text-slate-950"
              >
                Mechanics
              </Link>
              <Link
                href="/requests"
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-white hover:text-slate-950"
              >
                Service Requests
              </Link>
              <Link
                href="/garage/requests"
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-white hover:text-slate-950"
              >
                Garage Quotes
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

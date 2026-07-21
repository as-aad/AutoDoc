import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-700">Garage and Mechanic Finder</p>
        <h1 className="text-3xl font-semibold text-slate-950">AutoDoc</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A web platform for finding trusted garages and verified mechanics nearby.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/garages"
          className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Garages
            </span>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
              -&gt;
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-950">Garage Directory</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep service locations, addresses, and contact details ready for users to discover.
          </p>
        </Link>

        <Link
          href="/admin/mechanics"
          className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Mechanics
            </span>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600">
              -&gt;
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-950">Mechanic Network</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review certifications and connect approved mechanics with active garage locations.
          </p>
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getPendingMechanics, verifyMechanic, getGarages } from '@/lib/garageApi';

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const [pending, garageList] = await Promise.all([getPendingMechanics(), getGarages()]);
      setMechanics(pending);
      setGarages(garageList.filter((garage) => garage.isActive));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load mechanics. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleVerify(id) {
    const garageId = selectedGarage[id];
    if (!garageId) {
      setError('Pick a garage to assign before verifying.');
      return;
    }
    try {
      await verifyMechanic(id, garageId);
      setSelectedGarage((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      loadData();
    } catch (err) {
      setError(err.message || 'Verification failed. Try again.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">AutoDoc Mechanic Finder</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Mechanic Verification</h1>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{mechanics.length}</p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Loading pending mechanics...
        </p>
      ) : mechanics.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-950">No mechanics awaiting verification.</p>
          <p className="mt-2 text-sm text-slate-500">New certification requests will appear here.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {mechanics.map((mechanic) => (
            <li
              key={mechanic.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-slate-950">
                      {mechanic.user?.name || mechanic.user?.email || 'Unnamed mechanic'}
                    </p>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{mechanic.user?.email}</p>
                  {mechanic.certificationUrl ? (
                    <a
                      href={mechanic.certificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-medium text-blue-700 underline-offset-4 hover:underline"
                    >
                      View certification
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">No certification uploaded</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    className="min-w-56 rounded-md border border-slate-300 bg-white px-3 py-2.5"
                    value={selectedGarage[mechanic.id] || ''}
                    onChange={(e) =>
                      setSelectedGarage({ ...selectedGarage, [mechanic.id]: e.target.value })
                    }
                  >
                    <option value="">Assign to garage...</option>
                    {garages.map((garage) => (
                      <option key={garage.id} value={garage.id}>
                        {garage.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleVerify(mechanic.id)}
                    className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                  >
                    Verify & Assign
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

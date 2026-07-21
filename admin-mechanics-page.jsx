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
      setGarages(garageList);
      setError('');
    } catch (err) {
      setError('Could not load mechanics. Is the backend running?');
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
      loadData();
    } catch (err) {
      setError('Verification failed. Try again.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Verify Mechanic Certifications</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Loading pending mechanics…</p>
      ) : mechanics.length === 0 ? (
        <p className="text-slate-400">No mechanics awaiting verification.</p>
      ) : (
        <ul className="space-y-4">
          {mechanics.map((m) => (
            <li key={m.id} className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium">{m.user?.name || m.user?.email || 'Unnamed mechanic'}</p>
                {m.certificationUrl ? (
                  <a
                    href={m.certificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    View certification
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">No certification uploaded</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded-md px-2 py-1"
                  value={selectedGarage[m.id] || ''}
                  onChange={(e) =>
                    setSelectedGarage({ ...selectedGarage, [m.id]: e.target.value })
                  }
                >
                  <option value="">Assign to garage…</option>
                  {garages.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleVerify(m.id)}
                  className="bg-slate-900 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-slate-700"
                >
                  Verify & Assign
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

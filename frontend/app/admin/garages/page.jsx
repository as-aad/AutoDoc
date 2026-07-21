'use client';

import { useEffect, useState } from 'react';
import { getGarages, createGarage, updateGarage, deactivateGarage } from '@/lib/garageApi';

const emptyForm = { name: '', address: '', phone: '' };

export default function AdminGaragesPage() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadGarages() {
    try {
      setLoading(true);
      const data = await getGarages();
      setGarages(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load garages. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGarages();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) {
      setError('Name, address, and phone are required.');
      return;
    }

    try {
      if (editingId) {
        await updateGarage(editingId, form);
      } else {
        await createGarage(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadGarages();
    } catch (err) {
      setError(err.message || 'Save failed. Check the fields and try again.');
    }
  }

  function startEdit(garage) {
    setEditingId(garage.id);
    setForm({ name: garage.name, address: garage.address, phone: garage.phone });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleDeactivate(id) {
    try {
      await deactivateGarage(id);
      loadGarages();
    } catch (err) {
      setError(err.message || 'Could not deactivate garage.');
    }
  }

  const activeCount = garages.filter((garage) => garage.isActive).length;
  const mechanicCount = garages.reduce((total, garage) => total + (garage.mechanics?.length || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">AutoDoc Garage Finder</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950">Garage Directory</h1>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-72">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Active</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Mechanics</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{mechanicCount}</p>
          </div>
        </div>
      </div>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5"
            placeholder="Garage name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            className="rounded-md border border-slate-300 bg-white px-3 py-2.5"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="flex flex-wrap gap-2 sm:col-span-3">
            <button
              type="submit"
              className="rounded-md bg-slate-950 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-slate-800"
            >
              {editingId ? 'Update garage' : 'Add garage'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Loading garages...
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Mechanics</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {garages.map((garage) => (
                <tr key={garage.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4 font-medium text-slate-950">{garage.name}</td>
                  <td className="px-4 py-4 text-slate-600">{garage.address}</td>
                  <td className="px-4 py-4 text-slate-600">{garage.phone}</td>
                  <td className="px-4 py-4 text-slate-600">{garage.mechanics?.length || 0}</td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        garage.isActive
                          ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                          : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500'
                      }
                    >
                      {garage.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-3 text-sm font-medium">
                      <button className="text-blue-700 hover:text-blue-900" onClick={() => startEdit(garage)}>
                        Edit
                      </button>
                      {garage.isActive && (
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleDeactivate(garage.id)}>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {garages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No garages yet - add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

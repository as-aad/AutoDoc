'use client';

import { useEffect, useState } from 'react';
import { getGarages, createGarage, updateGarage, deactivateGarage } from '@/lib/garageApi';

export default function AdminGaragesPage() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  async function loadGarages() {
    try {
      setLoading(true);
      const data = await getGarages();
      setGarages(data);
      setError('');
    } catch (err) {
      setError('Could not load garages. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGarages();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) return;
    try {
      if (editingId) {
        await updateGarage(editingId, form);
      } else {
        await createGarage(form);
      }
      setForm({ name: '', address: '', phone: '' });
      setEditingId(null);
      loadGarages();
    } catch (err) {
      setError('Save failed. Check the fields and try again.');
    }
  }

  function startEdit(garage) {
    setEditingId(garage.id);
    setForm({ name: garage.name, address: garage.address, phone: garage.phone });
  }

  async function handleDeactivate(id) {
    await deactivateGarage(id);
    loadGarages();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Garages</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Garage name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-slate-900 text-white rounded-md py-2 font-medium hover:bg-slate-700"
        >
          {editingId ? 'Update garage' : 'Add garage'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Loading garages…</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="py-2">Name</th>
              <th className="py-2">Address</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {garages.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="py-2">{g.name}</td>
                <td className="py-2">{g.address}</td>
                <td className="py-2">{g.phone}</td>
                <td className="py-2">{g.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2 space-x-3">
                  <button className="text-blue-600" onClick={() => startEdit(g)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDeactivate(g.id)}>Deactivate</button>
                </td>
              </tr>
            ))}
            {garages.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  No garages yet — add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

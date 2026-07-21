'use client';

import { useEffect, useState } from 'react';
import { getServiceRequests, createQuote } from '@/lib/garageApi';

export default function GarageRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGarage, setSelectedGarage] = useState({});
  const [quoteNotes, setQuoteNotes] = useState({});

  async function loadData() {
    try {
      setLoading(true);
      const [reqs, garageList] = await Promise.all([getServiceRequests(), fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/garages`).then((r) => r.json())]);
      setRequests(reqs);
      setGarages(garageList);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load requests. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleQuote(requestId) {
    const garageId = selectedGarage[requestId];
    const price = document.getElementById(`price-${requestId}`)?.value;
    const notes = quoteNotes[requestId] || '';
    if (!garageId || price === undefined || price === '') {
      setError('Select a garage and enter a price.');
      return;
    }
    try {
      await createQuote(requestId, { garageId, price: parseFloat(price), notes });
      setSelectedGarage((current) => {
        const next = { ...current };
        delete next[requestId];
        return next;
      });
      setQuoteNotes((current) => {
        const next = { ...current };
        delete next[requestId];
        return next;
      });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit quote.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">AutoDoc Garage Portal</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Open Service Requests</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Browse customer requests and submit your best quote. Compete with other garages on price and service.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Loading requests...
        </p>
      ) : requests.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-400 shadow-sm">
          No service requests yet.
        </p>
      ) : (
        <div className="grid gap-5">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">OPEN</span>
                    <p className="text-lg font-semibold text-slate-950">{req.description}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Vehicle:</span> {req.vehicle?.make} {req.vehicle?.model} ({req.vehicle?.year})
                  </p>
                  <p className="text-xs text-slate-400">
                    Posted by {req.customer?.name || req.customer?.email} on {new Date(req.createdAt).toLocaleString()}
                  </p>
                  {req.photoUrl && (
                    <img src={req.photoUrl} alt="Issue" className="mt-3 h-32 w-32 rounded-lg object-cover ring-1 ring-slate-200" />
                  )}
                  <div className="mt-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Existing Quotes ({req.quotes?.length || 0})</p>
                    <div className="mt-2 space-y-2">
                      {req.quotes?.length === 0 ? (
                        <p className="text-sm text-slate-400">No quotes yet. Be the first to quote.</p>
                      ) : (
                        req.quotes.map((quote) => (
                          <div key={quote.id} className={`rounded-lg border p-3 ${quote.status === 'ACCEPTED' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-slate-950">{quote.garage?.name}</p>
                                <p className="text-lg font-semibold text-emerald-700">${quote.price.toFixed(2)}</p>
                                {quote.notes && <p className="text-xs text-slate-500">{quote.notes}</p>}
                              </div>
                              {quote.status === 'ACCEPTED' && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Accepted</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:w-64">
                  <label className="text-xs font-medium text-slate-500">Your Garage</label>
                  <select
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    value={selectedGarage[req.id] || ''}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, [req.id]: e.target.value })}
                  >
                    <option value="">Select your garage...</option>
                    {garages.map((garage) => (
                      <option key={garage.id} value={garage.id}>
                        {garage.name}
                      </option>
                    ))}
                  </select>
                  <label className="text-xs font-medium text-slate-500">Quote Price ($)</label>
                  <input
                    id={`price-${req.id}`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <label className="text-xs font-medium text-slate-500">Notes (optional)</label>
                  <textarea
                    placeholder="Add any details..."
                    rows={2}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    value={quoteNotes[req.id] || ''}
                    onChange={(e) => setQuoteNotes({ ...quoteNotes, [req.id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleQuote(req.id)}
                    className="mt-1 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 sm:w-auto"
                  >
                    Submit Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

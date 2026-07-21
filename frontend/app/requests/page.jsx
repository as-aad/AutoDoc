'use client';

import { useEffect, useState } from 'react';
import { getServiceRequests, createServiceRequest, acceptQuote } from '@/lib/garageApi';

const emptyForm = { customerId: '', vehicleId: 'VEH_TEST_1', description: '', photoUrl: '' };

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [photoPreview, setPhotoPreview] = useState('');

  async function loadRequests() {
    try {
      setLoading(true);
      const data = await getServiceRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load requests. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm({ ...form, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim()) {
      setError('Description is required.');
      return;
    }
    try {
      await createServiceRequest(form);
      setForm(emptyForm);
      setPhotoPreview('');
      loadRequests();
    } catch (err) {
      setError(err.message || 'Failed to post request.');
    }
  }

  async function handleAcceptQuote(quoteId) {
    try {
      await acceptQuote(quoteId);
      loadRequests();
    } catch (err) {
      setError(err.message || 'Failed to accept quote.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">AutoDoc Service Requests</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-950">Customer Requests</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Describe your repair issue and upload a photo. Garages will submit competing quotes for you to compare.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Post a New Request</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <textarea
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Describe your repair issue..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m9-3l-5.159 5.159a2.25 2.25 0 01-3.182 0l-5.159-5.159M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <span>Upload photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200" />
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-950 px-4 py-3 font-medium text-white shadow-sm hover:bg-slate-800 sm:w-auto"
          >
            Post Service Request
          </button>
        </form>
      </section>

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
          Loading requests...
        </p>
      ) : (
        <div className="grid gap-5">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
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
                </div>
                <div className="sm:w-64">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Quotes ({req.quotes?.length || 0})</p>
                  <div className="mt-2 space-y-2">
                    {req.quotes?.length === 0 ? (
                      <p className="text-sm text-slate-400">No quotes yet.</p>
                    ) : (
                      req.quotes.map((quote) => (
                        <div key={quote.id} className={`rounded-lg border p-3 ${quote.status === 'ACCEPTED' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-950">{quote.garage?.name}</p>
                              <p className="text-lg font-semibold text-blue-700">${quote.price.toFixed(2)}</p>
                              {quote.notes && <p className="text-xs text-slate-500">{quote.notes}</p>}
                            </div>
                            {quote.status === 'ACCEPTED' ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Accepted</span>
                            ) : (
                              <button
                                onClick={() => handleAcceptQuote(quote.id)}
                                className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
                              >
                                Accept
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-400 shadow-sm">
              No service requests yet. Post the first one above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

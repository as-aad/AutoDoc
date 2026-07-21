const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function parseResponse(res, fallbackMessage) {
  let payload = null;

  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    throw new Error(payload?.error || fallbackMessage);
  }

  return payload;
}

export async function getGarages() {
  const res = await fetch(`${API_BASE}/api/admin/garages`, { cache: 'no-store' });
  return parseResponse(res, 'Failed to load garages');
}

export async function createGarage(data) {
  const res = await fetch(`${API_BASE}/api/admin/garages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse(res, 'Failed to create garage');
}

export async function updateGarage(id, data) {
  const res = await fetch(`${API_BASE}/api/admin/garages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse(res, 'Failed to update garage');
}

export async function deactivateGarage(id) {
  const res = await fetch(`${API_BASE}/api/admin/garages/${id}`, { method: 'DELETE' });
  return parseResponse(res, 'Failed to deactivate garage');
}

export async function getPendingMechanics() {
  const res = await fetch(`${API_BASE}/api/admin/mechanics/pending`, { cache: 'no-store' });
  return parseResponse(res, 'Failed to load pending mechanics');
}

export async function verifyMechanic(id, garageId) {
  const res = await fetch(`${API_BASE}/api/admin/mechanics/${id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ garageId }),
  });
  return parseResponse(res, 'Failed to verify mechanic');
}

export async function getServiceRequests() {
  const res = await fetch(`${API_BASE}/api/service-requests`, { cache: 'no-store' });
  return parseResponse(res, 'Failed to load service requests');
}

export async function getServiceRequest(id) {
  const res = await fetch(`${API_BASE}/api/service-requests/${id}`, { cache: 'no-store' });
  return parseResponse(res, 'Failed to load service request');
}

export async function createServiceRequest(data) {
  const res = await fetch(`${API_BASE}/api/service-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse(res, 'Failed to create service request');
}

export async function createQuote(serviceRequestId, data) {
  const res = await fetch(`${API_BASE}/api/service-requests/${serviceRequestId}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse(res, 'Failed to create quote');
}

export async function acceptQuote(quoteId) {
  const res = await fetch(`${API_BASE}/api/service-requests/quotes/${quoteId}/accept`, {
    method: 'PATCH',
  });
  return parseResponse(res, 'Failed to accept quote');
}

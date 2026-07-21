const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getGarages() {
  const res = await fetch(`${API_BASE}/api/admin/garages`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load garages');
  return res.json();
}

export async function createGarage(data) {
  const res = await fetch(`${API_BASE}/api/admin/garages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create garage');
  return res.json();
}

export async function updateGarage(id, data) {
  const res = await fetch(`${API_BASE}/api/admin/garages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update garage');
  return res.json();
}

export async function deactivateGarage(id) {
  const res = await fetch(`${API_BASE}/api/admin/garages/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to deactivate garage');
  return res.json();
}

export async function getPendingMechanics() {
  const res = await fetch(`${API_BASE}/api/admin/mechanics/pending`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load pending mechanics');
  return res.json();
}

export async function verifyMechanic(id, garageId) {
  const res = await fetch(`${API_BASE}/api/admin/mechanics/${id}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ garageId }),
  });
  if (!res.ok) throw new Error('Failed to verify mechanic');
  return res.json();
}

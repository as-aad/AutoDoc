const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// TEMP: swap for the real logged-in user id once M1's auth is wired in.
const TEMP_OWNER_ID = "demo-user-1";

function headers() {
  return { "x-user-id": TEMP_OWNER_ID };
}

export async function fetchVehicles() {
  const res = await fetch(`${API_URL}/api/vehicles`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to load vehicles");
  return res.json();
}

export async function createVehicle(data) {
  const res = await fetch(`${API_URL}/api/vehicles`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to add vehicle");
  return res.json();
}

export async function updateVehicle(id, data) {
  const res = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "PATCH",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update vehicle");
  return res.json();
}

export async function deleteVehicle(id) {
  const res = await fetch(`${API_URL}/api/vehicles/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to delete vehicle");
}

export async function uploadVehicleDocument(vehicleId, file, type) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch(`${API_URL}/api/vehicles/${vehicleId}/documents`, {
    method: "POST",
    headers: headers(),
    body: formData,
  });
  if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
  return res.json();
}

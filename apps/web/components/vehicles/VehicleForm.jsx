"use client";

import { useState } from "react";

export default function VehicleForm({ onSubmit, initial = {} }) {
  const [form, setForm] = useState({
    make: initial.make || "",
    model: initial.model || "",
    year: initial.year || "",
    licensePlate: initial.licensePlate || "",
    vin: initial.vin || "",
    color: initial.color || "",
    mileage: initial.mileage || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
      setForm({ make: "", model: "", year: "", licensePlate: "", vin: "", color: "", mileage: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <div className="form-row">
        <label>Make</label>
        <input value={form.make} onChange={update("make")} required />
      </div>
      <div className="form-row">
        <label>Model</label>
        <input value={form.model} onChange={update("model")} required />
      </div>
      <div className="form-row">
        <label>Year</label>
        <input type="number" value={form.year} onChange={update("year")} required />
      </div>
      <div className="form-row">
        <label>License Plate</label>
        <input value={form.licensePlate} onChange={update("licensePlate")} required />
      </div>
      <div className="form-row">
        <label>VIN (optional)</label>
        <input value={form.vin} onChange={update("vin")} />
      </div>
      <div className="form-row">
        <label>Color (optional)</label>
        <input value={form.color} onChange={update("color")} />
      </div>
      <div className="form-row">
        <label>Mileage</label>
        <input type="number" value={form.mileage} onChange={update("mileage")} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Vehicle"}
      </button>
    </form>
  );
}

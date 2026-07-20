"use client";

import { useState } from "react";
import { uploadVehicleDocument } from "../../lib/api";

const DOC_TYPES = ["REGISTRATION", "INSURANCE", "IMAGE", "OTHER"];

export default function DocumentUpload({ vehicleId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("REGISTRATION");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setError("Choose a file first");
    setError("");
    setUploading(true);
    try {
      const doc = await uploadVehicleDocument(vehicleId, file, type);
      onUploaded?.(doc);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="document-upload">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {DOC_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

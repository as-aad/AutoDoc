"use client";

import { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import { deleteVehicle, updateVehicle } from "../../lib/api";

export default function VehicleCard({ vehicle, onChanged }) {
  const [mileage, setMileage] = useState(vehicle.mileage);
  const [docs, setDocs] = useState(vehicle.documents || []);

  async function saveMileage() {
    await updateVehicle(vehicle.id, { mileage });
    onChanged?.();
  }

  async function handleDelete() {
    if (!confirm(`Remove ${vehicle.make} ${vehicle.model}?`)) return;
    await deleteVehicle(vehicle.id);
    onChanged?.();
  }

  return (
    <div className="vehicle-card">
      <h3>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h3>
      <p>Plate: {vehicle.licensePlate}</p>
      {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
      {vehicle.color && <p>Color: {vehicle.color}</p>}

      <div className="mileage-edit">
        <label>Mileage</label>
        <input
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
        <button onClick={saveMileage}>Update</button>
      </div>

      <button onClick={handleDelete} className="danger">
        Delete Vehicle
      </button>

      <div className="documents">
        <h4>Documents</h4>
        <ul>
          {docs.map((d) => (
            <li key={d.id}>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}${d.fileUrl}`} target="_blank" rel="noreferrer">
                {d.fileName}
              </a>{" "}
              ({d.type})
            </li>
          ))}
        </ul>
        <DocumentUpload
          vehicleId={vehicle.id}
          onUploaded={(doc) => setDocs((prev) => [doc, ...prev])}
        />
      </div>
    </div>
  );
}

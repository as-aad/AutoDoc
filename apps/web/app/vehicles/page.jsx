"use client";

import { useEffect, useState } from "react";
import VehicleForm from "../../components/vehicles/VehicleForm";
import VehicleCard from "../../components/vehicles/VehicleCard";
import { fetchVehicles, createVehicle } from "../../lib/api";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setVehicles(await fetchVehicles());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(data) {
    await createVehicle(data);
    await load();
  }

  return (
    <main className="vehicles-page">
      <h1>My Vehicles</h1>

      <section>
        <h2>Register a Vehicle</h2>
        <VehicleForm onSubmit={handleAdd} />
      </section>

      <section>
        <h2>Your Vehicles</h2>
        {loading && <p>Loading...</p>}
        {!loading && vehicles.length === 0 && <p>No vehicles yet.</p>}
        <div className="vehicle-list">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onChanged={load} />
          ))}
        </div>
      </section>
    </main>
  );
}

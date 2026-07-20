import { prisma } from "../lib/prisma.js";

// TEMP: until M1's auth middleware exists, we read ownerId from a header
// or query param so this feature is independently demoable.
// Replace `getOwnerId` with `req.user.id` once M1 ships auth middleware.
function getOwnerId(req) {
  return req.header("x-user-id") || req.query.ownerId;
}

// GET /api/vehicles  -> list all vehicles for the current owner
export async function listVehicles(req, res) {
  const ownerId = getOwnerId(req);
  if (!ownerId) return res.status(400).json({ error: "Missing ownerId" });

  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });
  res.json(vehicles);
}

// GET /api/vehicles/:id -> single vehicle detail
export async function getVehicle(req, res) {
  const { id } = req.params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { documents: true, reminders: true },
  });
  if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
  res.json(vehicle);
}

// POST /api/vehicles -> register a new vehicle
export async function createVehicle(req, res) {
  const ownerId = getOwnerId(req);
  if (!ownerId) return res.status(400).json({ error: "Missing ownerId" });

  const { make, model, year, licensePlate, vin, color, mileage } = req.body;

  if (!make || !model || !year || !licensePlate) {
    return res
      .status(400)
      .json({ error: "make, model, year, licensePlate are required" });
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        make,
        model,
        year: Number(year),
        licensePlate,
        vin: vin || null,
        color: color || null,
        mileage: mileage ? Number(mileage) : 0,
      },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "licensePlate or VIN already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create vehicle" });
  }
}

// PATCH /api/vehicles/:id -> update vehicle details / mileage
export async function updateVehicle(req, res) {
  const { id } = req.params;
  const { make, model, year, color, mileage, vin } = req.body;

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(make !== undefined && { make }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && { year: Number(year) }),
        ...(color !== undefined && { color }),
        ...(mileage !== undefined && { mileage: Number(mileage) }),
        ...(vin !== undefined && { vin }),
      },
    });
    res.json(vehicle);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
}

// DELETE /api/vehicles/:id
export async function deleteVehicle(req, res) {
  const { id } = req.params;
  try {
    await prisma.vehicle.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
}

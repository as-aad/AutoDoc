import express from "express";
import cors from "cors";
import path from "node:path";
import vehicleRoutes from "./routes/vehicles.js";

export const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded vehicle images/documents
app.use("/uploads/vehicles", express.static(path.resolve("uploads/vehicles")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// M2 — Vehicle Management
app.use("/api/vehicles", vehicleRoutes);

// NOTE for teammates: mount your own module's router here, e.g.
// app.use("/api/auth", authRoutes);          // M1
// app.use("/api/garages", garageRoutes);     // M3
// app.use("/api/repairs", repairRoutes);     // M4

import { prisma } from "../lib/prisma.js";

// POST /api/vehicles/:id/documents  (multipart/form-data, field name: "file")
// body also expects: type = REGISTRATION | INSURANCE | IMAGE | OTHER
export async function uploadVehicleDocument(req, res) {
  const { id: vehicleId } = req.params;
  const { type } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const validTypes = ["REGISTRATION", "INSURANCE", "IMAGE", "OTHER"];
  const docType = validTypes.includes(type) ? type : "OTHER";

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const doc = await prisma.vehicleDocument.create({
    data: {
      vehicleId,
      type: docType,
      fileName: req.file.originalname,
      // Served statically from /uploads — see app.js
      fileUrl: `/uploads/vehicles/${req.file.filename}`,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
    },
  });

  res.status(201).json(doc);
}

// GET /api/vehicles/:id/documents -> list documents for a vehicle
export async function listVehicleDocuments(req, res) {
  const { id: vehicleId } = req.params;
  const docs = await prisma.vehicleDocument.findMany({
    where: { vehicleId },
    orderBy: { uploadedAt: "desc" },
  });
  res.json(docs);
}

// DELETE /api/vehicles/:id/documents/:docId
export async function deleteVehicleDocument(req, res) {
  const { docId } = req.params;
  try {
    await prisma.vehicleDocument.delete({ where: { id: docId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Document not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to delete document" });
  }
}

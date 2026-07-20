import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import {
  uploadVehicleDocument,
  listVehicleDocuments,
  deleteVehicleDocument,
} from "../controllers/vehicleDocumentController.js";

const router = Router();

// Feature 1: Register & manage multiple vehicles
router.get("/", listVehicles);
router.get("/:id", getVehicle);
router.post("/", createVehicle);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

// Feature 2: Vehicle document & image uploads
router.post("/:id/documents", upload.single("file"), uploadVehicleDocument);
router.get("/:id/documents", listVehicleDocuments);
router.delete("/:id/documents/:docId", deleteVehicleDocument);

export default router;

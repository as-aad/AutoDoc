const express = require('express');
const router = express.Router();
const { vehicles, maintenanceReports, serviceBookings } = require('../data/mockStore');

// GET /api/vehicles - List all vehicles
router.get('/', (req, res) => {
  res.json({ success: true, count: vehicles.length, data: vehicles });
});

// GET /api/vehicles/:id - Get specific vehicle
router.get('/:id', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  res.json({ success: true, data: vehicle });
});

// GET /api/vehicles/:id/health - Get vehicle health & subsystem diagnostics
router.get('/:id/health', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  // Find latest maintenance report for subsystem details
  const latestReport = maintenanceReports.find(r => r.vehicleId === req.params.id);

  const healthData = {
    vehicleId: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
    currentMileage: vehicle.currentMileage,
    overallHealthScore: vehicle.healthScore,
    lastServicedAt: vehicle.lastServicedAt,
    systemHealth: latestReport ? latestReport.systemHealth : {
      batteryAndPower: { score: 95, status: "GOOD", notes: "Optimal voltage level" },
      brakes: { score: 90, status: "GOOD", notes: "Pads operating at normal specs" },
      transmissionDrive: { score: 92, status: "GOOD", notes: "Driveline operating smoothly" },
      suspensionSteering: { score: 88, status: "GOOD", notes: "Normal dampening response" },
      electricalElectronics: { score: 94, status: "GOOD", notes: "Zero diagnostic error codes" },
      tiresFluids: { score: 85, status: "WARNING", notes: "Fluids level normal; tires wear checked" }
    },
    upcomingMaintenance: [
      { id: "m-1", task: "Rotate & Balance Tires", recommendedMileage: vehicle.currentMileage + 3000, priority: "MEDIUM" },
      { id: "m-2", task: "Full System Diagnostic & Fluid Check", recommendedMileage: vehicle.currentMileage + 5000, priority: "LOW" },
      { id: "m-3", task: "Cabin Air Filter Replacement", recommendedMileage: vehicle.currentMileage + 8000, priority: "LOW" }
    ]
  };

  res.json({ success: true, data: healthData });
});

// GET /api/vehicles/:id/reports - Get maintenance history & reports
router.get('/:id/reports', (req, res) => {
  const vehicleReports = maintenanceReports.filter(r => r.vehicleId === req.params.id);
  res.json({ success: true, count: vehicleReports.length, data: vehicleReports });
});

// POST /api/vehicles/:id/reports - Add maintenance report
router.post('/:id/reports', (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  const { overallHealthScore, summary, systemHealth, replacedParts, mechanicNotes, garageName, mechanicName } = req.body;

  const newReport = {
    id: `rep-${Date.now()}`,
    vehicleId: vehicle.id,
    bookingId: null,
    serviceDate: new Date().toISOString(),
    garageName: garageName || "AutoDoc Certified Facility",
    mechanicName: mechanicName || "Master Technician",
    overallHealthScore: parseInt(overallHealthScore || 90, 10),
    summary: summary || "Routine vehicle inspection and maintenance.",
    systemHealth: systemHealth || {},
    replacedParts: replacedParts || [],
    mechanicNotes: mechanicNotes || "Vehicle in healthy condition.",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    totalPaid: 150.00
  };

  maintenanceReports.unshift(newReport);
  vehicle.healthScore = newReport.overallHealthScore;
  vehicle.lastServicedAt = newReport.serviceDate;

  res.status(201).json({ success: true, message: 'Maintenance report generated', data: newReport });
});

module.exports = router;

// AutoDoc Data Store (Seeded with comprehensive initial records)

const customers = [
  {
    id: "cust-1",
    name: "Alex Morgan",
    email: "alex.m@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

const garages = [
  {
    id: "gar-1",
    name: "Apex Auto Care & Diagnostics",
    address: "742 Evergreen Terrace, Springfield, OR",
    phone: "+1 (555) 987-6543",
    rating: 4.8,
    totalReviews: 28,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "gar-2",
    name: "Precision Performance Mechanics",
    address: "1200 Industrial Parkway, Suite 4B, Portland, OR",
    phone: "+1 (555) 456-7890",
    rating: 4.9,
    totalReviews: 42,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80"
  }
];

const mechanics = [
  {
    id: "mech-1",
    userId: "u-mech-1",
    garageId: "gar-1",
    garageName: "Apex Auto Care & Diagnostics",
    name: "Marcus Vance",
    specialization: "EV & Hybrid Diagnostics, Brake Systems",
    rating: 4.9,
    totalReviews: 19,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "mech-2",
    userId: "u-mech-2",
    garageId: "gar-2",
    garageName: "Precision Performance Mechanics",
    name: "Sarah Jenkins",
    specialization: "Engine Performance & Powertrain Tuning",
    rating: 4.95,
    totalReviews: 23,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
];

const vehicles = [
  {
    id: "veh-1",
    customerId: "cust-1",
    make: "Tesla",
    model: "Model 3 Performance",
    year: 2022,
    vin: "5YJ3E1EA8NF982314",
    licensePlate: "7XYZ99",
    currentMileage: 28450,
    healthScore: 92,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80",
    lastServicedAt: "2026-06-15T10:00:00Z"
  },
  {
    id: "veh-2",
    customerId: "cust-1",
    make: "BMW",
    model: "M3 Competition",
    year: 2021,
    vin: "WBS83AY040FP12948",
    licensePlate: "M3-POWER",
    currentMileage: 42100,
    healthScore: 84,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80",
    lastServicedAt: "2026-05-10T14:30:00Z"
  }
];

const serviceBookings = [
  {
    id: "bk-101",
    vehicleId: "veh-1",
    vehicleInfo: "2022 Tesla Model 3 Performance",
    customerId: "cust-1",
    garageId: "gar-1",
    garageName: "Apex Auto Care & Diagnostics",
    mechanicId: "mech-1",
    mechanicName: "Marcus Vance",
    serviceType: "Brake Pad Replacement & Battery Health Check",
    description: "Replaced front ceramic brake pads and performed 24-point high-voltage battery diagnostic.",
    status: "COMPLETED",
    cost: 485.00,
    mileageAtService: 28450,
    scheduledDate: "2026-06-15T10:00:00Z",
    completedAt: "2026-06-15T15:45:00Z",
    isRated: false
  },
  {
    id: "bk-102",
    vehicleId: "veh-2",
    vehicleInfo: "2021 BMW M3 Competition",
    customerId: "cust-1",
    garageId: "gar-2",
    garageName: "Precision Performance Mechanics",
    mechanicId: "mech-2",
    mechanicName: "Sarah Jenkins",
    serviceType: "Full Transmission Service & Fluid Flush",
    description: "Dual-clutch transmission fluid renewal, filter replacement, and software recalibration.",
    status: "COMPLETED",
    cost: 720.00,
    mileageAtService: 42100,
    scheduledDate: "2026-05-10T14:30:00Z",
    completedAt: "2026-05-10T18:00:00Z",
    isRated: true
  }
];

const reviews = [
  {
    id: "rev-1",
    bookingId: "bk-102",
    customerId: "cust-1",
    customerName: "Alex Morgan",
    garageId: "gar-2",
    garageName: "Precision Performance Mechanics",
    mechanicId: "mech-2",
    mechanicName: "Sarah Jenkins",
    garageRating: 5,
    mechanicRating: 5,
    comment: "Sarah handled my BMW M3 transmission service impeccably. Shift response is back to factory precision. Highly recommended!",
    createdAt: "2026-05-11T09:15:00Z"
  }
];

const maintenanceReports = [
  {
    id: "rep-1",
    vehicleId: "veh-1",
    bookingId: "bk-101",
    serviceDate: "2026-06-15T15:45:00Z",
    garageName: "Apex Auto Care & Diagnostics",
    mechanicName: "Marcus Vance",
    overallHealthScore: 92,
    summary: "Comprehensive 50-point inspection completed. Vehicle is in excellent operational condition.",
    systemHealth: {
      batteryAndPower: { score: 96, status: "GOOD", notes: "Cell voltage variance within 0.02V. State of Health at 94%." },
      brakes: { score: 98, status: "GOOD", notes: "New Brembo ceramic pads installed. Rotors resurfaced and balanced." },
      transmissionDrive: { score: 90, status: "GOOD", notes: "Front & rear drive units quiet. Fluid levels optimal." },
      suspensionSteering: { score: 88, status: "GOOD", notes: "Bushings sound. Minor alignment drift corrected." },
      electricalElectronics: { score: 95, status: "GOOD", notes: "All sensors, cameras, and ECU firmware updated." },
      tiresFluids: { score: 85, status: "WARNING", notes: "Rear tires at 4/32\" tread. Replacement recommended in 4,000 miles." }
    },
    replacedParts: [
      { name: "Front Ceramic Brake Pad Kit", partNumber: "TR-8821-BP", cost: 240.00, warranty: "2 Years / 24,000 Miles" },
      { name: "Brake Fluid Flush (DOT 4 High Temp)", partNumber: "BF-DOT4-HT", cost: 65.00, warranty: "1 Year" }
    ],
    mechanicNotes: "Owner advised to monitor rear tire tread depth. HV battery pack cooling loop tested clean.",
    invoiceNumber: "INV-2026-0615-01",
    totalPaid: 485.00
  },
  {
    id: "rep-2",
    vehicleId: "veh-2",
    bookingId: "bk-102",
    serviceDate: "2026-05-10T18:00:00Z",
    garageName: "Precision Performance Mechanics",
    mechanicName: "Sarah Jenkins",
    overallHealthScore: 84,
    summary: "Transmission and driveline maintenance executed. Spark plugs and ignition coils need attention soon.",
    systemHealth: {
      batteryAndPower: { score: 82, status: "GOOD", notes: "12V AGM Battery holding charge at 12.6V." },
      brakes: { score: 80, status: "GOOD", notes: "Rotor wear at 60%. Next service estimated in 8,000 miles." },
      transmissionDrive: { score: 96, status: "GOOD", notes: "DCT fluid replaced with Liqui Moly Dual Clutch Oil." },
      suspensionSteering: { score: 84, status: "GOOD", notes: "Adaptive M suspension dampening calibrated." },
      electricalElectronics: { score: 82, status: "WARNING", notes: "Misfire code history detected in Cylinder 3 (intermittent)." },
      tiresFluids: { score: 80, status: "GOOD", notes: "Michelin Pilot Sport 4S tires at 6/32\" tread depth." }
    },
    replacedParts: [
      { name: "BMW M-DCT Fluid & Filter Assembly", partNumber: "83-22-2-148-578", cost: 380.00, warranty: "2 Years" },
      { name: "Transmission Pan & Gasket Set", partNumber: "24-11-7-571-235", cost: 140.00, warranty: "2 Years" }
    ],
    mechanicNotes: "Recommended replacing spark plugs & ignition coils during next visit to clear cylinder 3 code.",
    invoiceNumber: "INV-2026-0510-04",
    totalPaid: 720.00
  }
];

module.exports = {
  customers,
  garages,
  mechanics,
  vehicles,
  serviceBookings,
  reviews,
  maintenanceReports
};

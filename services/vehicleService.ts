import { Vehicle, ApiResponse, VehicleDocument } from '@/lib/types';
import { request } from './api-client';

const mockVehicles: Vehicle[] = [
  {
    id: 'veh-1',
    ownerId: 'user-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    plate: 'ABC-1234',
    licensePlate: 'ABC-1234',
    color: 'Silver',
    vin: '4T1BZ1HK7MU012345',
    mileage: 32500,
    currentMileage: 32500,
    healthScore: 85,
    imageUrl: 'https://images.unsplash.com/photo-1621007947138-2e4eb1c5e6e3?w=800',
    image: 'https://images.unsplash.com/photo-1621007947138-2e4eb1c5e6e3?w=800',
    documents: [
      {
        id: 'doc-1',
        type: 'insurance',
        name: 'Insurance Policy 2024.pdf',
        expiryDate: '2026-09-17',
        uploadedAt: '2025-01-15',
      },
      {
        id: 'doc-2',
        type: 'registration',
        name: 'Vehicle Registration.pdf',
        expiryDate: '2027-03-10',
        uploadedAt: '2025-01-15',
      },
    ],
    maintenanceHistory: [
      {
        id: 'mh-1',
        date: '2026-08-15',
        type: 'Oil Change',
        description: 'Full synthetic oil change with filter replacement',
        cost: 89.99,
        garageName: 'Patel Auto Works',
        mileage: 32500,
      },
      {
        id: 'mh-2',
        date: '2026-05-02',
        type: 'Brake Service',
        description: 'Front brake pad replacement and rotor resurfacing',
        cost: 340.0,
        garageName: 'Downtown Garage',
        mileage: 30100,
      },
    ],
    reminders: [
      {
        id: 'rem-1',
        type: 'insurance',
        title: 'Insurance expires soon',
        dueDate: '2026-09-17',
        daysUntil: 14,
        severity: 'warning',
      },
    ],
  },
  {
    id: 'veh-2',
    ownerId: 'user-1',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    plate: 'XYZ-9876',
    licensePlate: 'XYZ-9876',
    color: 'Blue',
    vin: '2HFCP2F69KH012345',
    mileage: 68200,
    currentMileage: 68200,
    healthScore: 62,
    imageUrl: 'https://images.unsplash.com/photo-1606152421815-9b4e1f0a5a0a?w=800',
    image: 'https://images.unsplash.com/photo-1606152421815-9b4e1f0a5a0a?w=800',
    documents: [
      {
        id: 'doc-4',
        type: 'insurance',
        name: 'Insurance Policy 2024.pdf',
        expiryDate: '2027-01-05',
        uploadedAt: '2025-01-05',
      },
    ],
    maintenanceHistory: [
      {
        id: 'mh-5',
        date: '2026-07-01',
        type: 'Engine Diagnostics',
        description: 'Check engine light diagnostic — O2 sensor replacement',
        cost: 210.0,
        garageName: 'Downtown Garage',
        mileage: 67500,
      },
    ],
    reminders: [
      {
        id: 'rem-3',
        type: 'inspection',
        title: 'Inspection expires in 7 days',
        dueDate: '2026-09-10',
        daysUntil: 7,
        severity: 'urgent',
      },
    ],
  },
  {
    id: 'veh-3',
    ownerId: 'user-1',
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    plate: 'TRK-4455',
    licensePlate: 'TRK-4455',
    color: 'Black',
    vin: '1FTFW1E80PFA12345',
    mileage: 15600,
    currentMileage: 15600,
    healthScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1605559424823-531901e67359?w=800',
    image: 'https://images.unsplash.com/photo-1605559424823-531901e67359?w=800',
    documents: [],
    maintenanceHistory: [],
    reminders: [],
  },
];

export const vehicleService = {
  list: async (ownerId?: string): Promise<ApiResponse<Vehicle[]>> => {
    return request('/api/vehicles', { method: 'GET' }, () => mockVehicles);
  },

  getById: async (id: string): Promise<ApiResponse<Vehicle>> => {
    return request(`/api/vehicles/${id}`, { method: 'GET' }, () => {
      const v = mockVehicles.find((item) => item.id === id);
      if (!v) throw new Error('Vehicle not found');
      return v;
    });
  },

  create: async (data: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    return request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }, () => {
      const newVeh: Vehicle = {
        id: `veh-${Date.now()}`,
        ownerId: data.ownerId || 'user-1',
        make: data.make || 'Unknown',
        model: data.model || 'Unknown',
        year: data.year || new Date().getFullYear(),
        plate: data.plate || data.licensePlate || 'NEW-0000',
        licensePlate: data.licensePlate || data.plate || 'NEW-0000',
        color: data.color || 'Black',
        vin: data.vin || '',
        mileage: data.mileage || data.currentMileage || 0,
        currentMileage: data.currentMileage || data.mileage || 0,
        healthScore: 88,
        imageUrl: data.imageUrl || data.image,
        image: data.image || data.imageUrl,
        documents: [],
        maintenanceHistory: [],
        reminders: [],
      };
      mockVehicles.push(newVeh);
      return newVeh;
    });
  },

  uploadDocument: async (vehicleId: string, formData: FormData): Promise<ApiResponse<VehicleDocument>> => {
    // Standard mult-part data format endpoint test
    const file = formData.get('file') as File;
    const documentType = (formData.get('type') as any) || 'other';

    return request(`/api/vehicles/${vehicleId}/documents`, {
      method: 'POST',
      body: formData,
    }, () => {
      const newDoc: VehicleDocument = {
        id: `doc-${Date.now()}`,
        type: documentType,
        name: file?.name || 'Uploaded_Document.pdf',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      const v = mockVehicles.find((item) => item.id === vehicleId);
      if (v) v.documents.push(newDoc);
      return newDoc;
    });
  },
};

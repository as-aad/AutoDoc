import { Vehicle, VehicleDocument, MaintenanceRecord } from '@/lib/types';
import { VehicleModel } from '@/models/vehicle.model';
import { initDatabase } from '@/lib/db';

export async function getVehicles(ownerId: string): Promise<Vehicle[]> {
  await initDatabase();
  if (!ownerId) return [];
  return VehicleModel.findByOwnerId(ownerId);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  await initDatabase();
  return VehicleModel.findById(id);
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  await initDatabase();

  return VehicleModel.create({
    ownerId: data.ownerId || '',
    make: data.make || 'Toyota',
    model: data.model || 'Corolla',
    year: data.year || new Date().getFullYear(),
    plate: data.plate || 'NEW-001',
    color: data.color || 'Black',
    vin: data.vin || undefined,
    mileage: data.mileage || 15000,
    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
  });
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
  await initDatabase();
  return VehicleModel.findById(id);
}

export async function deleteVehicle(id: string): Promise<boolean> {
  await initDatabase();
  return VehicleModel.delete(id);
}

export async function addVehicleDocument(vehicleId: string, doc: Omit<VehicleDocument, 'id'>) {
  await initDatabase();
  return VehicleModel.addDocument(vehicleId, doc);
}

export async function addMaintenanceRecord(vehicleId: string, rec: Omit<MaintenanceRecord, 'id'>) {
  await initDatabase();
  return VehicleModel.addMaintenanceRecord(vehicleId, rec);
}

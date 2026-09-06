import { VehicleModel } from '@/models/vehicle.model';
import { initDatabase } from '@/lib/db';

export class VehicleController {
  static async getVehiclesByOwner(ownerId: string) {
    await initDatabase();
    const vehicles = await VehicleModel.findByOwnerId(ownerId);
    return { success: true, data: vehicles };
  }

  static async getVehicleById(id: string) {
    await initDatabase();
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) return { success: false, error: 'Vehicle not found' };
    return { success: true, data: vehicle };
  }

  static async createVehicle(data: {
    ownerId: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    color?: string;
    vin?: string;
    mileage?: number;
    imageUrl?: string;
  }) {
    await initDatabase();
    const newVehicle = await VehicleModel.create(data);
    return { success: true, data: newVehicle };
  }

  static async uploadDocument(vehicleId: string, doc: { type: any; name: string; expiryDate: string; fileUrl?: string }) {
    await initDatabase();
    const newDoc = await VehicleModel.addDocument(vehicleId, {
      ...doc,
      uploadedAt: new Date().toISOString().split('T')[0],
    });
    return { success: true, data: newDoc };
  }

  static async addMaintenanceRecord(vehicleId: string, rec: { date: string; type: string; description: string; cost: number; garageName: string; mileage: number }) {
    await initDatabase();
    const newRecord = await VehicleModel.addMaintenanceRecord(vehicleId, rec);
    return { success: true, data: newRecord };
  }

  static async deleteVehicle(id: string) {
    await initDatabase();
    await VehicleModel.delete(id);
    return { success: true };
  }
}

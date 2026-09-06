import { GarageModel } from '@/models/garage.model';
import { initDatabase } from '@/lib/db';

export class GarageController {
  static async getAllGarages() {
    await initDatabase();
    const garages = await GarageModel.findAll();
    return { success: true, data: garages };
  }

  static async getTop5Garages() {
    await initDatabase();
    const topGarages = await GarageModel.findTop5ByRating();
    return { success: true, data: topGarages };
  }

  static async getVerifications() {
    await initDatabase();
    const list = await GarageModel.findVerifications();
    return { success: true, data: list };
  }

  static async updateVerification(id: string, status: 'approved' | 'rejected', reason?: string) {
    await initDatabase();
    await GarageModel.updateVerificationStatus(id, status, reason);
    const updatedList = await GarageModel.findVerifications();
    return { success: true, data: updatedList };
  }
}

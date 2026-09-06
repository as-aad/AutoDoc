import { RequestModel } from '@/models/request.model';
import { initDatabase } from '@/lib/db';

export class RequestController {
  static async getAllRequests() {
    await initDatabase();
    const requests = await RequestModel.findAll();
    return { success: true, data: requests };
  }

  static async getRequestById(id: string) {
    await initDatabase();
    const request = await RequestModel.findById(id);
    if (!request) return { success: false, error: 'Service request not found' };
    return { success: true, data: request };
  }

  static async createRequest(data: {
    vehicleId: string;
    vehicleName: string;
    ownerId: string;
    ownerName: string;
    title: string;
    description: string;
    category?: string;
    photos?: string[];
    location?: string;
    urgency?: 'low' | 'medium' | 'high';
  }) {
    await initDatabase();
    const newReq = await RequestModel.create(data);
    return { success: true, data: newReq };
  }

  static async submitQuote(data: {
    requestId: string;
    garageId: string;
    garageName: string;
    price: number;
    eta: string;
    notes?: string;
    warrantyDays?: number;
  }) {
    await initDatabase();
    const newQuote = await RequestModel.addQuote(data);
    return { success: true, data: newQuote };
  }
}

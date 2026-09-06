import { initDatabase } from '../lib/db';
import {
  getOrdersByUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../models/orderModel';

export class OrderController {
  static async myOrders(userId) {
    await initDatabase();
    if (!userId) return { success: false, error: 'User ID is required' };
    const orders = await getOrdersByUser(userId);
    return { success: true, data: orders };
  }

  static async allOrders() {
    await initDatabase();
    const orders = await getAllOrders();
    return { success: true, data: orders };
  }

  static async getOne(orderId) {
    await initDatabase();
    const order = await getOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };
    return { success: true, data: order };
  }

  static async updateStatus(orderId, status) {
    await initDatabase();
    if (!orderId || !status) {
      return { success: false, error: 'Order ID and status required' };
    }
    const updated = await updateOrderStatus(orderId, status);
    return { success: true, data: updated };
  }
}

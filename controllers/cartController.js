import { initDatabase } from '../lib/db';
import {
  getCartByUser,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../models/cartModel';

export class CartController {
  static async getCart(userId) {
    await initDatabase();
    if (!userId) return { success: false, error: 'User ID is required' };
    const cart = await getCartByUser(userId);
    return { success: true, data: cart };
  }

  static async addItem(userId, productId, quantity = 1) {
    await initDatabase();
    if (!userId || !productId) {
      return { success: false, error: 'User ID and Product ID required' };
    }
    const cart = await addToCart(userId, productId, quantity);
    return { success: true, data: cart };
  }

  static async updateItem(id, quantity) {
    await initDatabase();
    if (!id) return { success: false, error: 'Cart Item ID required' };
    await updateCartItemQuantity(id, quantity);
    return { success: true };
  }

  static async removeItem(id) {
    await initDatabase();
    if (!id) return { success: false, error: 'Cart Item ID required' };
    await removeCartItem(id);
    return { success: true };
  }

  static async clear(userId) {
    await initDatabase();
    if (!userId) return { success: false, error: 'User ID required' };
    await clearCart(userId);
    return { success: true };
  }
}

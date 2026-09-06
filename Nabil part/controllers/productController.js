import { initDatabase } from '../lib/db';
import {
  listActiveProducts,
  listAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../models/productModel';

export class ProductController {
  static async list(category, search) {
    await initDatabase();
    const products = await listActiveProducts(category || null, search || null);
    return { success: true, data: products };
  }

  static async listAll() {
    await initDatabase();
    const products = await listAllProducts();
    return { success: true, data: products };
  }

  static async getOne(id) {
    await initDatabase();
    const product = await getProductById(id);
    if (!product) return { success: false, error: 'Product not found' };
    return { success: true, data: product };
  }

  static async create(data) {
    await initDatabase();
    if (!data.name || !data.category || data.priceCents === undefined) {
      return { success: false, error: 'Name, category, and price are required' };
    }
    const newProduct = await createProduct(data);
    return { success: true, data: newProduct };
  }

  static async update(id, data) {
    await initDatabase();
    const updated = await updateProduct(id, data);
    if (!updated) return { success: false, error: 'Product not found' };
    return { success: true, data: updated };
  }

  static async remove(id) {
    await initDatabase();
    await deleteProduct(id);
    return { success: true };
  }
}

import type { Product } from '@/lib/types';
import {
  getProducts as jsGetProducts,
  getProduct as jsGetProduct,
  createProduct as jsCreateProduct,
  updateProduct as jsUpdateProduct,
  deleteProduct as jsDeleteProduct,
} from './productService';

export async function getProducts(
  category?: string | null,
  search?: string | null,
  admin: boolean = false
): Promise<Product[]> {
  return jsGetProducts(category, search, admin);
}

export async function getProduct(id: string): Promise<Product | null> {
  return jsGetProduct(id);
}

export async function createProduct(data: Partial<Product>): Promise<Product | null> {
  return jsCreateProduct(data);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  return jsUpdateProduct(id, data);
}

export async function deleteProduct(id: string): Promise<boolean> {
  return jsDeleteProduct(id);
}

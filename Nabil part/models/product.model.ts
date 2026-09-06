import { listActiveProducts, listAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from './productModel';

export { listActiveProducts, listAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

export class ProductModel {
  static listActive = listActiveProducts;
  static listAll = listAllProducts;
  static findById = getProductById;
  static create = createProduct;
  static update = updateProduct;
  static delete = deleteProduct;
}

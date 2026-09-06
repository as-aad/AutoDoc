import { getCartByUser, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from './cartModel';

export { getCartByUser, addToCart, updateCartItemQuantity, removeCartItem, clearCart };

export class CartModel {
  static getCartByUser = getCartByUser;
  static addToCart = addToCart;
  static updateQuantity = updateCartItemQuantity;
  static removeItem = removeCartItem;
  static clearCart = clearCart;
}

import {
  createOrderFromCart,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderByStripeSessionId,
  fulfillOrder,
} from './orderModel';

export {
  createOrderFromCart,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  getOrderByStripeSessionId,
  fulfillOrder,
};

export class OrderModel {
  static createOrderFromCart = createOrderFromCart;
  static getById = getOrderById;
  static getOrdersByUser = getOrdersByUser;
  static getAllOrders = getAllOrders;
  static updateStatus = updateOrderStatus;
  static getBySessionId = getOrderByStripeSessionId;
  static fulfillOrder = fulfillOrder;
}

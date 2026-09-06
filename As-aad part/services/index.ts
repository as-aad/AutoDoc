export { authService } from './authService';
export { vehicleService } from './vehicleService';
export { bookingService } from './bookingService';
export { garageService } from './garageService';
export { reviewService } from './reviewService';

// Legacy & Module compatibility exports
export { getVehicles, getVehicle, createVehicle, updateVehicle } from './vehicle-service';
export { getRequests, getRequest, createRequest, getBookings, getBookingsByGarage, getBookingsByMechanic, getBooking, acceptQuote, updateBookingStatus, uploadBeforeAfterPhotos, getOpenRequestsNearby, getBookingMessages, sendBookingMessage } from './request-service';
export { getGarage, getGarageByOwner, updateGarageProfile, getInvoice, getInvoiceByBooking, submitReview } from './garage-service';
export { getAdminStats, getVerificationQueue, approveVerification, rejectVerification, getUsers, toggleUserStatus, getGarageAnalytics } from './admin-service';
export { getCurrentUser, updateProfile } from './auth-service';

// Spare Parts Marketplace & Stripe exports
export { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from './product-service';
export { getCart, addToCart, updateCartItemQuantity, removeCartItem, clearCart } from './cartService';
export { createCheckoutSession } from './checkoutService';
export { getMyOrders, getAllOrders, getOrderBySessionId, updateOrderStatus, fulfillManualOrder } from './orderService';

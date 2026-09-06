// Core domain types for AutoDoc

export type Role = 'customer' | 'mechanic' | 'garage' | 'admin';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  suspensionReason?: string;
  location?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  licensePlate?: string;
  color: string;
  vin: string;
  mileage: number;
  currentMileage?: number;
  healthScore?: number;
  imageUrl?: string;
  image?: string;
  documents: VehicleDocument[];
  maintenanceHistory: MaintenanceRecord[];
  reminders: Reminder[];
}

export interface VehicleDocument {
  id: string;
  type: 'insurance' | 'registration' | 'inspection' | 'warranty' | 'other';
  name: string;
  expiryDate: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  garageName: string;
  mileage: number;
}

export interface Reminder {
  id: string;
  type: 'insurance' | 'inspection' | 'service' | 'registration';
  title: string;
  dueDate: string;
  daysUntil: number;
  severity: 'info' | 'warning' | 'urgent';
}

export type RequestStatus =
  | 'open'
  | 'quoted'
  | 'booked'
  | 'closed';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'customer_approved'
  | 'completed'
  | 'cancelled';

export interface BookingMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  category: string;
  photos: string[];
  location: string;
  status: RequestStatus;
  quotes: Quote[];
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
  acceptedQuoteId?: string;
}

export interface Quote {
  id: string;
  garageId: string;
  garageName: string;
  garageRating: number;
  garageReviewCount: number;
  garageVerified: boolean;
  price: number;
  eta: string;
  etaHours: number;
  notes: string;
  warrantyDays: number;
  createdAt: string;
}

export interface ServiceBooking {
  id: string;
  requestId?: string;
  vehicleId: string;
  vehicleName?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  garageId: string;
  garageName?: string;
  mechanicId?: string;
  mechanicName?: string;
  serviceTitle?: string;
  serviceType: string;
  serviceDescription: string;
  category?: string;
  price?: number;
  cost?: number;
  status: BookingStatus;
  scheduledDate?: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  timeline?: TimelineEvent[];
  invoiceId?: string;
  hasReview?: boolean;
  warrantyDays?: number;
  warrantyExpiry?: string;
}

export type Booking = ServiceBooking;

export interface TimelineEvent {
  id: string;
  status: BookingStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber?: string;
  laborCostCents?: number;
  partsCostJson?: string;
  parts?: Array<{ name: string; costCents: number }>;
  totalCents?: number;
  warrantyMonths?: number;
  warrantyExpiresAt?: string | null;
  pdfUrl?: string | null;
  issuedByUserId?: string;
  issuedAt?: string;
  garageName: string;
  garageAddress: string;
  garagePhone: string;
  customerName: string;
  vehicleName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  issuedDate: string;
  warrantyDays: number;
  warrantyExpiry: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Review {
  id: string;
  bookingId: string;
  garageId: string;
  garageName: string;
  customerName: string;
  customerAvatarUrl?: string;
  garageRating: number;
  mechanicRating?: number;
  comment: string;
  createdAt: string;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Mechanic {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  garageId?: string | null;
  garageName?: string;
  specialization: string;
  credentialUrl: string;
  pendingCredentialUrl?: string;
  applicationStatus: ApplicationStatus;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Garage {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  specialties: string[];
  imageUrl?: string;
  coverUrl?: string;
  openRequests: number;
  completedJobs: number;
  yearsActive: number;
  reviews: Review[];
}

export interface VerificationItem {
  id: string;
  type: 'garage' | 'mechanic';
  name: string;
  email: string;
  submittedAt: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  location: string;
  specialties: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalGarages: number;
  totalMechanics: number;
  activeBookings: number;
  completedBookings: number;
  revenueThisMonth: number;
  pendingVerifications: number;
  totalBookings: number;
  userGrowth: { month: string; users: number }[];
  revenueData: { month: string; revenue: number }[];
}

export interface GarageAnalytics {
  monthlyRevenue: { month: string; revenue: number }[];
  bookingsByStatus: { status: string; count: number }[];
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  averageRating: number;
}

// Spare Parts & Marketplace Domain Types
export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  image?: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: string;
  product: Product;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  productImage?: string;
  productCategory?: string;
  quantity: number;
  priceCentsAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  status: OrderStatus;
  totalCents: number;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

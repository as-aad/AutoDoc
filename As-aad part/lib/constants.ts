import { Role } from './types';

export const APP_NAME = 'AutoDoc';

export const NAV_ITEMS: Record<
  Role,
  { label: string; href: string; icon: string }[]
> = {
  customer: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Vehicles', href: '/vehicles', icon: 'Car' },
    { label: 'My Requests', href: '/requests', icon: 'ClipboardList' },
    { label: 'Bookings', href: '/bookings', icon: 'CalendarCheck' },
    { label: 'Spare Parts Store', href: '/parts', icon: 'Store' },
    { label: 'Order History', href: '/orders', icon: 'Receipt' },
    { label: 'Profile', href: '/profile', icon: 'UserCircle' },
  ],
  mechanic: [
    { label: 'Dashboard', href: '/mechanic', icon: 'LayoutDashboard' },
    { label: 'My Workload', href: '/mechanic/workload', icon: 'Wrench' },
    { label: 'Spare Parts Store', href: '/parts', icon: 'Store' },
    { label: 'Order History', href: '/orders', icon: 'Receipt' },
    { label: 'Profile', href: '/profile', icon: 'UserCircle' },
  ],
  garage: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Open Requests', href: '/garage/requests', icon: 'ClipboardList' },
    { label: 'Bookings', href: '/garage/bookings', icon: 'CalendarCheck' },
    { label: 'Mechanic Applications', href: '/garage/applications', icon: 'UserCheck' },
    { label: 'Spare Parts Store', href: '/parts', icon: 'Store' },
    { label: 'Order History', href: '/orders', icon: 'Receipt' },
    { label: 'Analytics', href: '/garage/analytics', icon: 'BarChart3' },
    { label: 'Garage & Owner Profile', href: '/garage/profile', icon: 'Store' },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Manage Parts', href: '/admin/parts', icon: 'Store' },
    { label: 'Transaction History', href: '/admin/transactions', icon: 'Receipt' },
    { label: 'Disputes Mediation', href: '/admin/disputes', icon: 'ShieldCheck' },
    { label: 'Garages & Mechanics', href: '/admin/garages', icon: 'Store' },
    { label: 'Users', href: '/admin/users', icon: 'Users' },
    { label: 'Profile', href: '/profile', icon: 'UserCircle' },
  ],
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-teal-50 text-teal-700 border-teal-200',
  in_progress: 'bg-amber-100 text-amber-800 border-amber-300',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  open: 'bg-amber-50 text-amber-700 border-amber-200',
  quoted: 'bg-teal-50 text-teal-700 border-teal-200',
  booked: 'bg-amber-100 text-amber-800 border-amber-300',
  closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  PAID: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
  SHIPPED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  open: 'Open',
  quoted: 'Quoted',
  booked: 'Booked',
  closed: 'Closed',
  PENDING: 'Pending Payment',
  PAID: 'Payment Received',
  FAILED: 'Payment Failed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const VEHICLE_MAKES = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Nissan',
  'Hyundai',
  'Volkswagen',
  'Subaru',
  'Kia',
  'Mazda',
  'Lexus',
  'Jeep',
  'Tesla',
  'Other',
];

export const SERVICE_CATEGORIES = [
  'Brakes & Traction',
  'Engine & Diagnostics',
  'Oil & Fluids',
  'Tires & Wheels',
  'Suspension & Steering',
  'Electrical & Battery',
  'Heating & AC',
  'Transmission & Drivetrain',
  'Body & Detailing',
  'General Maintenance',
];

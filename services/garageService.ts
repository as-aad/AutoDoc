import { Garage, ApiResponse, GarageAnalytics } from '@/lib/types';
import { request } from './api-client';

const mockGarages: Garage[] = [
  {
    id: 'garage-1',
    name: 'Patel Auto Works',
    ownerId: 'user-3',
    address: '445 Mission St, San Francisco, CA 94105',
    phone: '+1 (415) 555-0100',
    email: 'info@patelauto.com',
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    specialties: ['Brake Repair', 'Engine Diagnostics', 'Oil Change', 'General Inspection'],
    imageUrl: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c65da7?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1486009598149-48f969c6f3e4?w=1200',
    openRequests: 3,
    completedJobs: 842,
    yearsActive: 12,
    reviews: [],
  },
  {
    id: 'garage-2',
    name: 'Downtown Garage',
    ownerId: 'user-4',
    address: '789 Howard St, San Francisco, CA 94103',
    phone: '+1 (415) 555-0200',
    email: 'service@downtowngarage.com',
    rating: 4.5,
    reviewCount: 89,
    verified: true,
    specialties: ['AC & Heating', 'Battery & Electrical', 'General Inspection'],
    imageUrl: 'https://images.unsplash.com/photo-1486758537021-59fe988c5a8c?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1535063406830-029bce18f75b?w=1200',
    openRequests: 1,
    completedJobs: 534,
    yearsActive: 8,
    reviews: [],
  },
];

export const garageService = {
  getById: async (id: string): Promise<ApiResponse<Garage>> => {
    return request(`/api/garages/${id}`, { method: 'GET' }, () => {
      const g = mockGarages.find((item) => item.id === id) || mockGarages[0];
      return g;
    });
  },

  getAnalytics: async (garageId: string): Promise<ApiResponse<GarageAnalytics>> => {
    return request(`/api/garages/${garageId}/analytics`, { method: 'GET' }, () => ({
      monthlyRevenue: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 13500 },
        { month: 'Mar', revenue: 14200 },
        { month: 'Apr', revenue: 15800 },
        { month: 'May', revenue: 17100 },
        { month: 'Jun', revenue: 18900 },
        { month: 'Jul', revenue: 20300 },
        { month: 'Aug', revenue: 21500 },
        { month: 'Sep', revenue: 22800 },
      ],
      bookingsByStatus: [
        { status: 'Pending', count: 8 },
        { status: 'Accepted', count: 5 },
        { status: 'In Progress', count: 3 },
        { status: 'Completed', count: 42 },
        { status: 'Cancelled', count: 4 },
      ],
      totalRevenue: 166100,
      totalBookings: 62,
      completedBookings: 42,
      averageRating: 4.8,
    }));
  },
};

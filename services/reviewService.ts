import { Review, ApiResponse } from '@/lib/types';
import { request } from './api-client';

export const reviewService = {
  create: async (
    bookingId: string,
    data: {
      garageRating: number;
      mechanicRating?: number;
      comment: string;
      garageId?: string;
      customerName?: string;
    }
  ): Promise<ApiResponse<Review>> => {
    return request(`/api/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, () => {
      const newReview: Review = {
        id: `rev-${Date.now()}`,
        bookingId,
        garageId: data.garageId || 'garage-1',
        garageName: 'Patel Auto Works',
        customerName: data.customerName || 'Alex Morgan',
        garageRating: data.garageRating,
        mechanicRating: data.mechanicRating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
      };
      return newReview;
    });
  },
};

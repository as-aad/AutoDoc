import { AdminStats, VerificationItem, User, GarageAnalytics } from '@/lib/types';
import { initDatabase, sql } from '@/lib/db';
import { UserModel } from '@/models/user.model';
import { GarageModel } from '@/models/garage.model';
import { BookingModel } from '@/models/booking.model';

export async function getAdminStats(): Promise<AdminStats> {
  await initDatabase();

  const users = await UserModel.findAll();
  const garages = await GarageModel.findAll();
  const verifications = await GarageModel.findVerifications();
  const bookings = await BookingModel.findAll();

  const totalUsers = users.length;
  const totalGarages = garages.length;
  const totalMechanics = users.filter((u) => u.role === 'mechanic').length;
  const activeBookings = bookings.filter((b) => b.status === 'in_progress' || b.status === 'accepted').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const pendingVerifications = verifications.filter((v) => v.status === 'pending').length;

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((acc, b) => acc + (b.price || 0), 0);

  return {
    totalUsers,
    totalGarages,
    totalMechanics,
    activeBookings,
    completedBookings,
    revenueThisMonth: totalRevenue,
    pendingVerifications,
    totalBookings: bookings.length,
    userGrowth: [
      { month: 'Apr', users: Math.max(1, totalUsers - 4) },
      { month: 'May', users: Math.max(1, totalUsers - 3) },
      { month: 'Jun', users: Math.max(1, totalUsers - 2) },
      { month: 'Jul', users: Math.max(1, totalUsers - 1) },
      { month: 'Aug', users: totalUsers },
    ],
    revenueData: [
      { month: 'Apr', revenue: Math.round(totalRevenue * 0.2) },
      { month: 'May', revenue: Math.round(totalRevenue * 0.4) },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.6) },
      { month: 'Jul', revenue: Math.round(totalRevenue * 0.8) },
      { month: 'Aug', revenue: totalRevenue },
    ],
  };
}

export async function getVerificationQueue(): Promise<VerificationItem[]> {
  await initDatabase();
  return GarageModel.findVerifications();
}

export async function approveVerification(id: string): Promise<boolean> {
  await initDatabase();
  return GarageModel.updateVerificationStatus(id, 'approved');
}

export async function rejectVerification(id: string, reason: string): Promise<boolean> {
  await initDatabase();
  return GarageModel.updateVerificationStatus(id, 'rejected', reason);
}

export async function getUsers(): Promise<User[]> {
  await initDatabase();
  return UserModel.findAll();
}

export async function toggleUserStatus(id: string): Promise<User | null> {
  await initDatabase();
  const user = await UserModel.findById(id);
  if (!user) return null;
  const newStatus = user.status === 'active' ? 'suspended' : 'active';
  await UserModel.setStatus(id, newStatus, newStatus === 'suspended' ? 'Policy Violation' : undefined);
  return UserModel.findById(id);
}

export async function getGarageAnalytics(garageId: string): Promise<GarageAnalytics> {
  await initDatabase();
  const garage = await GarageModel.findByOwnerId(garageId);
  const bookings = await BookingModel.findByGarage(garageId);
  const completed = bookings.filter((b) => b.status === 'completed');
  const totalRev = completed.reduce((acc, b) => acc + (b.price || 0), 0);

  return {
    monthlyRevenue: [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 0 },
      { month: 'Jul', revenue: 0 },
      { month: 'Aug', revenue: 0 },
      { month: 'Sep', revenue: totalRev },
    ],
    bookingsByStatus: [
      { status: 'Pending', count: bookings.filter((b) => b.status === 'pending').length },
      { status: 'Accepted', count: bookings.filter((b) => b.status === 'accepted').length },
      { status: 'In Progress', count: bookings.filter((b) => b.status === 'in_progress').length },
      { status: 'Completed', count: completed.length },
      { status: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
    ],
    totalRevenue: totalRev,
    totalBookings: bookings.length,
    completedBookings: completed.length,
    averageRating: garage?.rating ? Number(garage.rating) : 0,
  };
}

import { User, ApiResponse, Role } from '@/lib/types';
import { request } from './api-client';

const mockUsers: Record<Role, User> = {
  customer: {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 555-0192',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    createdAt: '2025-06-15',
    status: 'active',
    location: 'San Francisco, CA',
  },
  mechanic: {
    id: 'user-2',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@autodoc.com',
    phone: '+1 (415) 555-0193',
    role: 'mechanic',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    createdAt: '2025-03-20',
    status: 'active',
    location: 'San Francisco, CA',
  },
  garage: {
    id: 'user-3',
    name: 'Sam Patel',
    email: 'sam.patel@patelauto.com',
    phone: '+1 (415) 555-0100',
    role: 'garage',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    createdAt: '2024-11-10',
    status: 'active',
    location: 'San Francisco, CA',
  },
  admin: {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@autodoc.com',
    phone: '+1 (415) 555-0199',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    createdAt: '2024-01-01',
    status: 'active',
    location: 'San Francisco, CA',
  },
};

let currentUser: User = mockUsers.customer;

export const authService = {
  login: async ({ email, password, role }: { email: string; password?: string; role?: Role }): Promise<ApiResponse<User>> => {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }, () => {
      const selectedRole = role || (email.includes('garage') ? 'garage' : email.includes('mechanic') ? 'mechanic' : email.includes('admin') ? 'admin' : 'customer');
      currentUser = { ...mockUsers[selectedRole], email, name: email.split('@')[0] || mockUsers[selectedRole].name };
      return currentUser;
    });
  },

  register: async ({ name, email, password, role, phone }: { name: string; email: string; password?: string; role: Role; phone?: string }): Promise<ApiResponse<User>> => {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phone }),
    }, () => {
      currentUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        location: 'San Francisco, CA',
      };
      return currentUser;
    });
  },

  me: async (): Promise<ApiResponse<User>> => {
    return request('/api/auth/me', {
      method: 'GET',
    }, () => currentUser);
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, () => {
      currentUser = { ...currentUser, ...data };
      return currentUser;
    });
  },

  switchRole: (role: Role): User => {
    currentUser = mockUsers[role];
    return currentUser;
  }
};

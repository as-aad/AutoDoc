'use client';

import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, ShieldCheck, Ban, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers } from '@/services';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DoodleBackground } from '@/components/shared/doodle-background';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Suspension Modal State
  const [suspendingUser, setSuspendingUser] = useState<User | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const u = await getUsers();
      setUsers(u);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendingUser) return;
    if (!suspensionReason.trim()) {
      setError('Please provide a specific violation reason for account suspension.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: suspendingUser.id,
          status: 'suspended',
          reason: suspensionReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((u) =>
          u.map((item) =>
            item.id === suspendingUser.id ? { ...item, status: 'suspended', suspensionReason } : item
          )
        );
        setSuspendingUser(null);
        setSuspensionReason('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to suspend account. Please try again.');
    }
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          status: 'active',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((u) =>
          u.map((item) => (item.id === userId ? { ...item, status: 'active', suspensionReason: undefined } : item))
        );
      }
    } catch (err) {
      console.error('Error unsuspending user:', err);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader title="User Administration & Ban System" description="Monitor platform users, verify roles, and suspend accounts for policy violations." />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by user name or email..."
            className="pl-10 rounded-full border-slate-200 dark:border-slate-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 rounded-full border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ecosystem Roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="mechanic">Mechanics</SelectItem>
            <SelectItem value="garage">Garage Partners</SelectItem>
            <SelectItem value="admin">Administrators</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 font-display text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4 text-left">User Profile</th>
              <th className="hidden px-5 py-4 text-left sm:table-cell">Email</th>
              <th className="hidden px-5 py-4 text-left sm:table-cell">Role</th>
              <th className="hidden px-5 py-4 text-left lg:table-cell">Joined</th>
              <th className="px-5 py-4 text-right">Account Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#606BDF]/10 text-[#606BDF] font-display font-bold text-xs">
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                      {user.suspensionReason && (
                        <p className="text-[11px] text-rose-500 font-medium">Reason: {user.suspensionReason}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-4 text-slate-500 sm:table-cell">{user.email}</td>
                <td className="hidden px-5 py-4 sm:table-cell">
                  <span className="rounded-full bg-[#606BDF]/10 text-[#606BDF] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    {user.role}
                  </span>
                </td>
                <td className="hidden px-5 py-4 text-xs text-slate-500 font-mono lg:table-cell">
                  {user.createdAt}
                </td>
                <td className="px-5 py-4 text-right">
                  {user.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSuspendingUser(user);
                        setSuspensionReason('');
                        setError(null);
                      }}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-full"
                    >
                      <Ban className="mr-1.5 h-3.5 w-3.5" />
                      Suspend Account
                    </Button>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Banned</span>
                      <Button
                        size="sm"
                        onClick={() => handleUnsuspend(user.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Unsuspend
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account Suspension Modal */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10">
                <Ban className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">Suspend Account</h2>
                <p className="text-xs text-slate-500">Ban user from logging in or bidding.</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
              You are suspending <span className="font-semibold text-[#606BDF]">{suspendingUser.name}</span> ({suspendingUser.email}).
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleConfirmSuspend} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="suspension-reason" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Violation & Suspension Reason
                </Label>
                <textarea
                  id="suspension-reason"
                  rows={4}
                  required
                  placeholder="e.g. Repeated cancellation of accepted service jobs or policy violation on quotation terms."
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm focus:border-[#606BDF] focus:outline-none"
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setSuspendingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full">
                  Confirm Suspension
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

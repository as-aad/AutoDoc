'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle2, CalendarCheck, Star } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { useRole } from '@/lib/role-context';
import { getGarageAnalytics } from '@/services';
import type { GarageAnalytics } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const STATUS_COLORS_MAP: Record<string, string> = {
  Pending: '#FF7A29',
  Accepted: '#2B4C5C',
  'In Progress': '#FF7A29',
  Completed: '#3A7D5C',
  Cancelled: '#9CA3AF',
};

export default function GarageAnalyticsPage() {
  const { user } = useRole();
  const [data, setData] = useState<GarageAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const targetGarageId = user?.id || 'user-garage-1';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const a = await getGarageAnalytics(targetGarageId);
      setData(a);
      setLoading(false);
    })();
  }, [targetGarageId]);

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader title="Garage Performance & Financial Analytics" description="Track your garage's real-time revenue, job completion rates, and status distributions directly from database." />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${data?.totalRevenue.toLocaleString()}`} icon={TrendingUp} accent />
        <StatCard label="Total Bookings" value={data?.totalBookings || 0} icon={CalendarCheck} />
        <StatCard label="Completed Jobs" value={data?.completedBookings || 0} icon={CheckCircle2} />
        <StatCard label="Avg Rating" value={`${(data?.averageRating || 5.0).toFixed(1)} ★`} icon={Star} />
      </div>

      {/* Revenue line chart */}
      <div className="hydro-card-surface rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-hydro-display text-lg font-bold">Monthly Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data?.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#FF5500"
              strokeWidth={3}
              dot={{ fill: '#FF5500', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bookings by status bar chart */}
      <div className="hydro-card-surface rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-hydro-display text-lg font-bold">Database Bookings by Status</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data?.bookingsByStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data?.bookingsByStatus.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS_MAP[entry.status] || '#FF5500'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

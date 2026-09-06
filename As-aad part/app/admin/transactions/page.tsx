'use client';

import { useEffect, useState } from 'react';
import { Search, Receipt, DollarSign, TrendingUp, Clock, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllOrders } from '@/services';
import type { Order } from '@/lib/types';

export default function AdminTransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrdersList();
  }, []);

  const fetchOrdersList = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.stripePaymentIntentId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalRevenueCents = orders
    .filter((o) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalCents, 0);

  const paidCount = orders.filter((o) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED').length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const totalOrders = orders.length;

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Stripe Payment Transactions & Order History"
        description="Audit real-time Stripe checkout payments, payment intent references, customer transactions, and order statuses."
      />

      {/* Summary Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue (Paid)" value={`$${(totalRevenueCents / 100).toFixed(2)}`} icon={DollarSign} accent />
        <StatCard label="Total Transactions" value={totalOrders} icon={Receipt} />
        <StatCard label="Successful Payments" value={paidCount} icon={CheckCircle2} />
        <StatCard label="Pending Checkout" value={pendingCount} icon={Clock} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by buyer, order ID, or Stripe payment ID..."
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PAID">PAID</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="hydro-card-surface overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/40 font-hydro-display uppercase text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Buyer Customer</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Stripe Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Fetching payment transactions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <p className="font-hydro-display font-bold font-mono text-foreground text-sm">{order.id}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-foreground">{order.userName || 'Customer'}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{order.userEmail || 'N/A'}</p>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        {order.items.map((i) => (
                          <div key={i.id} className="text-[11px] text-foreground font-medium">
                            • {i.productName} (x{i.quantity})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-hydro-display font-black text-sm text-[#FF5500]">
                      ${(order.totalCents / 100).toFixed(2)}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      {order.stripePaymentIntentId ? (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CreditCard className="h-3 w-3" /> {order.stripePaymentIntentId}
                        </span>
                      ) : order.stripeCheckoutSessionId ? (
                        <span className="text-muted-foreground truncate max-w-[180px] block">
                          Session: {order.stripeCheckoutSessionId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-sans">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

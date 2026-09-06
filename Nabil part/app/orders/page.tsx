'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Receipt, Package, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/lib/role-context';
import { getMyOrders } from '@/services';
import type { Order } from '@/lib/types';

const FILTERS = [
  { value: 'all', label: 'All Orders' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PENDING', label: 'Pending Payment' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function OrdersPage() {
  const { user } = useRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const userId = user?.id || 'user-customer-1';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMyOrders(userId);
      setOrders(data);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;
  }

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Spare Parts Order History"
        description="View your past transactions, track shipment statuses, and inspect Stripe payment references."
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap border-b border-border bg-transparent p-0 rounded-none h-auto gap-2">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="data-[state=active]:border-[#FF5500] data-[state=active]:text-[#FF5500] border-b-2 border-transparent rounded-none px-4 py-2.5 font-hydro-display font-bold text-xs uppercase"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Orders Found"
          description="Your spare parts order history will appear here after completing a purchase."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-hydro-display text-base font-bold font-mono text-foreground">{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-[#FF5500]" />
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-hydro-display uppercase tracking-widest text-muted-foreground">Total Charged</p>
                  <p className="font-hydro-display text-xl font-black text-[#FF5500]">
                    ${(order.totalCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-2.5">
                      <Package className="h-4 w-4 text-[#FF5500] shrink-0" />
                      <span className="font-bold text-foreground">{item.productName}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      ${((item.priceCentsAtPurchase * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {order.stripePaymentIntentId && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono pt-1">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Stripe Payment Intent: {order.stripePaymentIntentId}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

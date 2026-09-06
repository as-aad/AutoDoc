'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, Receipt, ShoppingBag } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { getOrderBySessionId, fulfillManualOrder } from '@/services';
import type { Order } from '@/lib/types';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isMock = searchParams.get('mock') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      // Fulfill order status if in test mode or webhook delay
      let o = await fulfillManualOrder(sessionId);
      if (!o) {
        o = await getOrderBySessionId(sessionId);
      }

      setOrder(o);
      setLoading(false);
    })();
  }, [sessionId]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  }

  return (
    <div className="space-y-8 font-hydro-body max-w-3xl mx-auto">
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xl animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-hydro-display text-3xl sm:text-4xl font-black text-foreground">
          Payment Successful!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Thank you for your order. Your Stripe payment has been confirmed and your spare parts are being prepared for dispatch.
        </p>
      </div>

      {order ? (
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-hydro-display uppercase tracking-widest text-muted-foreground">Order Reference</p>
              <p className="font-hydro-display text-lg font-bold text-foreground font-mono">{order.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-3">
            <h3 className="font-hydro-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Purchased Components</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-hydro-display font-bold text-foreground">{item.productName}</p>
                    <p className="text-xs text-muted-foreground font-mono">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-hydro-display font-bold text-[#FF5500]">
                  ${((item.priceCentsAtPurchase * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Total Paid via Stripe</p>
              {order.stripePaymentIntentId && (
                <p className="text-[11px] font-mono text-muted-foreground/80">Ref: {order.stripePaymentIntentId}</p>
              )}
            </div>
            <p className="font-hydro-display text-2xl font-black text-emerald-500">
              ${(order.totalCents / 100).toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button asChild className="flex-1 bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider h-11 rounded-xl">
              <Link href="/orders">
                <Receipt className="mr-2 h-4 w-4" /> View My Order History
              </Link>
            </Button>

            <Button asChild variant="outline" className="rounded-xl h-11 px-6 font-hydro-display font-bold uppercase text-xs tracking-wider">
              <Link href="/parts">
                <ShoppingBag className="mr-2 h-4 w-4" /> Return to Parts Store
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center pt-4">
          <Button asChild className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider rounded-full px-8 py-3">
            <Link href="/orders">Go to My Orders</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

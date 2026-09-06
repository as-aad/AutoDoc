'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/role-context';
import { getCart, updateCartItemQuantity, removeCartItem, clearCart, createCheckoutSession } from '@/services';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const { user } = useRole();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id || 'user-customer-1';

  const loadCart = async () => {
    setLoading(true);
    const items = await getCart(userId);
    setCart(items);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty <= 0) {
      await handleRemoveItem(id);
      return;
    }
    await updateCartItemQuantity(id, newQty);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(id);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = async () => {
    await clearCart(userId);
    setCart([]);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    setError(null);

    try {
      const res = await createCheckoutSession(userId);
      if (res.success && res.url) {
        // Redirect to Stripe Hosted Checkout URL
        window.location.href = res.url;
      } else {
        setError(res.error || 'Failed to initialize Stripe checkout session.');
        setCheckingOut(false);
      }
    } catch (err: any) {
      setError('Error initiating checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  const subtotalCents = cart.reduce(
    (sum, item) => sum + (item.product?.priceCents || 0) * (item.quantity || 1),
    0
  );
  const totalCents = subtotalCents;

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;
  }

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Shopping Cart & Order Checkout"
        description="Review your selected spare parts, adjust quantities, and proceed to secure Stripe payment."
        backHref="/parts"
      />

      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your Shopping Cart is Empty"
          description="Browse our certified spare parts marketplace to add brake pads, oils, filters, and accessories."
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-hydro-display text-lg font-bold">Cart Items ({cart.length})</h2>
              <button
                onClick={handleClearCart}
                className="text-xs text-muted-foreground hover:text-red-500 font-bold uppercase tracking-wider"
              >
                Clear Cart
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 p-4 text-xs font-bold text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="hydro-card-surface flex flex-col sm:flex-row items-start sm:items-center justify-between p-4.5 rounded-2xl border border-border gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800'}
                        alt={item.product?.name || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link href={`/parts/${item.productId}`} className="font-hydro-display font-bold text-base hover:text-[#FF5500] truncate block">
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.product?.category}</p>
                      <p className="font-hydro-display text-sm font-bold text-[#FF5500] sm:hidden mt-1">
                        ${((item.product?.priceCents || 0) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-xl border border-border bg-secondary/40 p-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background text-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-hydro-display font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="hidden sm:block text-right min-w-[90px]">
                      <p className="font-hydro-display text-base font-bold text-[#FF5500]">
                        ${(((item.product?.priceCents || 0) * item.quantity) / 100).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">${((item.product?.priceCents || 0) / 100).toFixed(2)} ea</p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" className="rounded-full text-xs font-bold uppercase tracking-wider">
                <Link href="/parts">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar (1 Col) */}
          <div className="space-y-6">
            <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-5">
              <h2 className="font-hydro-display text-lg font-bold border-b border-border pb-3">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.length} item types)</span>
                  <span className="font-bold text-foreground">${(subtotalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-emerald-500">FREE</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span className="font-bold text-foreground">Included</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="font-hydro-display text-base font-bold">Total Amount</span>
                  <span className="font-hydro-display text-2xl font-black text-[#FF5500]">
                    ${(totalCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={checkingOut || cart.length === 0}
                className="w-full bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider h-12 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                {checkingOut ? (
                  'Preparing Checkout...'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Proceed to Stripe Checkout
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>256-bit Encrypted SSL Payment by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

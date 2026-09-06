'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Tag, Check, ShieldCheck, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/role-context';
import { getProduct, addToCart } from '@/services';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useRole();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getProduct(params.id);
      setProduct(p);
      setLoading(false);
    })();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const userId = user?.id || 'user-customer-1';
    setAdding(true);
    await addToCart(userId, product.id, quantity);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  }

  if (!product) {
    return (
      <div className="space-y-6 text-center py-12">
        <h2 className="font-hydro-display text-xl font-bold">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested spare part could not be located in our inventory.</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/parts">Back to Parts Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title={product.name}
        description={`Category: ${product.category} • Certified OEM Automotive Part`}
        backHref="/parts"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Image Gallery Card */}
        <div className="hydro-card-surface p-6 rounded-2xl border border-border flex items-center justify-center bg-secondary/20">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#FF5500]" /> {product.category}
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Purchasing Card */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mb-3 ${
                product.stockQuantity > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </span>
              <h1 className="font-hydro-display text-2xl sm:text-3xl font-bold text-foreground">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3 border-y border-border py-4">
              <span className="font-hydro-display text-3xl sm:text-4xl font-black text-[#FF5500]">
                ${(product.priceCents / 100).toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">USD (Taxes included)</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-hydro-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Description</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Select Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-border bg-secondary/40 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-background text-foreground disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-hydro-display font-bold text-base">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))}
                    disabled={quantity >= (product.stockQuantity || 99)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-background text-foreground disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                  Subtotal: <span className="font-bold text-foreground">${((product.priceCents * quantity) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0 || adding}
                className="flex-1 bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider h-12 rounded-xl shadow-lg"
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Added to Cart!
                  </>
                ) : adding ? (
                  'Adding to Cart...'
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add {quantity} to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={async () => {
                  await handleAddToCart();
                  router.push('/cart');
                }}
                disabled={product.stockQuantity <= 0}
                className="rounded-xl h-12 px-6 font-hydro-display font-bold uppercase text-xs tracking-wider"
              >
                Buy Now
              </Button>
            </div>

            {/* Value Props Badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 rounded-xl bg-secondary/30 border border-border/50 text-[11px] font-bold text-muted-foreground flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-[#FF5500]" /> Express Shipping
              </div>
              <div className="p-2 rounded-xl bg-secondary/30 border border-border/50 text-[11px] font-bold text-muted-foreground flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#FF5500]" /> OEM Guaranteed
              </div>
              <div className="p-2 rounded-xl bg-secondary/30 border border-border/50 text-[11px] font-bold text-muted-foreground flex flex-col items-center gap-1">
                <RefreshCw className="h-4 w-4 text-[#FF5500]" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

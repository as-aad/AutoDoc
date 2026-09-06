'use client';

import Link from 'next/link';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return (
    <div className="space-y-8 font-hydro-body max-w-xl mx-auto text-center py-12">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xl">
        <XCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="font-hydro-display text-3xl font-bold text-foreground">
          Payment Cancelled
        </h1>
        <p className="text-sm text-muted-foreground">
          Your Stripe Checkout session was cancelled. No charges were made to your card and your cart items remain saved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button asChild className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg">
          <Link href="/cart">
            <ShoppingCart className="mr-2 h-4 w-4" /> Return to Cart & Retry
          </Link>
        </Button>

        <Button asChild variant="outline" className="rounded-full px-6 py-3 font-hydro-display font-bold uppercase text-xs tracking-wider">
          <Link href="/parts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Spare Parts
          </Link>
        </Button>
      </div>
    </div>
  );
}

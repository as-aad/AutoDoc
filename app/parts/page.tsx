'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Tag, Check, Package } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRole } from '@/lib/role-context';
import { getProducts, getCart, addToCart } from '@/services';
import type { Product, CartItem } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Brakes',
  'Fluids & Chemicals',
  'Engine Parts',
  'Electrical & Ignition',
  'Suspension & Steering',
];

export default function PartsMarketplacePage() {
  const { user } = useRole();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const catParam = selectedCategory === 'All' ? null : selectedCategory;
      const searchParam = search.trim() === '' ? null : search;

      const [pList, cList] = await Promise.all([
        getProducts(catParam, searchParam),
        user?.id ? getCart(user.id) : Promise.resolve([]),
      ]);
      setProducts(pList);
      setCart(cList);
      setLoading(false);
    })();
  }, [selectedCategory, search, user?.id]);

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id || 'user-customer-1';
    setAddingId(productId);
    const updatedCart = await addToCart(userId, productId, 1);
    setCart(updatedCart);
    setAddingId(null);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 2000);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="OEM Spare Parts Marketplace"
        description="Browse certified automotive replacement components, performance parts, and fluids with fast delivery."
      >
        <Button asChild className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-6 py-2.5 rounded-full shadow-lg relative">
          <Link href="/cart">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {totalCartCount > 0 && (
              <span className="ml-2 rounded-full bg-white text-[#FF5500] font-black text-[11px] px-2 py-0.5 shadow-sm">
                {totalCartCount}
              </span>
            )}
          </Link>
        </Button>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold font-hydro-display uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF5500] text-white shadow-md'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts by name or OEM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-card border border-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Spare Parts Found"
          description="Try adjusting your search criteria or category filter to find vehicle replacement parts."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} href={`/parts/${p.id}`}>
              <div className="hydro-card-surface group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border hover:border-[#FF5500]/40 transition-all shadow-sm">
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800'}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3 text-[#FF5500]" /> {p.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-hydro-display font-bold text-base text-foreground group-hover:text-[#FF5500] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Price & Add to Cart */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    <div>
                      <p className="text-[10px] font-hydro-display uppercase tracking-widest text-muted-foreground">Price</p>
                      <p className="font-hydro-display text-lg font-black text-[#FF5500]">
                        ${(p.priceCents / 100).toFixed(2)}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      p.stockQuantity > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <Button
                    onClick={(e) => handleAddToCart(e, p.id)}
                    disabled={p.stockQuantity <= 0 || addingId === p.id}
                    className="w-full bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider h-10 rounded-xl shadow-md transition-transform hover:scale-[1.02]"
                  >
                    {addedId === p.id ? (
                      <>
                        <Check className="mr-1.5 h-4 w-4" /> Added to Cart!
                      </>
                    ) : addingId === p.id ? (
                      'Adding...'
                    ) : (
                      <>
                        <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Store, Edit3, Power, Check, Tag, Package, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Brakes',
  'Fluids & Chemicals',
  'Engine Parts',
  'Electrical & Ignition',
  'Suspension & Steering',
  'Accessories',
];

export default function AdminPartsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal Dialog State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    priceDollars: '',
    category: 'Brakes',
    stockQuantity: '20',
    image: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts(null, null, true);
    setProducts(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      priceDollars: '',
      category: 'Brakes',
      stockQuantity: '20',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      priceDollars: (p.priceCents / 100).toString(),
      category: p.category,
      stockQuantity: p.stockQuantity.toString(),
      image: p.image || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.priceDollars) return;

    setSaving(true);
    const priceCents = Math.round(parseFloat(form.priceDollars) * 100);
    const stockQuantity = parseInt(form.stockQuantity) || 0;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: form.name,
        description: form.description,
        priceCents,
        category: form.category,
        stockQuantity,
        image: form.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800',
      });
    } else {
      await createProduct({
        name: form.name,
        description: form.description,
        priceCents,
        category: form.category,
        stockQuantity,
        image: form.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800',
        isActive: true,
      });
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleToggleActive = async (p: Product) => {
    if (p.isActive) {
      await deleteProduct(p.id); // Soft delete via is_active = false
    } else {
      await updateProduct(p.id, { isActive: true });
    }
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Spare Parts Inventory & Catalog Management"
        description="Add new spare parts to the store, modify product prices, update stock levels, and toggle product active status."
      >
        <Button
          onClick={handleOpenAdd}
          className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-6 py-2.5 rounded-full shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Spare Part
        </Button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts catalog by name or category..."
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Admin Products Table */}
      <div className="hydro-card-surface overflow-hidden rounded-2xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/40 font-hydro-display uppercase text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="p-4">Product Component</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (USD)</th>
                <th className="p-4">Stock Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading inventory catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No spare parts matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1600706432523-988185b0e012?w=800'}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-hydro-display font-bold text-sm text-foreground">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground border border-border">
                        <Tag className="h-3 w-3 text-[#FF5500]" /> {p.category}
                      </span>
                    </td>

                    <td className="p-4 font-hydro-display font-black text-sm text-[#FF5500]">
                      ${(p.priceCents / 100).toFixed(2)}
                    </td>

                    <td className="p-4 font-mono font-bold">
                      {p.stockQuantity} pcs
                    </td>

                    <td className="p-4">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        p.isActive
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {p.isActive ? 'Active Storefront' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(p)}
                          className="h-8 rounded-lg text-xs"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant={p.isActive ? 'destructive' : 'outline'}
                          onClick={() => handleToggleActive(p)}
                          className="h-8 rounded-lg text-xs"
                        >
                          <Power className="h-3.5 w-3.5 mr-1" />
                          {p.isActive ? 'Deactivate' : 'Reactivate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="hydro-card-surface w-full max-w-lg rounded-2xl border border-border p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-hydro-display text-lg font-bold">
                {editingProduct ? 'Edit Product Details' : 'Add New Spare Part to Store'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-hydro-body">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Part Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Brembo Ceramic Brake Pads"
                  className="rounded-xl h-11"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger id="category" className="rounded-xl h-11">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="64.99"
                    className="rounded-xl h-11 font-mono font-bold"
                    value={form.priceDollars}
                    onChange={(e) => setForm({ ...form, priceDollars: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider">Initial Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="25"
                    className="rounded-xl h-11 font-mono"
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="image" className="text-xs font-bold uppercase tracking-wider">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-xl h-11"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed specifications, vehicle compatibility, and warranty info..."
                  className="rounded-xl min-h-[90px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 rounded-full shadow-lg">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, MapPin, Wrench, Star, Phone, Mail, User, Camera, Check, Plus, X, Building, Award } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRole } from '@/lib/role-context';
import { getGarageByOwner, updateGarageProfile, getCurrentUser, updateProfile } from '@/services';
import type { Garage, Review, User as UserType } from '@/lib/types';

export default function UnifiedGarageProfilePage() {
  const { user: sessionUser, userName, userEmail } = useRole();
  const [garage, setGarage] = useState<Garage | null>(null);
  const [userRecord, setUserRecord] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable Form State (Combined Owner + Garage Business Details)
  const [form, setForm] = useState({
    // Owner Personal Credentials
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerLocation: '',
    avatarUrl: '',
    // Garage Business Credentials
    garageName: '',
    garageAddress: '',
    garagePhone: '',
    garageEmail: '',
    imageUrl: '',
    coverUrl: '',
    specialties: [] as string[],
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ownerId = sessionUser?.id || 'user-garage-1';
      const email = sessionUser?.email || userEmail;

      const [g, u] = await Promise.all([
        getGarageByOwner(ownerId),
        email ? getCurrentUser(email) : Promise.resolve(null),
      ]);

      setGarage(g);
      setUserRecord(u);

      setForm({
        // Owner Details
        ownerName: u?.name || userName || 'Marcus Thorne',
        ownerEmail: u?.email || userEmail || 'owner@apexmotors.com',
        ownerPhone: u?.phone || '+1 (415) 555-0100',
        ownerLocation: u?.location || 'San Francisco, CA',
        avatarUrl: u?.avatarUrl || u?.avatar || '',
        // Garage Business Details
        garageName: g?.name || 'Apex Performance Motors',
        garageAddress: g?.address || '1044 Market Street, San Francisco, CA',
        garagePhone: g?.phone || '+1 (415) 555-0100',
        garageEmail: g?.email || 'service@apexperformance.com',
        imageUrl: g?.imageUrl || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800',
        coverUrl: g?.coverUrl || 'https://images.unsplash.com/photo-1486009598149-48f969c6f3e4?w=1200',
        specialties: g?.specialties && g.specialties.length > 0
          ? g.specialties
          : ['Brakes', 'EV Diagnostics', 'Engine Remap', 'Oil Change'],
      });

      setLoading(false);
    })();
  }, [sessionUser, userName, userEmail]);

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    if (!form.specialties.includes(newSpecialty.trim())) {
      setForm((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (spec: string) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== spec),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const ownerId = sessionUser?.id || 'user-garage-1';

      // 1. Update Owner Account Credentials in Database
      const updatedUser = await updateProfile({
        id: ownerId,
        email: form.ownerEmail,
        name: form.ownerName,
        phone: form.ownerPhone,
        location: form.ownerLocation,
        avatarUrl: form.avatarUrl,
      });

      // 2. Update Garage Business Credentials in Database
      const updatedGarage = await updateGarageProfile({
        ownerId,
        name: form.garageName,
        address: form.garageAddress,
        phone: form.garagePhone,
        email: form.garageEmail,
        specialties: form.specialties,
        imageUrl: form.imageUrl,
        coverUrl: form.coverUrl,
      });

      if (updatedUser) setUserRecord(updatedUser);
      if (updatedGarage) setGarage(updatedGarage);

      // Update session storage so header name and avatar reflect immediately
      if (typeof window !== 'undefined') {
        const storedSession =
          sessionStorage.getItem('autodoc_tab_jwt_session') ||
          localStorage.getItem('autodoc_tab_jwt_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          parsed.user = {
            ...parsed.user,
            name: form.ownerName,
            phone: form.ownerPhone,
            location: form.ownerLocation,
            avatarUrl: form.avatarUrl,
          };
          const newStr = JSON.stringify(parsed);
          sessionStorage.setItem('autodoc_tab_jwt_session', newStr);
          localStorage.setItem('autodoc_tab_jwt_session', newStr);
        }
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving merged profile:', err);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  }

  const reviewsList: Review[] = garage?.reviews || [];

  const ownerInitials = (form.ownerName || 'Owner')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title={form.garageName ? `${form.garageName} — Garage Profile` : "Garage Business & Owner Profile"}
        description="Unified management portal for certified garage credentials, business details, specialties, and owner account settings."
      >
        {garage?.verified !== false ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-500">
            <ShieldCheck className="h-4 w-4" /> Verified Partner Garage
          </span>
        ) : (
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-500">
            Verification Pending
          </span>
        )}
      </PageHeader>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Cover Photo Branding Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/30 aspect-[3/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.coverUrl || 'https://images.unsplash.com/photo-1486009598149-48f969c6f3e4?w=1200'}
            alt="Garage Cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-xl border-2 border-background shadow-lg bg-card shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800'}
                  alt="Garage Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-hydro-display text-2xl font-bold text-foreground drop-shadow-sm">
                  {form.garageName || 'My Garage Shop'}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-[#FF5500]" /> {form.garageAddress || 'Address not set'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <StarRating rating={garage?.rating || 0} size="sm" showValue reviewCount={garage?.reviewCount || 0} />
            </div>
          </div>
        </div>

        {/* Section 1: Garage Business Details Card (Editable) */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-hydro-display font-bold text-lg">Garage Business Information</h2>
                <p className="text-xs text-muted-foreground">Public shop details, location, and customer contact line.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
              Editable Business Details
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="garageName" className="text-xs font-bold uppercase tracking-wider">Garage Shop Name</Label>
                <Input
                  id="garageName"
                  className="h-11 rounded-xl font-bold"
                  value={form.garageName}
                  onChange={(e) => setForm({ ...form, garageName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="garagePhone" className="text-xs font-bold uppercase tracking-wider">Garage Shop Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="garagePhone"
                    className="pl-10 h-11 rounded-xl font-mono"
                    value={form.garagePhone}
                    onChange={(e) => setForm({ ...form, garagePhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="garageEmail" className="text-xs font-bold uppercase tracking-wider">Garage Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="garageEmail"
                    type="email"
                    className="pl-10 h-11 rounded-xl font-mono"
                    value={form.garageEmail}
                    onChange={(e) => setForm({ ...form, garageEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="garageAddress" className="text-xs font-bold uppercase tracking-wider">Garage Physical Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="garageAddress"
                    className="pl-10 h-11 rounded-xl"
                    value={form.garageAddress}
                    onChange={(e) => setForm({ ...form, garageAddress: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-wider">Logo Image URL</Label>
                <Input
                  id="imageUrl"
                  className="h-11 rounded-xl text-xs font-mono"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coverUrl" className="text-xs font-bold uppercase tracking-wider">Cover Image URL</Label>
                <Input
                  id="coverUrl"
                  className="h-11 rounded-xl text-xs font-mono"
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Specialties Editor */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold uppercase tracking-wider block">Certified Service Specialties</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.specialties.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/20 px-3 py-1.5 text-xs font-hydro-display font-bold text-[#FF5500]">
                    {s}
                    <button type="button" onClick={() => handleRemoveSpecialty(s)} className="hover:text-red-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md">
                <Input
                  placeholder="e.g. Brake Repair, EV Diagnostics..."
                  className="h-10 rounded-xl"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialty}
                  variant="outline"
                  className="h-10 px-4 rounded-xl font-hydro-display font-bold text-xs uppercase"
                >
                  <Plus className="mr-1.5 h-4 w-4 text-[#FF5500]" /> Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Owner Personal & Account Security Credentials (Editable) */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-hydro-display font-bold text-lg">Garage Owner Personal Credentials</h2>
                <p className="text-xs text-muted-foreground">Owner personal contact, authentication account, and profile picture.</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
              <ShieldCheck className="h-4 w-4" /> Garage Owner Role
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-border shadow-md">
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-[#FF5500] text-white font-hydro-display text-xl font-bold">
                    {ownerInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-md transition-transform hover:scale-110"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, avatarUrl: URL.createObjectURL(file) });
                }}
                className="hidden"
              />
            </div>
            <div className="space-y-1">
              <p className="font-hydro-display font-bold text-xl text-foreground">{form.ownerName}</p>
              <p className="text-xs text-muted-foreground font-mono">{form.ownerEmail} • Certified Owner of {form.garageName || 'Garage'}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="pt-1 text-xs text-[#FF5500] hover:underline font-bold block"
              >
                Change owner avatar photo
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ownerName" className="text-xs font-bold uppercase tracking-wider">Owner Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ownerName"
                    className="pl-10 h-11 rounded-xl"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerEmail" className="text-xs font-bold uppercase tracking-wider">Account Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ownerEmail"
                    type="email"
                    className="pl-10 h-11 rounded-xl bg-secondary/50 font-mono"
                    value={form.ownerEmail}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ownerPhone" className="text-xs font-bold uppercase tracking-wider">Owner Personal Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ownerPhone"
                    className="pl-10 h-11 rounded-xl font-mono"
                    value={form.ownerPhone}
                    onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ownerLocation" className="text-xs font-bold uppercase tracking-wider">Owner Primary City / State</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="ownerLocation"
                    className="pl-10 h-11 rounded-xl"
                    value={form.ownerLocation}
                    onChange={(e) => setForm({ ...form, ownerLocation: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview & Customer Reviews */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-hydro-display font-bold text-lg">{form.garageName || 'Garage'} Track Record & Customer Reviews</h2>
                <p className="text-xs text-muted-foreground">Historical job completion performance and verified customer feedback for {form.garageName || 'this garage'}.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4 text-xs">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
              <p className="text-muted-foreground uppercase font-bold text-[10px]">Completed Jobs</p>
              <p className="font-hydro-display text-2xl font-black text-foreground mt-0.5">{garage?.completedJobs || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
              <p className="text-muted-foreground uppercase font-bold text-[10px]">Years Active</p>
              <p className="font-hydro-display text-2xl font-black text-foreground mt-0.5">{garage?.yearsActive || 1} Years</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
              <p className="text-muted-foreground uppercase font-bold text-[10px]">Overall Customer Rating</p>
              <p className="font-hydro-display text-2xl font-black text-[#FF5500] mt-0.5">{(garage?.rating || 0).toFixed(1)} / 5.0</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/60">
              <p className="text-muted-foreground uppercase font-bold text-[10px]">Active Service Bids</p>
              <p className="font-hydro-display text-2xl font-black text-foreground mt-0.5">{garage?.openRequests || 0} Active</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-hydro-display text-sm font-bold text-muted-foreground uppercase tracking-wider">Verified Reviews ({reviewsList.length})</h3>
            {reviewsList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-3">No customer reviews submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {reviewsList.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5500] text-white font-hydro-display font-bold text-xs">
                          {review.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-hydro-display text-sm font-bold">{review.customerName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{review.createdAt}</p>
                        </div>
                      </div>
                      <StarRating rating={review.garageRating} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-12">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-4 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-in fade-in">
              <Check className="h-4 w-4" /> Updated "{form.garageName}" profile saved to database!
            </span>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-[1.02]"
          >
            {saving ? 'Updating Database...' : 'Save All Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

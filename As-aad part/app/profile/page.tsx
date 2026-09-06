'use client';

import { useEffect, useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, Check, ShieldCheck, FileCheck, Building2, Upload, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getCurrentUser, updateProfile } from '@/services';
import { useRole } from '@/lib/role-context';
import type { User as UserType } from '@/lib/types';
import UnifiedGarageProfilePage from '../garage/profile/page';
import { DoodleBackground } from '@/components/shared/doodle-background';

export default function ProfilePage() {
  const { role, userName, userEmail, user: sessionUser } = useRole();
  const [userRecord, setUserRecord] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const email = userEmail || sessionUser?.email;
      if (!email) {
        setLoading(false);
        return;
      }
      const u = await getCurrentUser(email);
      if (u) {
        setUserRecord(u);
        setAvatarUrl(u.avatarUrl || u.avatar || '');
        setForm({
          name: u.name || userName || '',
          email: u.email || email,
          phone: u.phone || '',
          location: u.location || '',
        });
      }
      setLoading(false);
    })();
  }, [userEmail, sessionUser, userName]);

  // If logged in user is a Garage Owner, render the merged unified Garage & Owner profile
  if (role === 'garage') {
    return <UnifiedGarageProfilePage />;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateProfile({
        id: sessionUser?.id || userRecord?.id,
        email: form.email || userEmail,
        name: form.name,
        phone: form.phone,
        location: form.location,
        avatarUrl,
      });

      if (updated) {
        setUserRecord(updated);
        const storedSession =
          sessionStorage.getItem('autodoc_tab_jwt_session') ||
          localStorage.getItem('autodoc_tab_jwt_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          parsed.user = { ...parsed.user, ...updated };
          const newSessionStr = JSON.stringify(parsed);
          sessionStorage.setItem('autodoc_tab_jwt_session', newSessionStr);
          localStorage.setItem('autodoc_tab_jwt_session', newSessionStr);
        }
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;

  const initials = (form.name || userName || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Account & User Security Settings"
          description="Manage your verified profile credentials, contact details, and location for service bookings."
        />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Upload Card */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <h2 className="font-hydro-display font-bold text-lg">Profile Credentials</h2>
              <p className="text-xs text-muted-foreground">Logged-in account role and platform credentials.</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20">
              <ShieldCheck className="h-4 w-4" /> {role || userRecord?.role || 'customer'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-border shadow-md">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-[#FF5500] text-white font-hydro-display text-xl font-bold">
                    {initials}
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
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="space-y-1">
              <p className="font-hydro-display font-bold text-xl text-foreground">{form.name || userName}</p>
              <p className="text-xs text-muted-foreground font-mono">{form.email || userEmail}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="pt-1 text-xs text-[#FF5500] hover:underline font-bold block"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
          <h2 className="font-hydro-display font-bold text-lg border-b border-border pb-3">Personal & Contact Details</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" className="pl-10 h-11 rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10 h-11 rounded-xl bg-secondary/50 font-mono" value={form.email} readOnly />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" placeholder="+1 (415) 555-0123" className="pl-10 h-11 rounded-xl font-mono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider">Primary Location / Service Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" placeholder="e.g. San Francisco, CA" className="pl-10 h-11 rounded-xl" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-in fade-in">
              <Check className="h-4 w-4" /> Profile updated in database!
            </span>
          )}
          <Button type="submit" disabled={saving} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg">
            {saving ? 'Updating Database...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* Mechanic Credentials & Garage Application Section */}
      {role === 'mechanic' && (
        <MechanicProfileSection userId={sessionUser?.id || userRecord?.id || 'user-mechanic-1'} />
      )}
      </div>
    </div>
  );
}

function MechanicProfileSection({ userId }: { userId: string }) {
  const [mechanic, setMechanic] = useState<any | null>(null);
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [credentialUrl, setCredentialUrl] = useState('');
  const [selectedGarageId, setSelectedGarageId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [savingCred, setSavingCred] = useState(false);
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const credFileInputRef = useRef<HTMLInputElement>(null);

  const fetchMechanicData = async () => {
    try {
      const [mechRes, garRes] = await Promise.all([
        fetch(`/api/mechanics/me?userId=${encodeURIComponent(userId)}`),
        fetch('/api/garages'),
      ]);
      const mechData = await mechRes.json();
      const garData = await garRes.json();

      if (mechData.success && mechData.data) {
        setMechanic(mechData.data);
        setCredentialUrl(mechData.data.credentialUrl || '');
        setSpecialization(mechData.data.specialization || '');
      }

      if (garData.success && Array.isArray(garData.data)) {
        setGarages(garData.data);
      }
    } catch (err) {
      console.error('Error fetching mechanic profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanicData();
  }, [userId]);

  const handleCredentialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local URL for certificate photo preview
      const url = URL.createObjectURL(file);
      setCredentialUrl(url);
    }
  };

  const handleSaveCredential = async () => {
    if (!credentialUrl.trim()) {
      setMsg({ type: 'error', text: 'Please upload a certificate photo or enter a credential document URL.' });
      return;
    }
    setSavingCred(true);
    setMsg(null);

    try {
      const res = await fetch('/api/mechanics/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload_credential',
          userId,
          credentialUrl: credentialUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMechanic(data.data);
        setMsg({ type: 'success', text: 'Mechanic certification credential uploaded and saved!' });
      } else {
        setMsg({ type: 'error', text: data.error || data.message || 'Failed to save credential.' });
      }
    } catch (err) {
      console.error('Save credential error:', err);
      setMsg({ type: 'error', text: 'Error saving credential.' });
    } finally {
      setSavingCred(false);
    }
  };

  const handleApplyGarage = async () => {
    if (!selectedGarageId) {
      setMsg({ type: 'error', text: 'Please select a certified garage shop to apply.' });
      return;
    }
    setApplying(true);
    setMsg(null);

    try {
      const res = await fetch('/api/mechanics/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply_garage',
          userId,
          garageId: selectedGarageId,
          specialization: specialization.trim() || 'General Diagnostic & Maintenance',
          credentialUrl,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMechanic(data.data);
        setMsg({ type: 'success', text: 'Application submitted! The garage owner will review your credentials.' });
      } else {
        setMsg({ type: 'error', text: data.error || data.message || 'Failed to submit application.' });
      }
    } catch (err: any) {
      console.error('Apply garage error:', err);
      setMsg({ type: 'error', text: err.message || 'Error submitting application.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="h-48 animate-pulse rounded-2xl bg-card border border-border" />;

  const status = mechanic?.applicationStatus || 'NOT_SUBMITTED';

  return (
    <div className="space-y-6 pt-4">
      {msg && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. Mechanic Certification Credentials Card */}
      <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#FF5500]" />
            <h2 className="font-hydro-display font-bold text-lg">Mechanic Certification & Credentials</h2>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-secondary text-muted-foreground border-border'}`}>
            {status === 'ACCEPTED' ? '✓ Verified Staff' : status === 'PENDING' ? '⏳ Application Under Review' : status === 'REJECTED' ? '❌ Application Rejected' : 'Not Submitted'}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Upload your ASE or certified trade mechanic diploma, license, or credential photo. Garage owners review your certification when you apply to join their shop.
          </p>

          {credentialUrl && (
            <div className="p-3 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={credentialUrl} alt="Credential preview" className="h-14 w-20 object-cover rounded-lg border border-border" />
                <div>
                  <p className="text-xs font-bold text-foreground">Attached Credential Certificate</p>
                  <p className="text-[11px] text-emerald-500 font-medium">Ready for verification</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => credFileInputRef.current?.click()} className="text-xs font-bold">
                Replace File
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Paste certificate image URL or click button to upload"
                className="h-11 rounded-xl text-xs font-mono"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
              />
            </div>
            <input
              ref={credFileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleCredentialFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => credFileInputRef.current?.click()}
              className="h-11 rounded-xl text-xs font-bold gap-2"
            >
              <Upload className="h-4 w-4 text-[#FF5500]" /> Upload Certificate
            </Button>
            <Button
              type="button"
              onClick={handleSaveCredential}
              disabled={savingCred}
              className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold text-xs uppercase h-11 px-6 rounded-xl shadow-md"
            >
              {savingCred ? 'Saving...' : 'Save Credential'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Apply to Garage Section */}
      <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Building2 className="h-5 w-5 text-[#FF5500]" />
          <h2 className="font-hydro-display font-bold text-lg">Garage Shop Affiliation & Application</h2>
        </div>

        {mechanic?.garageName && status === 'ACCEPTED' ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Current Certified Garage</p>
              <h3 className="font-hydro-display text-xl font-bold text-foreground mt-0.5">{mechanic.garageName}</h3>
              <p className="text-xs text-muted-foreground mt-1">Specialization: <span className="text-foreground font-bold">{mechanic.specialization || 'General Diagnostic'}</span></p>
            </div>
            <span className="bg-emerald-500 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full shadow-sm">
              ✓ Verified Shop Staff
            </span>
          </div>
        ) : mechanic?.garageName && status === 'PENDING' ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-500 font-bold">Application Pending Review</p>
              <h3 className="font-hydro-display text-lg font-bold text-foreground mt-0.5">{mechanic.garageName}</h3>
              <p className="text-xs text-muted-foreground mt-1">Specialization requested: <span className="text-foreground font-bold">{mechanic.specialization}</span></p>
            </div>
            <span className="bg-amber-500 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full shadow-sm">
              ⏳ Under Review
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Select a certified garage partner to submit your application. Once the garage owner accepts your credentials, you will be authorized to perform repair jobs under their shop.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider">Select Garage Shop</Label>
                <Select value={selectedGarageId} onValueChange={setSelectedGarageId}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Choose a certified garage" />
                  </SelectTrigger>
                  <SelectContent>
                    {garages.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} ({g.address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider">Specialization / Expertise</Label>
                <Input
                  placeholder="e.g. Brake Specialist, EV Diagnostics, Engine Repair"
                  className="rounded-xl h-11"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleApplyGarage}
                disabled={applying}
                className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold text-xs uppercase h-11 px-8 rounded-xl shadow-md"
              >
                {applying ? 'Submitting Application...' : 'Submit Application to Garage'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wrench, Phone, CheckCircle2, Camera, UserCheck, MessageSquare, FileText, Download, X, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { StatusStepper } from '@/components/shared/status-stepper';
import { PhotoUpload } from '@/components/shared/photo-upload';
import { BeforeAfterSlider } from '@/components/shared/before-after-slider';
import { MechanicChatDialog } from '@/components/shared/mechanic-chat-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getBooking, updateBookingStatus, uploadBeforeAfterPhotos } from '@/services';
import type { Booking, BookingStatus } from '@/lib/types';

export default function GarageBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [shopMechanics, setShopMechanics] = useState<{ id: string; name: string; specialization?: string }[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<string>('');
  const [customMechanic, setCustomMechanic] = useState<string>('');

  // Invoice manual trigger state
  const [invoice, setInvoice] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [parts, setParts] = useState<{ name: string; cost: number }[]>([]);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(3);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const fetchShopMechanics = async (gId: string) => {
    try {
      const res = await fetch(`/api/garage/mechanics?garageId=${encodeURIComponent(gId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setShopMechanics(data.data);
      }
    } catch (e) {
      console.error('Fetch shop mechanics error:', e);
    }
  };

  const fetchInvoice = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/invoice`);
      const data = await res.json();
      if (data.success && data.data) {
        setInvoice(data.data);
      }
    } catch (e) {
      console.error('Fetch invoice error:', e);
    }
  };

  useEffect(() => {
    (async () => {
      const id = params?.id as string;
      if (!id) return;
      const b = await getBooking(id);
      setBooking(b);
      if (b) {
        setBeforePhotos(b.beforePhotos || []);
        setAfterPhotos(b.afterPhotos || []);
        if (b.mechanicName) setSelectedMechanic(b.mechanicName);
        setLaborCost(b.price || b.cost || 250);
        await Promise.all([
          fetchInvoice(b.id),
          fetchShopMechanics(b.garageId || 'user-garage-1'),
        ]);
      }
      setLoading(false);
    })();
  }, [params?.id]);

  const handleGenerateInvoiceSubmit = async () => {
    if (!booking) return;
    setGeneratingInvoice(true);
    try {
      const laborCostCents = Math.round(Number(laborCost || 0) * 100);
      const partsPayload = parts.map((p) => ({
        name: p.name || 'Replacement Component',
        costCents: Math.round(Number(p.cost || 0) * 100),
      }));

      const res = await fetch(`/api/bookings/${booking.id}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laborCostCents,
          parts: partsPayload,
          warrantyMonths: Number(warrantyMonths),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInvoice(data.data);
        setShowInvoiceModal(false);
        const updated = await getBooking(booking.id);
        if (updated) setBooking(updated);
        alert('Official PDF invoice generated and stored successfully!');
      } else {
        alert(data.error || 'Invoice generation failed');
      }
    } catch (err) {
      console.error('Generate invoice error:', err);
      alert('Error generating invoice. Check console.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleAssignMechanic = async () => {
    if (!booking) return;
    const mechanicNameToAssign = selectedMechanic === 'custom' ? customMechanic : selectedMechanic;
    if (!mechanicNameToAssign) {
      alert('Please select or enter a mechanic name.');
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mechanicName: mechanicNameToAssign }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBooking(data.data);
        alert(`Mechanic ${mechanicNameToAssign} assigned to booking ${booking.id}!`);
      }
    } catch (err) {
      console.error('Assign mechanic error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!booking) return;
    setUpdating(true);
    try {
      const updated = await updateBookingStatus(booking.id, newStatus);
      if (updated) {
        setBooking(updated);
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSavePhotos = async () => {
    if (!booking) return;
    setUpdating(true);
    try {
      await uploadBeforeAfterPhotos(booking.id, 'before', beforePhotos);
      await uploadBeforeAfterPhotos(booking.id, 'after', afterPhotos);
      const updated = await getBooking(booking.id);
      if (updated) setBooking(updated);
      alert('Diagnostic and repair photos saved to customer record!');
    } catch (err) {
      console.error('Save photos error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddPartRow = () => {
    setParts([...parts, { name: '', cost: 0 }]);
  };

  const handleRemovePartRow = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!booking) return (
    <div className="space-y-6 text-center py-12 font-hydro-body">
      <h2 className="font-hydro-display text-xl font-bold">Garage Booking Record Not Found</h2>
      <p className="text-sm text-muted-foreground">The requested booking record could not be found in garage management.</p>
      <Button asChild variant="outline" className="rounded-full">
        <Link href="/garage/bookings">Back to Garage Workload</Link>
      </Button>
    </div>
  );

  const hasBeforeAfter = (booking.beforePhotos?.length ?? 0) > 0 && (booking.afterPhotos?.length ?? 0) > 0;

  return (
    <div className="space-y-8 font-hydro-body">
      <Button variant="ghost" size="sm" asChild className="text-[#FF5500]">
        <Link href="/garage/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Garage Bookings
        </Link>
      </Button>

      <PageHeader
        title={`Garage Work Order #${booking.id}`}
        description={`Customer: ${booking.customerName} • Vehicle: ${booking.vehicleName}`}
      >
        <StatusBadge status={booking.status} />
      </PageHeader>

      {/* Repair status timeline */}
      <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border">
        <h2 className="mb-6 font-hydro-display text-lg font-bold">Work Order Timeline & Progression</h2>
        <StatusStepper timeline={booking.timeline || []} />
      </div>

      {/* Mechanic Assignment Card */}
      <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#FF5500]" />
            <h2 className="font-hydro-display text-lg font-bold">Assigned Shop Technician</h2>
          </div>
          <span className="text-xs font-bold font-mono text-muted-foreground">
            Current: <span className="text-[#FF5500]">{booking.mechanicName || 'Unassigned'}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 space-y-1.5 w-full">
            <Label className="text-xs font-bold uppercase tracking-wider">Select Mechanic Staff</Label>
            <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Assign a Shop Mechanic" />
              </SelectTrigger>
              <SelectContent>
                {shopMechanics.map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name} {m.specialization ? `(${m.specialization})` : ''}
                  </SelectItem>
                ))}
                <SelectItem value="custom">+ Custom Mechanic Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedMechanic === 'custom' && (
            <div className="flex-1 space-y-1.5 w-full">
              <Label className="text-xs font-bold uppercase tracking-wider">Enter Custom Name</Label>
              <Input
                placeholder="e.g. Alex Rivera"
                className="rounded-xl h-11"
                value={customMechanic}
                onChange={(e) => setCustomMechanic(e.target.value)}
              />
            </div>
          )}

          <Button
            onClick={handleAssignMechanic}
            disabled={updating}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold h-11 rounded-xl px-6 uppercase text-xs tracking-wider"
          >
            {updating ? 'Assigning...' : 'Assign Technician'}
          </Button>
        </div>
      </div>

      {/* Booking details matrix */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 hydro-card-surface p-6 rounded-2xl border border-border">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Customer</p>
          <p className="font-hydro-display font-bold text-base mt-1">{booking.customerName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Vehicle</p>
          <p className="font-hydro-display font-bold text-base mt-1">{booking.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Assigned Mechanic</p>
          <p className="font-hydro-display font-bold text-base mt-1 text-[#FF5500]">
            {booking.mechanicName || 'Unassigned'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Quoted Price</p>
          <p className="font-hydro-display font-bold text-xl text-[#FF5500] mt-1">${booking.price || booking.cost || 0}</p>
        </div>
      </div>

      {/* Work Order Controls & Invoice Generation */}
      <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-5">
        <h2 className="font-hydro-display text-lg font-bold border-b border-border pb-3">
          Garage Status Controls & Invoice Issuer
        </h2>

        <div className="flex flex-wrap gap-3">
          {booking.status === 'pending' && (
            <Button onClick={() => handleStatusChange('accepted')} disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
              Accept Work Order
            </Button>
          )}
          {booking.status === 'accepted' && (
            <Button onClick={() => handleStatusChange('in_progress')} disabled={updating} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl">
              Start Repair Work (In Progress)
            </Button>
          )}
          {(booking.status === 'in_progress' || booking.status === 'customer_approved') && (
            <Button onClick={() => handleStatusChange('completed')} disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Repair Complete & Ready for Handover
            </Button>
          )}

          <Button variant="outline" onClick={() => setShowInvoiceModal(true)} className="font-bold rounded-xl border-[#FF5500]/40 text-[#FF5500] hover:bg-[#FF5500]/10">
            <FileText className="mr-2 h-4 w-4" /> {invoice ? 'Re-Generate PDF Invoice' : 'Generate & Issue PDF Invoice'}
          </Button>

          {invoice?.pdfUrl && (
            <Button asChild variant="outline" className="font-bold rounded-xl border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download Issued Invoice PDF
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Diagnostic & Repair Photos Upload */}
      <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#FF5500]" />
            <h2 className="font-hydro-display text-lg font-bold">Diagnostic & Repair Stage Photo Documentation</h2>
          </div>
          <Button onClick={handleSavePhotos} disabled={updating} size="sm" className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl">
            Save Photos to Customer Portal
          </Button>
        </div>

        {hasBeforeAfter && (
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Live Comparison Slider</p>
            <BeforeAfterSlider
              beforeImage={beforePhotos[0]}
              afterImage={afterPhotos[0]}
              className="max-w-2xl"
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 pt-2">
          <div className="space-y-3">
            <h3 className="font-hydro-display font-bold text-sm">Before Repair Photos (Inspection Stage)</h3>
            <PhotoUpload existingPhotos={beforePhotos} onChange={setBeforePhotos} />
          </div>

          <div className="space-y-3">
            <h3 className="font-hydro-display font-bold text-sm">After Repair Photos (Completed Work Stage)</h3>
            <PhotoUpload existingPhotos={afterPhotos} onChange={setAfterPhotos} />
          </div>
        </div>
      </div>

      {/* Invoice Generation Modal Dialog */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-lg font-hydro-body">
          <DialogHeader>
            <DialogTitle className="font-hydro-display text-lg font-bold">Generate Official Service Invoice</DialogTitle>
            <DialogDescription className="text-xs">
              Itemize repair labor cost, replacement spare parts, and warranty duration for booking #{booking.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Labor & Diagnostic Cost ($ USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={laborCost}
                onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                className="rounded-xl h-11 font-mono font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider">Itemized Replacement Parts</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleAddPartRow} className="text-xs font-bold text-[#FF5500]">
                  + Add Part Item
                </Button>
              </div>

              {parts.map((part, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Part description e.g. Ceramic Brake Pads"
                    value={part.name}
                    onChange={(e) => {
                      const updated = [...parts];
                      updated[idx].name = e.target.value;
                      setParts(updated);
                    }}
                    className="rounded-xl h-10 flex-1 text-xs"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Cost $"
                    value={part.cost || ''}
                    onChange={(e) => {
                      const updated = [...parts];
                      updated[idx].cost = parseFloat(e.target.value) || 0;
                      setParts(updated);
                    }}
                    className="rounded-xl h-10 w-24 text-xs font-mono"
                  />
                  <button type="button" onClick={() => handleRemovePartRow(idx)} className="text-muted-foreground hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Warranty Coverage Period</Label>
              <Select value={String(warrantyMonths)} onValueChange={(v) => setWarrantyMonths(parseInt(v))}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select Warranty Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month (30 Days Warranty)</SelectItem>
                  <SelectItem value="3">3 Months (90 Days Standard Warranty)</SelectItem>
                  <SelectItem value="6">6 Months (180 Days Extended Warranty)</SelectItem>
                  <SelectItem value="12">12 Months (1 Year Full Warranty)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceModal(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={handleGenerateInvoiceSubmit}
              disabled={generatingInvoice}
              className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-full px-6 uppercase text-xs tracking-wider"
            >
              {generatingInvoice ? 'Compiling PDF...' : 'Issue PDF Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
      const b = await getBooking(params.id as string);
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
  }, [params.id]);

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
      if (data.success && data.data) {
        setInvoice(data.data);
        setShowInvoiceModal(false);
        alert(`Invoice ${data.data.invoiceNumber || data.data.id} generated successfully!`);
      } else {
        alert(data.message || data.error || 'Failed to generate invoice.');
      }
    } catch (err) {
      console.error('Generate invoice error:', err);
      alert('Error generating invoice.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleStatusUpdate = async (status: BookingStatus) => {
    const currentMech = customMechanic.trim() || selectedMechanic || booking?.mechanicName;

    if (status === 'in_progress' && (!currentMech || currentMech.trim() === '')) {
      alert('⚠️ Action Blocked: You cannot start repair work until a shop mechanic is assigned to this job. Please select or enter a mechanic above.');
      return;
    }

    if (status === 'completed' && booking?.status !== 'customer_approved' && booking?.status !== 'completed') {
      alert('⚠️ Action Blocked: The customer must inspect and approve the repair work before you can mark the job complete and issue the invoice.');
      return;
    }

    setUpdating(true);
    const updated = await updateBookingStatus(params.id as string, status);
    if (updated) {
      setBooking(updated);
      if (status === 'completed') {
        setShowInvoiceModal(true);
      }
    }
    setUpdating(false);
  };

  const handleAssignMechanic = async () => {
    const mechName = customMechanic.trim() || selectedMechanic;
    if (!mechName) {
      alert('Please select or enter a mechanic name to assign.');
      return;
    }
    const foundMech = shopMechanics.find((m) => m.name === mechName);
    const resolvedMechId = foundMech?.id || mechName;

    setUpdating(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          status: booking?.status || 'accepted',
          mechanicName: mechName,
          mechanicId: resolvedMechId,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setBooking(result.data);
        alert(`Mechanic "${mechName}" assigned to this repair job!`);
      } else {
        alert(result.error || result.message || 'Failed to assign mechanic.');
      }
    } catch (err) {
      console.error('Assign mechanic error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadBefore = async () => {
    setUpdating(true);
    const updated = await uploadBeforeAfterPhotos(params.id as string, 'before', beforePhotos);
    if (updated) setBooking(updated);
    setUpdating(false);
  };

  const handleUploadAfter = async () => {
    setUpdating(true);
    const updated = await uploadBeforeAfterPhotos(params.id as string, 'after', afterPhotos);
    if (updated) setBooking(updated);
    setUpdating(false);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-xl bg-secondary" />;
  if (!booking) return <p className="text-muted-foreground">Booking not found.</p>;

  const hasBeforeAfter = (booking.beforePhotos?.length ?? 0) > 0 && (booking.afterPhotos?.length ?? 0) > 0;

  return (
    <div className="space-y-8 font-hydro-body">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/garage/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      <PageHeader title={booking.serviceTitle || booking.serviceType || 'Repair Job'} description={booking.serviceDescription}>
        <StatusBadge status={booking.status} />
      </PageHeader>

      {/* Status stepper */}
      <div className="rounded-xl border-2 border-border bg-card p-6 sm:p-8">
        <h2 className="mb-6 font-hydro-display text-lg font-bold">Repair Status & Pipeline</h2>
        <StatusStepper timeline={booking.timeline || []} />
      </div>

      {/* Customer & vehicle info matrix */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 hydro-card-surface p-6 rounded-2xl border border-border">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Customer</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{booking.customerName}</p>
          {booking.customerPhone && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
              <Phone className="h-3 w-3 text-[#FF5500]" /> {booking.customerPhone}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Target Vehicle</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{booking.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Assigned Mechanic</p>
          <p className="font-hydro-display font-bold text-base mt-0.5 text-[#FF5500] flex items-center gap-1.5">
            <UserCheck className="h-4 w-4" />
            {booking.mechanicName || 'Unassigned'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Quoted Job Price</p>
          <p className="font-hydro-display font-bold text-xl text-[#FF5500] mt-0.5">${booking.price}</p>
        </div>
      </div>

      {/* Mechanic Assignment & Direct Chat Control Card */}
      <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#FF5500]" />
            <h2 className="font-hydro-display text-base font-bold">Assign Shop Mechanic & Customer Contact</h2>
          </div>

          <MechanicChatDialog
            bookingId={booking.id}
            mechanicName={booking.mechanicName || 'Shop Mechanic'}
            customerName={booking.customerName || 'Customer'}
            currentUserRole="garage"
            currentUserId={booking.garageId || 'user-garage-1'}
            currentUserName={booking.garageName || 'Garage Partner'}
            buttonVariant="outline"
            buttonText="Message Customer"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider">Select Verified Shop Staff</Label>
            <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder={shopMechanics.length > 0 ? "Choose verified mechanic from shop staff" : "No registered shop mechanics available"} />
              </SelectTrigger>
              <SelectContent>
                {shopMechanics.map((m) => (
                  <SelectItem key={m.id} value={m.name}>
                    {m.name} {m.specialization ? `(${m.specialization})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider">Or Enter Mechanic Name</Label>
            <Input
              placeholder="e.g. Shop Technician Name"
              className="rounded-xl h-11"
              value={customMechanic}
              onChange={(e) => setCustomMechanic(e.target.value)}
            />
          </div>

          <Button
            onClick={handleAssignMechanic}
            disabled={updating}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold text-xs uppercase rounded-xl h-11 px-6 shadow-md"
          >
            {updating ? 'Assigning...' : 'Assign Mechanic'}
          </Button>
        </div>
      </div>

      {/* Customer Approval Notice Banner */}
      {booking.status === 'customer_approved' && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            <div>
              <h3 className="font-hydro-display text-lg font-bold text-foreground">Customer Approved Repair Work!</h3>
              <p className="text-sm text-muted-foreground">
                The customer has verified the before/after photos and accepted the repair job. Complete the job below to generate the invoice.
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-hydro-display font-bold text-sm uppercase rounded-xl h-11 px-6 shadow-lg"
          >
            {updating ? 'Completing Job...' : 'Complete Job & Issue Invoice'}
          </Button>
        </div>
      )}

      {/* Before/After repair photos uploaded by mechanic (Read-only for Garage Owner) */}
      {(booking.beforePhotos?.length ?? 0) > 0 || (booking.afterPhotos?.length ?? 0) > 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#FF5500]" />
              <h2 className="font-hydro-display text-lg font-bold text-foreground">Before & After Repair Images</h2>
            </div>
            <span className="text-xs font-bold text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/20 px-3 py-1 rounded-full">
              Uploaded by Mechanic: {booking.mechanicName || 'Assigned Mechanic'}
            </span>
          </div>

          {hasBeforeAfter && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Interactive Slider Comparison</p>
              <BeforeAfterSlider
                beforeImage={booking.beforePhotos?.[0] || ''}
                afterImage={booking.afterPhotos?.[0] || ''}
                className="max-w-2xl"
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2 pt-2">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#FF5500]" /> Before Repair Stage Photos ({booking.beforePhotos?.length || 0})
              </h3>
              {(booking.beforePhotos?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {booking.beforePhotos?.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Before ${i}`} className="h-24 w-32 object-cover rounded-xl border border-border shadow-sm" />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No before repair photos uploaded yet.</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-500" /> After Repair Stage Photos ({booking.afterPhotos?.length || 0})
              </h3>
              {(booking.afterPhotos?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {booking.afterPhotos?.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`After ${i}`} className="h-24 w-32 object-cover rounded-xl border border-border shadow-sm" />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Awaiting after repair photos from mechanic...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground space-y-2">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground/40 mb-1" />
          <p className="font-display font-bold text-foreground">Awaiting Repair Photos</p>
          <p className="text-xs">Before & After repair stage photos will appear here once uploaded by assigned mechanic <span className="text-[#FF5500] font-bold">({booking.mechanicName || 'Unassigned'})</span>.</p>
        </div>
      )}

      {/* Invoice Banner & Manual Trigger Section */}
      {invoice ? (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-emerald-500 shrink-0" />
            <div>
              <h3 className="font-hydro-display text-lg font-bold text-foreground">
                Invoice {invoice.invoiceNumber || String(invoice.id).toUpperCase()} Issued
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issued on {new Date(invoice.issuedAt || invoice.issuedDate || Date.now()).toLocaleDateString()} • Total: ${(Number(invoice.totalCents || invoice.total * 100 || 0) / 100).toFixed(2)} • Warranty: {invoice.warrantyMonths || Math.round((invoice.warrantyDays || 90) / 30)} month(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild className="rounded-xl font-bold bg-background border-border">
              <Link href={`/bookings/${booking.id}/invoice`}>
                <FileText className="mr-1.5 h-4 w-4 text-[#FF5500]" /> View Web Invoice
              </Link>
            </Button>
            {invoice.pdfUrl && (
              <Button size="sm" asChild className="rounded-xl font-bold bg-[#FF5500] hover:bg-[#FF7700] text-white">
                <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1.5 h-4 w-4" /> Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      ) : booking.status === 'completed' ? (
        <div className="rounded-2xl border-2 border-[#FF5500]/40 bg-[#FF5500]/5 p-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-[#FF5500] shrink-0" />
            <div>
              <h3 className="font-hydro-display text-lg font-bold text-foreground">Repair Job Completed</h3>
              <p className="text-xs text-muted-foreground">
                This repair job is completed. Manually trigger and generate the official repair invoice with labor, itemized parts, and warranty coverage.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold text-sm uppercase rounded-xl h-11 px-6 shadow-md"
          >
            <FileText className="mr-2 h-4 w-4" /> Generate Repair Invoice
          </Button>
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {booking.status === 'pending' && (
          <Button onClick={() => handleStatusUpdate('accepted')} disabled={updating} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold h-11 px-6 rounded-xl">
            {updating ? 'Updating...' : 'Accept Booking'}
          </Button>
        )}
        {booking.status === 'accepted' && (
          (booking.mechanicName || selectedMechanic || customMechanic.trim()) ? (
            <Button onClick={() => handleStatusUpdate('in_progress')} disabled={updating} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold h-11 px-6 rounded-xl shadow-md">
              {updating ? 'Updating...' : 'Start Repair & Diagnostic'}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                onClick={() => {
                  alert('⚠️ Action Blocked: You must assign a shop mechanic to this repair job before starting repair work. Please select or enter a mechanic name above.');
                }}
                className="bg-secondary text-muted-foreground font-bold h-11 px-6 rounded-xl border border-border opacity-80"
              >
                Start Repair & Diagnostic (Mechanic Required)
              </Button>
              <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                ⚠️ Assign a shop mechanic above to enable starting work.
              </span>
            </div>
          )
        )}
        {booking.status === 'in_progress' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-hydro-body w-full">
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <Clock className="h-5 w-5 shrink-0" />
              <span>Awaiting Customer Inspection & Approval</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Upload repair photos above. Once the customer inspects and approves the work on their customer portal, you can mark the job complete and issue the invoice.
            </p>
          </div>
        )}
        {booking.status === 'customer_approved' && (
          <Button onClick={() => handleStatusUpdate('completed')} disabled={updating} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 rounded-xl shadow-md">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {updating ? 'Completing Job...' : 'Complete Job & Issue Invoice'}
          </Button>
        )}
      </div>

      {/* Manual Invoice Generation Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="max-w-lg rounded-2xl p-6 border border-border">
          <DialogHeader>
            <DialogTitle className="font-hydro-display text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FF5500]" /> Generate Repair Invoice
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure labor cost, add itemized replacement parts, and select warranty coverage period for this repair booking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">Labor & Diagnostic Cost ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value))}
                className="mt-1 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider">Itemized Replacement Parts</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setParts([...parts, { name: '', cost: 0 }])}
                  className="h-8 text-xs font-bold text-[#FF5500] border-[#FF5500]/30"
                >
                  + Add Part
                </Button>
              </div>

              {parts.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Part Name (e.g. OEM Brake Pads)"
                    value={p.name}
                    onChange={(e) => {
                      const updated = [...parts];
                      updated[idx].name = e.target.value;
                      setParts(updated);
                    }}
                    className="rounded-xl h-10 text-xs flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Cost ($)"
                    value={p.cost || ''}
                    onChange={(e) => {
                      const updated = [...parts];
                      updated[idx].cost = Number(e.target.value);
                      setParts(updated);
                    }}
                    className="rounded-xl h-10 text-xs w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setParts(parts.filter((_, i) => i !== idx))}
                    className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {parts.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No replacement parts added. Click "+ Add Part" if parts were installed.</p>
              )}
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider">Warranty Coverage Period</Label>
              <Select value={String(warrantyMonths)} onValueChange={(val) => setWarrantyMonths(Number(val))}>
                <SelectTrigger className="mt-1 rounded-xl h-11">
                  <SelectValue placeholder="Select warranty months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 Months (No Warranty)</SelectItem>
                  <SelectItem value="3">3 Months Warranty</SelectItem>
                  <SelectItem value="6">6 Months Warranty</SelectItem>
                  <SelectItem value="12">12 Months Warranty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4 space-y-1 text-xs">
              <div className="flex justify-between font-medium">
                <span>Labor & Service Cost:</span>
                <span>${Number(laborCost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Replacement Parts Cost:</span>
                <span>${parts.reduce((sum, p) => sum + Number(p.cost || 0), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#FF5500] pt-1 border-t border-border">
                <span>Calculated Total:</span>
                <span>${(Number(laborCost || 0) + parts.reduce((sum, p) => sum + Number(p.cost || 0), 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowInvoiceModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleGenerateInvoiceSubmit}
              disabled={generatingInvoice}
              className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl"
            >
              {generatingInvoice ? 'Generating PDF...' : 'Confirm & Generate Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


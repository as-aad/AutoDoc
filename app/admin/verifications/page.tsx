'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, FileText, MapPin, Wrench, Store, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { VerificationItem } from '@/lib/types';

export default function AdminVerificationsPage() {
  const [queue, setQueue] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  // Reject Modal State
  const [rejectingItem, setRejectingItem] = useState<VerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verifications');
      const data = await res.json();
      if (data.success && data.data) {
        setQueue(data.data.filter((v: VerificationItem) => v.status === 'pending'));
      }
    } catch (e) {
      console.error('Error fetching verification queue:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActing(id);
    try {
      await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' }),
      });
      setQueue((q) => q.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Error approving verification:', err);
    } finally {
      setActing(null);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a specific rejection reason for compliance records.');
      return;
    }

    setActing(rejectingItem.id);
    try {
      await fetch('/api/admin/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rejectingItem.id, status: 'rejected', reason: rejectionReason }),
      });
      setQueue((q) => q.filter((v) => v.id !== rejectingItem.id));
      setRejectingItem(null);
      setRejectionReason('');
      setError(null);
    } catch (err) {
      console.error('Error rejecting verification:', err);
    } finally {
      setActing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-card border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Verification Queue"
        description="Review certification documents, ASE licenses, and approve/reject partner applications with full audit reasons."
        backHref="/dashboard"
      />

      {queue.length === 0 ? (
        <div className="hydro-card-surface rounded-2xl border border-dashed border-border py-16 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500" />
          <p className="mt-3 font-hydro-display text-xl font-bold">Verification Queue Empty</p>
          <p className="mt-1 text-xs text-muted-foreground">All pending garage and mechanic certifications have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="hydro-card-surface rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                    {item.type === 'garage' ? <Store className="h-6 w-6" /> : <Wrench className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-hydro-display text-lg font-bold">{item.name}</p>
                      <span className="rounded-full bg-[#FF5500]/10 text-[#FF5500] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#FF5500]" /> {item.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.specialties.map((s) => (
                        <span key={s} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRejectingItem(item);
                      setRejectionReason('');
                      setError(null);
                    }}
                    disabled={acting !== null}
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Reject Application
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                    disabled={acting !== null}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    {acting === item.id ? 'Approving...' : 'Approve & Verify'}
                  </Button>
                </div>
              </div>

              {/* Submitted Certificates */}
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Uploaded Certification Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary border border-border px-3.5 py-2 text-xs font-medium">
                      <FileText className="h-4 w-4 text-[#FF5500]" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Rejection Reason Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-hydro-display text-xl font-bold">Reject Verification Application</h2>
                <p className="text-xs text-muted-foreground">Mandatory audit reason required.</p>
              </div>
            </div>

            <p className="text-sm text-foreground mb-4">
              You are about to reject the partner application for <span className="font-bold text-[#FF5500]">{rejectingItem.name}</span>.
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="rejection-reason" className="text-xs font-bold uppercase tracking-wider">
                  Rejection Reason (Sent to Applicant)
                </Label>
                <textarea
                  id="rejection-reason"
                  rows={4}
                  required
                  placeholder="e.g. Uploaded ASE certificate has expired, or liability insurance documentation is unreadable."
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:border-red-500 focus:outline-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setRejectingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  Confirm Rejection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

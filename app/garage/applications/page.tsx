'use client';

import { useEffect, useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, FileText, Wrench, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/role-context';
import type { Mechanic } from '@/lib/types';

export default function GarageApplicationsPage() {
  const { user } = useRole();
  const [applications, setApplications] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const ownerId = user?.id || 'user-garage-1';
      const res = await fetch(`/api/garage-owner/applications?ownerId=${encodeURIComponent(ownerId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Error fetching garage applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleAccept = async (mechanicId: string) => {
    setActingId(mechanicId);
    try {
      const ownerId = user?.id || 'user-garage-1';
      const res = await fetch(`/api/garage-owner/applications/${mechanicId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((a) => a.id !== mechanicId && a.userId !== mechanicId));
        alert('Mechanic accepted successfully! They can now be assigned to shop repair jobs.');
      } else {
        alert(data.error || 'Failed to accept mechanic');
      }
    } catch (err) {
      console.error('Error accepting mechanic:', err);
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (mechanicId: string) => {
    setActingId(mechanicId);
    try {
      const ownerId = user?.id || 'user-garage-1';
      const res = await fetch(`/api/garage-owner/applications/${mechanicId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((a) => a.id !== mechanicId && a.userId !== mechanicId));
        alert('Mechanic application rejected.');
      } else {
        alert(data.error || 'Failed to reject mechanic');
      }
    } catch (err) {
      console.error('Error rejecting mechanic:', err);
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-card border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Mechanic Applications"
        description="Directly review certified mechanics applying to join your shop, inspect uploaded certification documents, and accept or reject applicants."
        backHref="/dashboard"
      />

      {applications.length === 0 ? (
        <div className="hydro-card-surface rounded-2xl border border-dashed border-border py-16 text-center">
          <UserCheck className="mx-auto h-12 w-12 text-[#FF5500]" />
          <p className="mt-3 font-hydro-display text-xl font-bold">No Pending Applications</p>
          <p className="mt-1 text-xs text-muted-foreground">
            There are currently no mechanic applications awaiting review for your garage.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="hydro-card-surface rounded-2xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-hydro-display text-lg font-bold text-foreground">{app.userName || 'Mechanic Applicant'}</h3>
                      <span className="rounded-full bg-amber-500/10 text-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                        PENDING REVIEW
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{app.userEmail} {app.userPhone ? `• ${app.userPhone}` : ''}</p>
                    <p className="text-xs font-bold text-[#FF5500] mt-1">Specialization: {app.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(app.id)}
                    disabled={actingId !== null}
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-xl h-10 px-4 text-xs uppercase"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAccept(app.id)}
                    disabled={actingId !== null}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-10 px-5 text-xs uppercase shadow-md"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    {actingId === app.id ? 'Processing...' : 'Accept Mechanic'}
                  </Button>
                </div>
              </div>

              {/* Certification Document Review */}
              <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#FF5500]" />
                  <div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">Uploaded Certification Document</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                      {app.credentialUrl || app.pendingCredentialUrl || 'No document attached'}
                    </p>
                  </div>
                </div>

                {(app.credentialUrl || app.pendingCredentialUrl) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-xs text-[#FF5500] hover:underline font-bold"
                  >
                    <a href={app.credentialUrl || app.pendingCredentialUrl} target="_blank" rel="noopener noreferrer">
                      View Credential
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

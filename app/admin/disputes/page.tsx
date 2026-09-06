'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle2, MessageSquare, AlertTriangle, FileText, User } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

interface DisputeItem {
  id: string;
  bookingId: string;
  customerName: string;
  garageName: string;
  serviceTitle: string;
  amount: number;
  reason: string;
  status: 'open' | 'resolved';
  submittedAt: string;
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([
    {
      id: 'disp-1',
      bookingId: 'book-901',
      customerName: 'Alex Morgan',
      garageName: 'Apex Performance Motors',
      serviceTitle: 'Brake Disc Lathe Resurfacing',
      amount: 280.0,
      reason: 'Brakes still making squeaking noise after repair completion.',
      status: 'open',
      submittedAt: '2026-09-03',
    },
    {
      id: 'disp-2',
      bookingId: 'book-844',
      customerName: 'Sarah Chen',
      garageName: 'EuroCraft Auto Specialist',
      serviceTitle: 'Transmission Fluid Flush',
      amount: 450.0,
      reason: 'Charged for synthetic fluid instead of standard specified fluid.',
      status: 'open',
      submittedAt: '2026-09-01',
    },
  ]);

  const handleResolve = (id: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d))
    );
  };

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Admin Dispute Resolution Console"
        description="Mediate customer complaints, quality issues, and financial disputes between vehicle owners and garage partners."
      />

      <div className="space-y-4">
        {disputes.map((item) => (
          <div key={item.id} className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.status === 'open' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {item.status === 'open' ? <ShieldAlert className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-hydro-display font-bold text-base">{item.serviceTitle}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'open' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Booking #{item.bookingId} • Amount Disputed: ${item.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {item.status === 'open' && (
                <Button
                  onClick={() => handleResolve(item.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  Resolve Dispute & Issue Refund
                </Button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs border-t border-border pt-3">
              <div>
                <span className="text-muted-foreground uppercase font-bold tracking-wider text-[10px]">Customer:</span>
                <p className="font-bold text-foreground">{item.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground uppercase font-bold tracking-wider text-[10px]">Garage Partner:</span>
                <p className="font-bold text-foreground">{item.garageName}</p>
              </div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3 text-xs border border-border">
              <span className="font-bold text-[#FF5500]">Dispute Reason: </span>
              <span className="text-foreground">{item.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

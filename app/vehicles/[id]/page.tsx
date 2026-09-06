'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Car,
  FileText,
  Wrench,
  AlertCircle,
  Calendar,
  Plus,
  Pencil,
  Search,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/lib/role-context';
import type { Vehicle } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useRole();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Timeline Filters State
  const [historySearch, setHistorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Upload Document Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('insurance');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [uploading, setUploading] = useState(false);

  // Delete Vehicle Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVehicleData();
  }, [params.id]);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const ownerId = user?.id || 'user-1';
      const res = await fetch(`/api/vehicles?ownerId=${ownerId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setAllVehicles(data.data);
        const current = data.data.find((v: Vehicle) => v.id === params.id) || data.data[0];
        setVehicle(current || null);
      }
    } catch (e) {
      console.error('Error fetching vehicle details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !docName || !docExpiryDate) return;
    setUploading(true);

    try {
      const res = await fetch('/api/vehicles/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          type: docType,
          name: docName,
          expiryDate: docExpiryDate,
        }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setVehicle({
          ...vehicle,
          documents: [data.data, ...vehicle.documents],
        });
        setShowDocModal(false);
        setDocName('');
        setDocExpiryDate('');
      }
    } catch (err) {
      console.error('Document upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicle) return;
    setDeleting(true);

    try {
      await fetch(`/api/vehicles?id=${vehicle.id}`, { method: 'DELETE' });
      setShowDeleteModal(false);
      router.push('/vehicles');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-[12px] bg-[#FFFFFF] border border-[#E4E0DA]" />;
  if (!vehicle) return <p className="text-[#6B6F76] p-6 type-body">Vehicle record not found.</p>;

  // Filter Maintenance Timeline
  const filteredHistory = vehicle.maintenanceHistory.filter((rec) => {
    const matchesSearch =
      rec.type.toLowerCase().includes(historySearch.toLowerCase()) ||
      rec.description.toLowerCase().includes(historySearch.toLowerCase()) ||
      rec.garageName.toLowerCase().includes(historySearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || rec.type.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Top Bar: Back Link & Multi-Vehicle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E0DA] pb-4">
        <Button variant="link" size="sm" asChild className="text-[#2B4C5C] hover:underline p-0 h-auto">
          <Link href="/vehicles">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to All Vehicles
          </Link>
        </Button>

        {/* Multi-Vehicle Switcher Bar */}
        {allVehicles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="type-caption text-[#6B6F76] font-medium shrink-0">
              Switch Vehicle:
            </span>
            <div className="flex items-center gap-1.5">
              {allVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => router.push(`/vehicles/${v.id}`)}
                  className={cn(
                    'px-3 py-1 rounded-[8px] type-caption transition-colors',
                    v.id === vehicle.id
                      ? 'bg-[#FF7A29] text-white font-medium'
                      : 'bg-[#FFFFFF] border border-[#E4E0DA] hover:bg-[#F7F5F2] text-[#1A1D23]'
                  )}
                >
                  {v.make} {v.model} ({v.plate})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <PageHeader
        title={`${vehicle.make} ${vehicle.model}`}
        description={`${vehicle.year} • ${vehicle.plate} • ${vehicle.mileage.toLocaleString()} miles`}
      >
        <Button variant="outline" asChild>
          <Link href={`/vehicles/${vehicle.id}/edit`}>
            <Pencil className="mr-1.5 h-4 w-4" />
            Edit Specs
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Vehicle
        </Button>
        <Button asChild>
          <Link href={`/requests/new?vehicle=${vehicle.id}`}>
            <Wrench className="mr-1.5 h-4 w-4" />
            Request Repair
          </Link>
        </Button>
      </PageHeader>

      {/* Warning Banners */}
      {vehicle.documents
        .map((doc) => {
          const daysUntil = Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return { ...doc, daysUntil };
        })
        .filter((d) => d.daysUntil <= 15)
        .map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between rounded-[12px] border border-[#F4D3D1] bg-[#F9E8E7] p-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#B3423A] shrink-0" />
              <div>
                <p className="type-small font-bold text-[#B3423A]">
                  Document Expiry Alert — {d.name}
                </p>
                <p className="type-caption text-[#6B6F76]">
                  Due for renewal on {new Date(d.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <span className="rounded-[8px] bg-[#B3423A] text-white type-caption px-3 py-1">
              {d.daysUntil <= 0 ? 'EXPIRED' : `Expires in ${d.daysUntil} days`}
            </span>
          </div>
        ))}

      {/* Vehicle Overview Card with Contained Single Accent Blob Spot */}
      <div className="relative overflow-hidden rounded-[12px] border border-[#E4E0DA] bg-[#FFFFFF] p-6 sm:p-8">
        {/* Contained single accent blob spot behind health score / overview gauge */}
        <div className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-[#FF7A29] blur-[60px] opacity-[0.15] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center justify-between">
          {vehicle.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-44 w-full rounded-[8px] object-cover sm:w-72"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center rounded-[8px] bg-[#F7F5F2] sm:w-72">
              <Car className="h-12 w-12 text-[#6B6F76]" />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="type-h2 font-display text-[#1A1D23]">{vehicle.make} {vehicle.model}</h3>
              <p className="type-caption text-[#6B6F76] font-mono">VIN: {vehicle.vin || '1HGCR2F83HA928374'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E4E0DA]">
              <Detail label="Color" value={vehicle.color} />
              <Detail label="Current Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="w-full justify-start border-b border-[#E4E0DA] bg-transparent p-0 rounded-none h-auto gap-4">
          <TabsTrigger
            value="documents"
            className="data-[state=active]:border-[#FF7A29] data-[state=active]:text-[#FF7A29] border-b-2 border-transparent rounded-none px-4 py-3 type-small font-medium"
          >
            <FileText className="mr-2 h-4 w-4" />
            Documents ({vehicle.documents.length})
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="data-[state=active]:border-[#FF7A29] data-[state=active]:text-[#FF7A29] border-b-2 border-transparent rounded-none px-4 py-3 type-small font-medium"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance History Timeline
          </TabsTrigger>

          <TabsTrigger
            value="reminders"
            className="data-[state=active]:border-[#FF7A29] data-[state=active]:text-[#FF7A29] border-b-2 border-transparent rounded-none px-4 py-3 type-small font-medium"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled Reminders ({vehicle.reminders.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Documents */}
        <TabsContent value="documents">
          <div className="rounded-[12px] border border-[#E4E0DA] bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E0DA] pb-4">
              <h3 className="type-h3 font-display text-[#1A1D23]">Vehicle Documents</h3>
              <Button
                onClick={() => setShowDocModal(true)}
                size="sm"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {vehicle.documents.map((doc) => {
                const daysUntil = Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntil <= 15;

                return (
                  <div
                    key={doc.id}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-[8px] border transition-colors',
                      isExpiringSoon
                        ? 'border-[#F4D3D1] bg-[#F9E8E7]'
                        : 'border-[#E4E0DA] bg-[#FFFFFF]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 items-center justify-center rounded-[8px]', isExpiringSoon ? 'bg-[#B3423A]/10 text-[#B3423A]' : 'bg-[#FFE8D6] text-[#FF7A29]')}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="type-small font-medium text-[#1A1D23]">{doc.name}</p>
                        <p className="type-caption text-[#6B6F76] capitalize">{doc.type} • Uploaded {doc.uploadedAt}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={cn('type-caption font-mono', isExpiringSoon ? 'text-[#B3423A] font-bold' : 'text-[#6B6F76]')}>
                        Expires {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                      {isExpiringSoon && (
                        <span className="inline-block mt-1 bg-[#B3423A] text-white type-caption px-2 py-0.5 rounded-[8px]">
                          {daysUntil <= 0 ? 'EXPIRED' : `Expires in ${daysUntil}d`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Service History Timeline */}
        <TabsContent value="history">
          <div className="rounded-[12px] border border-[#E4E0DA] bg-[#FFFFFF] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E0DA] pb-4">
              <div>
                <h3 className="type-h3 font-display text-[#1A1D23]">Maintenance Timeline</h3>
                <p className="type-caption text-[#6B6F76]">Filter past repairs by service category or description.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B6F76]" />
                  <Input
                    placeholder="Search history..."
                    className="pl-9 h-9 text-[13px] w-44 rounded-[8px]"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 rounded-[8px] border border-[#E4E0DA] bg-[#FFFFFF] px-3 type-caption font-medium focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="oil">Oil Service</option>
                  <option value="brake">Brakes</option>
                  <option value="diagnostic">Diagnostics</option>
                  <option value="tire">Tires</option>
                </select>
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <p className="py-8 text-center type-caption text-[#6B6F76]">
                No matching maintenance records found.
              </p>
            ) : (
              <div className="relative space-y-6 pl-4 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E4E0DA]">
                {filteredHistory.map((rec) => (
                  <div key={rec.id} className="relative flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF7A29] text-white z-10">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <div className="flex-1 rounded-[12px] border border-[#E4E0DA] bg-[#F7F5F2]/50 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="type-small font-bold text-[#1A1D23]">{rec.type}</h4>
                        <span className="type-small font-bold text-[#FF7A29]">${rec.cost.toFixed(2)}</span>
                      </div>
                      <p className="type-body text-[#6B6F76] mt-1 text-[14px]">{rec.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 type-caption text-[#6B6F76] border-t border-[#E4E0DA] pt-2">
                        <span>Date: {rec.date}</span>
                        <span>Garage: {rec.garageName}</span>
                        <span>Mileage: {rec.mileage.toLocaleString()} mi</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Reminders */}
        <TabsContent value="reminders">
          <div className="rounded-[12px] border border-[#E4E0DA] bg-[#FFFFFF] p-6 space-y-3">
            <h3 className="type-h3 font-display text-[#1A1D23] mb-4">Scheduled Maintenance Reminders</h3>
            {vehicle.reminders.map((r) => (
              <div
                key={r.id}
                className={cn(
                  'flex items-center justify-between p-4 rounded-[8px] border transition-colors',
                  r.severity === 'urgent' ? 'border-[#F4D3D1] bg-[#F9E8E7]' : 'border-[#E4E0DA] bg-[#FFFFFF]'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-[8px]', r.severity === 'urgent' ? 'bg-[#B3423A]/10 text-[#B3423A]' : 'bg-[#FFE8D6] text-[#FF7A29]')}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="type-small font-medium text-[#1A1D23]">{r.title}</p>
                    <p className="type-caption text-[#6B6F76]">Due: {r.dueDate}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    'rounded-[8px] px-3 py-1 type-caption font-medium',
                    r.severity === 'urgent' ? 'bg-[#B3423A] text-white' : 'bg-[#FFE8D6] text-[#FF7A29]'
                  )}
                >
                  {r.daysUntil} days remaining
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D23]/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[16px] bg-[#FFFFFF] border border-[#E4E0DA] p-6 sm:p-8 shadow-[0_4px_16px_rgba(26,29,35,0.10)]">
            <h2 className="type-h2 font-display text-[#1A1D23] mb-4">Upload Vehicle Document</h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="doc-name" className="type-small font-medium text-[#1A1D23]">Document Title</Label>
                <Input
                  id="doc-name"
                  placeholder="e.g. Comprehensive Insurance Policy"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="doc-type" className="type-small font-medium text-[#1A1D23]">Category</Label>
                <select
                  id="doc-type"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-[8px] border border-[#E4E0DA] bg-[#FFFFFF] p-2.5 type-small text-[#1A1D23] focus:outline-none"
                >
                  <option value="insurance">Insurance Policy</option>
                  <option value="registration">Vehicle Registration</option>
                  <option value="inspection">Annual Inspection</option>
                  <option value="warranty">Warranty Record</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="doc-expiry" className="type-small font-medium text-[#1A1D23]">Expiration Date</Label>
                <Input
                  id="doc-expiry"
                  type="date"
                  value={docExpiryDate}
                  onChange={(e) => setDocExpiryDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4E0DA]">
                <Button type="button" variant="outline" onClick={() => setShowDocModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save Document'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Vehicle Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D23]/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[16px] bg-[#FFFFFF] border border-[#E4E0DA] p-6 sm:p-8 shadow-[0_4px_16px_rgba(26,29,35,0.10)] space-y-4">
            <div className="flex items-center gap-3 text-[#B3423A]">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="type-h2 font-display text-[#1A1D23]">Delete Vehicle</h2>
            </div>
            <p className="type-body text-[#6B6F76]">
              Are you sure you want to delete <span className="font-bold text-[#1A1D23]">{vehicle.make} {vehicle.model} ({vehicle.plate})</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4E0DA]">
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteVehicle}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Vehicle'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-caption text-[#6B6F76]">{label}</p>
      <p className="type-small font-medium text-[#1A1D23] mt-0.5">{value}</p>
    </div>
  );
}

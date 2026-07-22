'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Car, ShieldCheck, Wrench, AlertTriangle, CheckCircle, Clock, FileText, Printer, ArrowRight, Download, Calendar, DollarSign, Cpu, Disc, Zap, Thermometer } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

export default function VehicleHealthPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');
  const [healthData, setHealthData] = useState<any | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Report Modal
  const [activeReportModal, setActiveReportModal] = useState<any | null>(null);

  useEffect(() => {
    fetchInitialVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchVehicleHealthAndReports(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  const fetchInitialVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vehicles`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setVehicles(data.data);
        setSelectedVehicleId(data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const fetchVehicleHealthAndReports = async (vehId: string) => {
    setLoading(true);
    try {
      const [healthRes, reportsRes] = await Promise.all([
        fetch(`${API_BASE}/api/vehicles/${vehId}/health`).then(r => r.json()),
        fetch(`${API_BASE}/api/vehicles/${vehId}/reports`).then(r => r.json())
      ]);

      if (healthRes.success) setHealthData(healthRes.data);
      if (reportsRes.success) setReports(reportsRes.data || []);
    } catch (err) {
      console.error('Error loading health data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'WARNING': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CRITICAL': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="space-y-10">
      {/* Header & Vehicle Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Real-Time Vehicle Health & Diagnostics
          </div>
          <h1 className="text-3xl font-extrabold text-white">Vehicle Maintenance Reports Hub</h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor real-time system metrics, review certified digital repair reports, and stay ahead of recommended service intervals.
          </p>
        </div>

        {/* Vehicle Selector Tabs */}
        <div className="flex items-center gap-3 bg-gray-950 p-2 rounded-2xl border border-gray-800">
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicleId(v.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                selectedVehicleId === v.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{v.make} {v.model} ({v.year})</span>
            </button>
          ))}
        </div>
      </div>

      {loading || !healthData ? (
        <div className="p-12 text-center glass-panel rounded-3xl text-gray-400 animate-pulse">
          Loading vehicle health diagnostics...
        </div>
      ) : (
        <>
          {/* Top Vehicle Overview & Score Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Hero Card */}
            <div className="lg:col-span-1 glass-panel p-6 rounded-3xl space-y-5 flex flex-col justify-between border border-gray-800">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-gray-800">
                <img
                  src={currentVehicle?.image}
                  alt={healthData.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                    VIN: {healthData.vin || currentVehicle?.vin}
                  </span>
                  <span className="bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {healthData.licensePlate}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  {healthData.year} {healthData.make} {healthData.model}
                </h2>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <div>
                    Mileage: <strong className="text-gray-200">{healthData.currentMileage.toLocaleString()} mi</strong>
                  </div>
                  <span>•</span>
                  <div>
                    Last Serviced: <strong className="text-gray-200">{new Date(healthData.lastServicedAt).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">Owner Warranty Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Active Coverage
                </span>
              </div>
            </div>

            {/* Circular Health Score Card */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="relative flex items-center justify-center">
                {/* SVG Radial Health Gauge */}
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#1F2937"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#healthGradient)"
                    strokeWidth="14"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - healthData.overallHealthScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {healthData.overallHealthScore}%
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mt-1">
                    Health Score
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-lg font-bold text-white">Overall Condition: Excellent</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Based on 50-point diagnostic scan during last garage service. All primary safety & powertrain modules are operating within factory specs.
                  </p>
                </div>

                {/* Quick Diagnostics Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="text-[11px] text-gray-400">Engine / Motor</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">Optimal (96%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="text-[11px] text-gray-400">Braking System</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">Serviced (98%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="text-[11px] text-gray-400">Electrical & ECU</div>
                    <div className="text-sm font-bold text-blue-400 mt-0.5">Passed Scan (95%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                    <div className="text-[11px] text-gray-400">Tire Tread Depth</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">4/32" (Attention)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subsystem Health Matrix */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              Subsystem Health Diagnostics Matrix
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(healthData.systemHealth || {}).map(([key, info]: [string, any]) => {
                const titleMap: Record<string, string> = {
                  batteryAndPower: 'Battery & Power System',
                  brakes: 'Brakes & Friction Components',
                  transmissionDrive: 'Transmission & Driveline',
                  suspensionSteering: 'Suspension & Steering',
                  electricalElectronics: 'Electrical & ECU Sensors',
                  tiresFluids: 'Tires, Wheels & Fluids'
                };

                return (
                  <div key={key} className="glass-panel p-5 rounded-2xl space-y-3 border border-gray-800">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">
                        {titleMap[key] || key}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusColor(info.status)}`}>
                        {info.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Module Score</span>
                        <span className="font-bold text-white">{info.score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            info.score >= 90 ? 'bg-emerald-500' : info.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${info.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/60 font-mono">
                      {info.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Maintenance History Reports & Invoices */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Certified Maintenance Reports & Service History ({reports.length})
              </h2>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="glass-panel glass-panel-hover p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                        Invoice #{r.invoiceNumber || 'INV-2026'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(r.serviceDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{r.summary}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                      <span>Facility: <strong className="text-gray-200">{r.garageName}</strong></span>
                      <span>•</span>
                      <span>Mechanic: <strong className="text-purple-300">{r.mechanicName}</strong></span>
                      <span>•</span>
                      <span>Total Paid: <strong className="text-emerald-400">${r.totalPaid?.toFixed(2)}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveReportModal(r)}
                    className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm border border-gray-700 flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    View & Print Official Report
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Preventative Maintenance Schedule */}
          <section className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Upcoming Preventative Maintenance Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthData.upcomingMaintenance?.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Target: {m.recommendedMileage.toLocaleString()} mi
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase">{m.priority} Priority</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{m.task}</h3>
                  <p className="text-xs text-gray-400">
                    Est. in {(m.recommendedMileage - healthData.currentMileage).toLocaleString()} miles
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* PRINTABLE OFFICIAL REPORT MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-modal rounded-3xl p-8 space-y-6 shadow-2xl border border-gray-700 my-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 no-print">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AutoDoc Certified Service Certificate
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Printer className="w-4 h-4" />
                  Print / Download PDF
                </button>
                <button
                  onClick={() => setActiveReportModal(null)}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Document Content */}
            <div className="space-y-6 text-left">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b border-gray-800 pb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">AutoDoc Official Maintenance Report</h1>
                  <p className="text-xs text-gray-400 mt-1">Certified Digital Vehicle Health & Service Record</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">{activeReportModal.invoiceNumber}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Date: {new Date(activeReportModal.serviceDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Service & Provider Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800 text-xs">
                <div>
                  <div className="text-gray-400 uppercase text-[10px] font-bold">Service Facility</div>
                  <div className="font-bold text-white text-sm mt-0.5">{activeReportModal.garageName}</div>
                  <div className="text-gray-400">Master Tech: {activeReportModal.mechanicName}</div>
                </div>
                <div>
                  <div className="text-gray-400 uppercase text-[10px] font-bold">Vehicle Info</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {currentVehicle?.year} {currentVehicle?.make} {currentVehicle?.model}
                  </div>
                  <div className="text-gray-400">VIN: {currentVehicle?.vin}</div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Service Work Summary</h3>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-sm text-gray-200">
                  {activeReportModal.summary}
                </div>
              </div>

              {/* Replaced Parts Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Replaced Components & Warranty</h3>
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-900 text-gray-400">
                      <tr>
                        <th className="p-3">Component / Part Name</th>
                        <th className="p-3">Part #</th>
                        <th className="p-3">Warranty</th>
                        <th className="p-3 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-200">
                      {activeReportModal.replacedParts?.map((part: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-white">{part.name}</td>
                          <td className="p-3 font-mono text-gray-400">{part.partNumber}</td>
                          <td className="p-3 text-emerald-400">{part.warranty}</td>
                          <td className="p-3 text-right font-bold">${part.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mechanic Sign-off Notes */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-xs space-y-1">
                <div className="font-bold text-blue-400">Certified Mechanic Sign-off Notes</div>
                <div className="text-gray-300 font-mono">{activeReportModal.mechanicNotes}</div>
              </div>

              {/* Total Paid Footer */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-400">Total Service Payment Settled</span>
                <span className="text-xl font-extrabold text-emerald-400">${activeReportModal.totalPaid?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

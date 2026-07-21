'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Star, Car, Wrench, ShieldCheck, ArrowRight, AlertCircle, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

export default function OverviewPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [unratedCount, setUnratedCount] = useState<number>(0);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [vRes, uRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/api/vehicles`).then(r => r.json()),
          fetch(`${API_BASE}/api/bookings/unrated`).then(r => r.json()),
          fetch(`${API_BASE}/api/reviews`).then(r => r.json()),
        ]);

        if (vRes.success) setVehicles(vRes.data || []);
        if (uRes.success) setUnratedCount(uRes.count || 0);
        if (rRes.success) setRecentReviews(rRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-10 border border-gray-800">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            AutoDoc Marketplace Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Alex Morgan</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Manage your registered vehicles, view real-time diagnostic health scores, access official maintenance reports, and rate verified garages and mechanics after service.
          </p>

          {unratedCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              You have {unratedCount} completed service booking ready to rate!
              <Link href="/ratings" className="underline hover:text-white ml-2 flex items-center gap-1">
                Rate Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Feature Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Card 1: Vehicle Health & Reports */}
        <Link
          href="/vehicle-health"
          className="group relative glass-panel glass-panel-hover p-8 rounded-3xl border border-gray-800 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-gray-950 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>

            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Feature #2
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                Vehicle Health & Maintenance Reports
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                Inspect 50-point subsystem health metrics (Engine, Brakes, Transmission, Electronics), generate printable digital certificates, and track full service history.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-300">
            <span className="font-semibold text-emerald-400">2 Vehicles Monitored</span>
            <span className="flex items-center gap-1 font-bold text-white group-hover:underline">
              View Health Hub <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Feature Card 2: Customer Ratings & Reviews */}
        <Link
          href="/ratings"
          className="group relative glass-panel glass-panel-hover p-8 rounded-3xl border border-gray-800 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-gray-950 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 fill-gray-950" />
            </div>

            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Feature #1
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                Rate Garages & Mechanics
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                Rate garage facilities and assigned mechanics after service. Share feedback, view verified customer review feeds, and check provider ratings.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-300">
            <span className="font-semibold text-amber-400">
              {unratedCount > 0 ? `${unratedCount} Service Ready to Rate` : 'All Services Rated'}
            </span>
            <span className="flex items-center gap-1 font-bold text-white group-hover:underline">
              Open Ratings <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Vehicle Summary Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-400" />
          My Registered Vehicles ({vehicles.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="glass-panel p-6 rounded-3xl border border-gray-800 flex items-center gap-6">
              <img
                src={v.image}
                alt={v.model}
                className="w-32 h-24 rounded-2xl object-cover border border-gray-800 shadow-md"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{v.year} {v.make} {v.model}</h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {v.healthScore}% Health
                  </span>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <div>License: <strong className="text-gray-200">{v.licensePlate}</strong></div>
                  <div>Current Mileage: <strong className="text-gray-200">{v.currentMileage.toLocaleString()} mi</strong></div>
                </div>

                <Link
                  href="/vehicle-health"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 pt-1"
                >
                  View Full Diagnostics <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Reviews Snapshot */}
      <section className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Community Reviews Snapshot
          </h2>
          <Link href="/ratings" className="text-xs text-blue-400 hover:underline font-semibold">
            See All Reviews →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentReviews.slice(0, 2).map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{r.customerName}</span>
                <span className="text-amber-400 font-bold">★ {r.garageRating}/5 Stars</span>
              </div>
              <p className="text-xs text-gray-300 italic">"{r.comment}"</p>
              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                <span>Garage: {r.garageName}</span>
                <span>Mechanic: {r.mechanicName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

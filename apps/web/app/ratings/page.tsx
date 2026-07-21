'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Wrench, Building2, User, MessageSquare, AlertCircle, CheckCircle2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

export default function RatingsPage() {
  const [unratedBookings, setUnratedBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [garages, setGarages] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [garageRating, setGarageRating] = useState(5);
  const [mechanicRating, setMechanicRating] = useState(5);
  const [hoverGarage, setHoverGarage] = useState(0);
  const [hoverMechanic, setHoverMechanic] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [unratedRes, reviewsRes, garagesRes, mechanicsRes] = await Promise.all([
        fetch(`${API_BASE}/api/bookings/unrated`).then(r => r.json()),
        fetch(`${API_BASE}/api/reviews`).then(r => r.json()),
        fetch(`${API_BASE}/api/garages`).then(r => r.json()),
        fetch(`${API_BASE}/api/garages/mechanics`).then(r => r.json()),
      ]);

      if (unratedRes.success) setUnratedBookings(unratedRes.data || []);
      if (reviewsRes.success) setReviews(reviewsRes.data || []);
      if (garagesRes.success) setGarages(garagesRes.data || []);
      if (mechanicsRes.success) setMechanics(mechanicsRes.data || []);
    } catch (err) {
      console.error('Error fetching ratings data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (booking: any) => {
    setSelectedBooking(booking);
    setGarageRating(5);
    setMechanicRating(5);
    setComment('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!comment.trim()) {
      alert('Please add a brief comment describing your service experience.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          garageRating,
          mechanicRating,
          comment: comment.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setToastMessage('Thank you! Your rating and review have been published.');
        setTimeout(() => setToastMessage(''), 5000);

        setSelectedBooking(null);
        fetchData(); // Refresh data
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Network error while submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-500 text-white shadow-2xl shadow-emerald-900/50 animate-bounce">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-gray-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-blue-400" />
              Verified Reviews & Feedback
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Rate Garages & Mechanics
            </h1>
            <p className="mt-2 text-gray-400 max-w-2xl text-sm sm:text-base">
              Share your honest service experience to help build trust in the AutoDoc mechanic network and maintain top-tier garage service standards.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-900/80 p-4 rounded-xl border border-gray-800">
            <div className="text-center px-3 border-r border-gray-800">
              <div className="text-2xl font-bold text-white">{garages.length}</div>
              <div className="text-[11px] text-gray-400">Garages</div>
            </div>
            <div className="text-center px-3 border-r border-gray-800">
              <div className="text-2xl font-bold text-white">{mechanics.length}</div>
              <div className="text-[11px] text-gray-400">Mechanics</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-blue-400">{reviews.length}</div>
              <div className="text-[11px] text-gray-400">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unrated Completed Services Alert Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Services Awaiting Your Rating ({unratedBookings.length})
          </h2>
        </div>

        {unratedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unratedBookings.map((b) => (
              <div
                key={b.id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      Service Completed
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(b.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{b.serviceType}</h3>
                  <p className="text-xs text-gray-400 mt-1">{b.vehicleInfo}</p>

                  <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span>{b.garageName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-purple-400" />
                      <span>{b.mechanicName}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenReviewModal(b)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Star className="w-4 h-4 fill-gray-950" />
                  Rate Garage & Mechanic Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl glass-panel text-center text-gray-400 text-sm flex items-center justify-center gap-2 border border-emerald-500/20 bg-emerald-950/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            All completed services have been rated! Thank you for keeping our marketplace transparent.
          </div>
        )}
      </section>

      {/* Garages & Mechanics Overview Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Garages Directory */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Certified Garages ({garages.length})
          </h2>
          <div className="space-y-4">
            {garages.map((g) => (
              <div key={g.id} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
                <img
                  src={g.image}
                  alt={g.name}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">{g.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {g.rating}
                      <span className="text-gray-400 text-[10px]">({g.totalReviews})</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{g.address}</p>
                  <p className="text-xs text-blue-400 mt-1">{g.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mechanics Directory */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-400" />
            Verified Mechanics ({mechanics.length})
          </h2>
          <div className="space-y-4">
            {mechanics.map((m) => (
              <div key={m.id} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-20 h-20 rounded-full object-cover border border-purple-500/30 p-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">{m.name}</h3>
                    <div className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-lg border border-purple-500/20 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-purple-400" />
                      {m.rating}
                      <span className="text-gray-400 text-[10px]">({m.totalReviews})</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 font-medium">{m.specialization}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.garageName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Feed */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Recent Customer Reviews ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="glass-panel p-6 rounded-2xl space-y-4 border border-gray-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {r.customerName ? r.customerName[0] : 'C'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      {r.customerName}
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.garageRating ? 'fill-amber-400' : 'text-gray-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">Verified Service</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 italic bg-gray-900/50 p-3 rounded-xl border border-gray-800/50">
                "{r.comment}"
              </p>

              <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
                <span>Garage: <strong className="text-gray-200">{r.garageName}</strong></span>
                {r.mechanicName && (
                  <span>Mechanic: <strong className="text-purple-300">{r.mechanicName}</strong></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RATING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl glass-modal rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-700/80 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Post-Service Rating & Feedback
              </div>
              <h2 className="text-2xl font-bold text-white">Rate Your Service Experience</h2>
              <p className="text-xs text-gray-400 mt-1">
                Booking: <strong className="text-gray-200">{selectedBooking.serviceType}</strong> ({selectedBooking.vehicleInfo})
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Garage Rating */}
              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Garage Facility & Service Quality ({selectedBooking.garageName})
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setGarageRating(star)}
                      onMouseEnter={() => setHoverGarage(star)}
                      onMouseLeave={() => setHoverGarage(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverGarage || garageRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-amber-400">
                    {hoverGarage || garageRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Mechanic Rating */}
              {selectedBooking.mechanicName && (
                <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-purple-400" />
                    Mechanic Workmanship ({selectedBooking.mechanicName})
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setMechanicRating(star)}
                        onMouseEnter={() => setHoverMechanic(star)}
                        onMouseLeave={() => setHoverMechanic(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverMechanic || mechanicRating)
                              ? 'text-purple-400 fill-purple-400'
                              : 'text-gray-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm font-bold text-purple-400">
                      {hoverMechanic || mechanicRating} / 5 Stars
                    </span>
                  </div>
                </div>
              )}

              {/* Review Comments */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Your Detailed Feedback & Comments
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the communication, timeliness, and repair quality? Describe your experience..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Publish Rating & Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

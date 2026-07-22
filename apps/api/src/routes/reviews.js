const express = require('express');
const router = express.Router();
const { reviews, serviceBookings, garages, mechanics } = require('../data/mockStore');

// GET /api/reviews - Get all reviews
router.get('/', (req, res) => {
  const { garageId, mechanicId, customerId } = req.query;
  let filtered = [...reviews];

  if (garageId) {
    filtered = filtered.filter(r => r.garageId === garageId);
  }
  if (mechanicId) {
    filtered = filtered.filter(r => r.mechanicId === mechanicId);
  }
  if (customerId) {
    filtered = filtered.filter(r => r.customerId === customerId);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// POST /api/reviews - Rate garage and mechanic post-service
router.post('/', (req, res) => {
  const { bookingId, garageRating, mechanicRating, comment } = req.body;

  if (!bookingId || !garageRating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID, garage rating (1-5), and comment are required.'
    });
  }

  const booking = serviceBookings.find(b => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Service booking not found.' });
  }

  if (booking.isRated) {
    return res.status(400).json({ success: false, message: 'This service booking has already been rated.' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    bookingId: booking.id,
    customerId: booking.customerId,
    customerName: "Alex Morgan",
    garageId: booking.garageId,
    garageName: booking.garageName,
    mechanicId: booking.mechanicId || null,
    mechanicName: booking.mechanicName || null,
    garageRating: parseInt(garageRating, 10),
    mechanicRating: mechanicRating ? parseInt(mechanicRating, 10) : null,
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };

  // Add to reviews store
  reviews.unshift(newReview);

  // Mark booking as rated
  booking.isRated = true;

  // Recalculate Garage Average Rating
  const garageReviews = reviews.filter(r => r.garageId === booking.garageId);
  const garage = garages.find(g => g.id === booking.garageId);
  if (garage && garageReviews.length > 0) {
    const sum = garageReviews.reduce((acc, curr) => acc + curr.garageRating, 0);
    garage.rating = parseFloat((sum / garageReviews.length).toFixed(1));
    garage.totalReviews = garageReviews.length;
  }

  // Recalculate Mechanic Average Rating
  if (booking.mechanicId) {
    const mechanicReviews = reviews.filter(r => r.mechanicId === booking.mechanicId && r.mechanicRating);
    const mechanic = mechanics.find(m => m.id === booking.mechanicId);
    if (mechanic && mechanicReviews.length > 0) {
      const sum = mechanicReviews.reduce((acc, curr) => acc + curr.mechanicRating, 0);
      mechanic.rating = parseFloat((sum / mechanicReviews.length).toFixed(2));
      mechanic.totalReviews = mechanicReviews.length;
    }
  }

  res.status(201).json({
    success: true,
    message: 'Rating and review submitted successfully!',
    data: newReview
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { serviceBookings } = require('../data/mockStore');

// GET /api/bookings - List bookings
router.get('/', (req, res) => {
  const { customerId, status } = req.query;
  let result = [...serviceBookings];
  if (customerId) {
    result = result.filter(b => b.customerId === customerId);
  }
  if (status) {
    result = result.filter(b => b.status === status);
  }
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/bookings/unrated - Get completed bookings needing reviews
router.get('/unrated', (req, res) => {
  const unrated = serviceBookings.filter(b => b.status === 'COMPLETED' && !b.isRated);
  res.json({ success: true, count: unrated.length, data: unrated });
});

module.exports = router;

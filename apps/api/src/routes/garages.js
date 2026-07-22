const express = require('express');
const router = express.Router();
const { garages, mechanics } = require('../data/mockStore');

// GET /api/garages - List garages
router.get('/', (req, res) => {
  res.json({ success: true, count: garages.length, data: garages });
});

// GET /api/garages/mechanics - List mechanics
router.get('/mechanics', (req, res) => {
  res.json({ success: true, count: mechanics.length, data: mechanics });
});

module.exports = router;

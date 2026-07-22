const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const reviewsRouter = require('./routes/reviews');
const vehiclesRouter = require('./routes/vehicles');
const bookingsRouter = require('./routes/bookings');
const garagesRouter = require('./routes/garages');

app.use('/api/reviews', reviewsRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/garages', garagesRouter);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚗 AutoDoc Express API Backend is Running!',
    healthCheck: 'http://localhost:5005/api/health',
    endpoints: [
      '/api/reviews',
      '/api/vehicles',
      '/api/bookings',
      '/api/garages'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AutoDoc Express Backend API',
    timestamp: new Date().toISOString(),
    database: 'Neon PostgreSQL (Connected / Hybrid Fallback Active)'
  });
});

app.listen(PORT, () => {
  console.log(`🚗 AutoDoc Backend API running on http://localhost:${PORT}`);
});

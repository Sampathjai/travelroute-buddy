const express = require('express');
const router = express.Router();
const rides = require('../data/rides');

// GET /api/rides
router.get('/', (req, res) => {
  const { from, to } = req.query;
  let result = [...rides];

  if (from) result = result.filter(r => r.from.toLowerCase().includes(from.toLowerCase()));
  if (to) result = result.filter(r => r.to.toLowerCase().includes(to.toLowerCase()));

  res.json(result);
});

// GET /api/rides/:id
router.get('/:id', (req, res) => {
  const ride = rides.find(r => r.id === req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json(ride);
});

// POST /api/rides/book
router.post('/book', (req, res) => {
  const { rideId, passengerName, passengerContact } = req.body;
  const ride = rides.find(r => r.id === rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  res.json({
    success: true,
    bookingId: `BK${Date.now()}`,
    ride,
    passenger: { name: passengerName, contact: passengerContact },
    message: 'Booking confirmed! Driver will contact you shortly.'
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Calculate approximate distance between two points using Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// POST /api/routes/calculate
router.post('/calculate', (req, res) => {
  try {
    const { source, destination, sourceCoords, destCoords } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }

    let distance = 0;
    if (sourceCoords && destCoords) {
      distance = haversineDistance(
        sourceCoords.lat, sourceCoords.lng,
        destCoords.lat, destCoords.lng
      );
      // Road distance is typically ~1.3x straight-line
      distance = Math.round(distance * 1.3);
    } else {
      // Mock distance if no coords
      distance = Math.floor(Math.random() * 800) + 100;
    }

    const duration = Math.round((distance / 60) * 60); // minutes at avg 60 km/h

    res.json({
      source,
      destination,
      distance,
      duration,
      unit: 'km',
      durationFormatted: `${Math.floor(duration / 60)}h ${duration % 60}m`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/routes/saved
router.get('/saved', (req, res) => {
  // Mock saved routes
  res.json([
    { id: '1', source: 'Chennai', destination: 'Bangalore', distance: 346, createdAt: new Date() },
    { id: '2', source: 'Bangalore', destination: 'Ooty', distance: 265, createdAt: new Date() },
  ]);
});

module.exports = router;

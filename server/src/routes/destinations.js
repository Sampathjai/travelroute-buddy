const express = require('express');
const router = express.Router();
const destinations = require('../data/destinations');

// GET /api/destinations
router.get('/', (req, res) => {
  const { category, state, search } = req.query;
  let result = [...destinations];

  if (category) result = result.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
  if (state) result = result.filter(d => d.state.toLowerCase() === state.toLowerCase());
  if (search) result = result.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  res.json(result);
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  const dest = destinations.find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json(dest);
});

module.exports = router;

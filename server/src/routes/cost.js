const express = require('express');
const router = express.Router();

// POST /api/cost/estimate
router.post('/estimate', (req, res) => {
  const {
    distance = 0,
    fuelEfficiency = 15, // km/l
    fuelPrice = 102,     // INR per litre
    days = 1,
    travelers = 1,
    accommodation = 'budget' // budget | standard | luxury
  } = req.body;

  // Fuel cost
  const fuelCost = Math.round((distance / fuelEfficiency) * fuelPrice);

  // Accommodation per night per person
  const stayRates = { budget: 800, standard: 2000, luxury: 5000 };
  const stayCost = stayRates[accommodation] * days * Math.ceil(travelers / 2);

  // Food per day per person (breakfast + lunch + dinner)
  const foodCost = 600 * days * travelers;

  // Miscellaneous (sightseeing, tips, tolls ~15%)
  const miscCost = Math.round((fuelCost + stayCost + foodCost) * 0.15);

  const total = fuelCost + stayCost + foodCost + miscCost;

  res.json({
    breakdown: {
      fuel: fuelCost,
      accommodation: stayCost,
      food: foodCost,
      miscellaneous: miscCost,
    },
    total,
    perPerson: Math.round(total / travelers),
    currency: 'INR',
    inputs: { distance, fuelEfficiency, fuelPrice, days, travelers, accommodation }
  });
});

module.exports = router;

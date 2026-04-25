const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock weather data for common Indian cities
const mockWeather = {
  default: { temp: 28, feels_like: 31, humidity: 65, wind: 12, condition: 'Partly Cloudy', icon: '⛅' },
  chennai: { temp: 34, feels_like: 38, humidity: 78, wind: 15, condition: 'Sunny', icon: '☀️' },
  bangalore: { temp: 24, feels_like: 25, humidity: 60, wind: 10, condition: 'Pleasant', icon: '🌤️' },
  mumbai: { temp: 30, feels_like: 34, humidity: 82, wind: 18, condition: 'Humid', icon: '🌦️' },
  ooty: { temp: 16, feels_like: 14, humidity: 72, wind: 8, condition: 'Cool & Misty', icon: '🌫️' },
  munnar: { temp: 18, feels_like: 16, humidity: 80, wind: 6, condition: 'Foggy', icon: '🌫️' },
  coorg: { temp: 20, feels_like: 19, humidity: 75, wind: 9, condition: 'Cloudy', icon: '☁️' },
  gokarna: { temp: 29, feels_like: 33, humidity: 70, wind: 14, condition: 'Sunny', icon: '☀️' },
  hampi: { temp: 32, feels_like: 36, humidity: 45, wind: 11, condition: 'Hot & Dry', icon: '🌞' },
  alleppey: { temp: 27, feels_like: 31, humidity: 88, wind: 16, condition: 'Tropical', icon: '🌴' },
  pondicherry: { temp: 30, feels_like: 34, humidity: 75, wind: 20, condition: 'Breezy', icon: '🌊' },
  hyderabad: { temp: 33, feels_like: 37, humidity: 50, wind: 13, condition: 'Warm', icon: '🌤️' },
  kochi: { temp: 28, feels_like: 32, humidity: 85, wind: 17, condition: 'Humid', icon: '🌦️' },
};

// GET /api/weather?city=Chennai
router.get('/', async (req, res) => {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Try real API if key provided
  if (apiKey && apiKey !== 'your_openweather_api_key_here') {
    try {
      const params = lat && lon
        ? { lat, lon, appid: apiKey, units: 'metric' }
        : { q: city, appid: apiKey, units: 'metric' };
      const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
      return res.json({
        city: data.name,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        source: 'live'
      });
    } catch (e) {
      // fall through to mock
    }
  }

  // Fallback mock
  const key = (city || '').toLowerCase().replace(/\s/g, '');
  const weather = mockWeather[key] || mockWeather.default;
  res.json({ city: city || 'Unknown', ...weather, source: 'mock' });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const routeRoutes = require('./routes/routes');
const weatherRoutes = require('./routes/weather');
const destinationRoutes = require('./routes/destinations');
const rideRoutes = require('./routes/rides');
const costRoutes = require('./routes/cost');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Try MongoDB connection (fallback to local JSON if unavailable)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  No MONGODB_URI set — using local JSON data fallback');
    }
  } catch (err) {
    console.log('⚠️  MongoDB unavailable — using local JSON data fallback');
  }
};
connectDB();

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/cost', costRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log("PORT VALUE:", PORT);

app.listen(PORT, () => {
  console.log(`🚀 TravelRoute Buddy server running on http://localhost:${PORT}`);
});

# 🗺️ TravelRoute Buddy

A full-stack travel planning web application built with React, TypeScript, Express, and MongoDB.

## ✨ Features

| Feature | Description |
|---|---|
| 🛣️ **Route Planner** | Enter source & destination, calculate distance & duration, visualize on Mapbox |
| 💰 **Cost Estimator** | Slider-based fuel, accommodation, food & misc cost breakdown with pie chart |
| 📍 **Destinations** | Browse 8 handpicked Indian destinations with filters, ratings, and map previews |
| 🌤️ **Weather Info** | Live weather via OpenWeather API with graceful mock fallback |
| 🚗 **Ride Sharing** | Browse available rides, filter by route, and book with a modal flow |

## 🏗️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (utility-first styling)
- Mapbox GL JS (interactive maps)
- Axios (API client)
- Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose (JSON fallback if DB unavailable)
- Axios (for weather API proxy)
- Morgan (logging), CORS, dotenv

## 📁 Project Structure

```
travelroute-buddy/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.tsx            # Root with tab navigation
│   │   ├── main.tsx           # Entry point
│   │   ├── index.css          # Global styles + Tailwind
│   │   ├── api/index.ts       # Axios API client
│   │   ├── types/index.ts     # TypeScript interfaces
│   │   ├── components/
│   │   │   ├── UI.tsx         # Shared components (Badge, InfoCard, etc.)
│   │   │   └── MapView.tsx    # Mapbox GL wrapper
│   │   └── pages/
│   │       ├── RoutePlanner.tsx
│   │       ├── CostEstimator.tsx
│   │       ├── Destinations.tsx
│   │       ├── WeatherInfo.tsx
│   │       └── RideSharing.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── index.js           # Entry point, middleware, DB
│   │   ├── routes/
│   │   │   ├── routes.js      # Route calculator
│   │   │   ├── weather.js     # Weather (live + mock)
│   │   │   ├── destinations.js
│   │   │   ├── rides.js
│   │   │   └── cost.js
│   │   └── data/
│   │       ├── destinations.js # 8 Indian destinations
│   │       └── rides.js        # 6 mock rides
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB (optional — falls back to JSON)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Server
cd server
cp .env.example .env

# Client
cd ../client
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travelroute   # optional
OPENWEATHER_API_KEY=your_key_here                    # optional, falls back to mock
CLIENT_URL=http://localhost:5173
```

Edit `client/.env`:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here    # optional, shows placeholder without it
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### 4. Build for Production

```bash
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm start
```

## 🔑 API Keys (All Optional)

| Key | Where to Get | Fallback |
|---|---|---|
| `VITE_MAPBOX_TOKEN` | [mapbox.com](https://mapbox.com) | Grid placeholder + coordinates shown |
| `OPENWEATHER_API_KEY` | [openweathermap.org](https://openweathermap.org/api) | Curated mock data for Indian cities |
| `MONGODB_URI` | Local MongoDB or [MongoDB Atlas](https://cloud.mongodb.com) | In-memory JSON data |

> **The app works fully without any API keys.** All features gracefully fall back to rich mock data.

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/routes/calculate` | Calculate route distance & duration |
| `GET` | `/api/weather?city=Chennai` | Get weather for a city |
| `GET` | `/api/destinations` | List destinations (supports `?search=`, `?category=`) |
| `GET` | `/api/destinations/:id` | Get single destination |
| `GET` | `/api/rides` | List rides (supports `?from=`, `?to=`) |
| `POST` | `/api/rides/book` | Book a ride |
| `POST` | `/api/cost/estimate` | Calculate trip cost |

## 🎨 Design System

- **Theme**: Dark editorial — deep ink backgrounds with amber gold accents
- **Typography**: Playfair Display (headings) + DM Sans (body) + JetBrains Mono (data)
- **Colors**: `ink-*` scale + amber, jade, sky, coral accents
- **Components**: Glass morphism cards, animated transitions, responsive grid

## 📱 Responsive Design

- Desktop: Full sidebar + map layout
- Tablet: Stacked grid
- Mobile: Bottom tab navigation bar

## 🔧 Troubleshooting

**CORS errors** — Make sure `CLIENT_URL` in `server/.env` matches your frontend URL.

**Map not showing** — Add your Mapbox token to `client/.env` as `VITE_MAPBOX_TOKEN`.

**Weather showing mock data** — Normal behavior without OpenWeather API key.

**Port conflicts** — Change `PORT` in `server/.env` and update `VITE_API_URL` in `client/.env`.

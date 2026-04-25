import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const getRoute = (data: {
  source: string;
  destination: string;
  sourceCoords?: { lat: number; lng: number };
  destCoords?: { lat: number; lng: number };
}) => api.post('/routes/calculate', data);

export const getWeather = (city: string) =>
  api.get(`/weather?city=${encodeURIComponent(city)}`);

export const getDestinations = (params?: { category?: string; state?: string; search?: string }) =>
  api.get('/destinations', { params });

export const getDestinationById = (id: string) =>
  api.get(`/destinations/${id}`);

export const getCostEstimate = (data: {
  distance: number;
  fuelEfficiency?: number;
  fuelPrice?: number;
  days?: number;
  travelers?: number;
  accommodation?: 'budget' | 'standard' | 'luxury';
}) => api.post('/cost/estimate', data);

export const getRides = (params?: { from?: string; to?: string }) =>
  api.get('/rides', { params });

export const bookRide = (data: {
  rideId: string;
  passengerName: string;
  passengerContact: string;
}) => api.post('/rides/book', data);

export default api;

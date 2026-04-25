export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteResult {
  source: string;
  destination: string;
  distance: number;
  duration: number;
  durationFormatted: string;
  unit: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
  source: 'live' | 'mock';
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  category: string;
  rating: number;
  description: string;
  image: string;
  coordinates: Coordinates;
  bestTime: string;
  highlights: string[];
  avgStayCost: number;
  avgFoodCost: number;
}

export interface Ride {
  id: string;
  driver: {
    name: string;
    rating: number;
    avatar: string;
    verified: boolean;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
  amenities: string[];
  contact: string;
}

export interface CostBreakdown {
  breakdown: {
    fuel: number;
    accommodation: number;
    food: number;
    miscellaneous: number;
  };
  total: number;
  perPerson: number;
  currency: string;
}

export type TabId = 'planner' | 'cost' | 'destinations' | 'weather' | 'rides';

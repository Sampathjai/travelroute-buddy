import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Route, ArrowRight, Search } from 'lucide-react';
import { getRoute } from '../api';
import { RouteResult } from '../types';
import MapView from '../components/MapView';
import { LoadingSpinner, ErrorMessage, InfoCard, StatRow } from '../components/UI';

// A tiny curated geocoder for demo purposes (Indian cities)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Chennai':      { lat: 13.0827, lng: 80.2707 },
  'Bangalore':    { lat: 12.9716, lng: 77.5946 },
  'Mumbai':       { lat: 19.0760, lng: 72.8777 },
  'Delhi':        { lat: 28.6139, lng: 77.2090 },
  'Hyderabad':    { lat: 17.3850, lng: 78.4867 },
  'Kochi':        { lat: 9.9312,  lng: 76.2673 },
  'Coimbatore':   { lat: 11.0168, lng: 76.9558 },
  'Ooty':         { lat: 11.4102, lng: 76.6950 },
  'Munnar':       { lat: 10.0889, lng: 77.0595 },
  'Coorg':        { lat: 12.3375, lng: 75.8069 },
  'Gokarna':      { lat: 14.5479, lng: 74.3188 },
  'Hampi':        { lat: 15.3350, lng: 76.4600 },
  'Alleppey':     { lat: 9.4981,  lng: 76.3388 },
  'Pondicherry':  { lat: 11.9416, lng: 79.8083 },
  'Mahabalipuram':{ lat: 12.6269, lng: 80.1927 },
  'Mysore':       { lat: 12.2958, lng: 76.6394 },
  'Goa':          { lat: 15.2993, lng: 74.1240 },
  'Kolkata':      { lat: 22.5726, lng: 88.3639 },
  'Jaipur':       { lat: 26.9124, lng: 75.7873 },
  'Agra':         { lat: 27.1767, lng: 78.0081 },
};

const POPULAR_ROUTES = [
  { source: 'Chennai', destination: 'Bangalore' },
  { source: 'Bangalore', destination: 'Ooty' },
  { source: 'Mumbai', destination: 'Goa' },
  { source: 'Kochi', destination: 'Munnar' },
];

const RoutePlanner: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sourceCoords = CITY_COORDS[source];
  const destCoords   = CITY_COORDS[destination];

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) {
      setError('Please enter both source and destination.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await getRoute({ source, destination, sourceCoords, destCoords });
      setResult(data);
    } catch {
      setError('Could not calculate route. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePopular = (r: { source: string; destination: string }) => {
    setSource(r.source);
    setDestination(r.destination);
    setResult(null);
    setError('');
  };

  const cities = Object.keys(CITY_COORDS);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-full">
      {/* Left Panel */}
      <div className="xl:col-span-2 space-y-5">
        {/* Inputs */}
        <div className="card space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <Route size={22} className="text-amber-500" /> Route Planner
          </h2>
          <p className="text-ink-400 text-sm -mt-2">Find the best route between any two cities.</p>

          <div className="space-y-3">
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jade-400 pointer-events-none" />
              <input
                list="source-list"
                className="input-field pl-10"
                placeholder="From — e.g. Chennai"
                value={source}
                onChange={e => { setSource(e.target.value); setResult(null); }}
              />
              <datalist id="source-list">
                {cities.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Swap button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 border-t border-ink-700" />
              <button
                onClick={() => { setSource(destination); setDestination(source); setResult(null); }}
                className="p-1.5 rounded-lg bg-ink-700 hover:bg-ink-600 text-ink-400 hover:text-ink-100 transition-all"
                title="Swap"
              >
                <ArrowRight size={14} />
              </button>
              <div className="flex-1 border-t border-ink-700" />
            </div>

            <div className="relative">
              <Navigation size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coral-400 pointer-events-none" />
              <input
                list="dest-list"
                className="input-field pl-10"
                placeholder="To — e.g. Ooty"
                value={destination}
                onChange={e => { setDestination(e.target.value); setResult(null); }}
              />
              <datalist id="dest-list">
                {cities.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Calculating…</>
            ) : (
              <><Search size={16} /> Find Route</>
            )}
          </button>
        </div>

        {/* Popular Routes */}
        <div className="card">
          <h3 className="text-ink-200 font-medium mb-3 text-sm uppercase tracking-wider">Popular Routes</h3>
          <div className="space-y-2">
            {POPULAR_ROUTES.map((r, i) => (
              <button
                key={i}
                onClick={() => handlePopular(r)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-ink-700/50 hover:bg-ink-700 border border-ink-600 hover:border-ink-500 transition-all text-left"
              >
                <div className="flex items-center gap-2 text-sm text-ink-300">
                  <span className="text-jade-400 font-medium">{r.source}</span>
                  <ArrowRight size={12} className="text-ink-500" />
                  <span className="text-coral-400 font-medium">{r.destination}</span>
                </div>
                <span className="text-xs text-ink-500">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {loading && <LoadingSpinner text="Calculating route…" />}

        {result && (
          <div className="card border-amber-500/30 bg-amber-500/5 animate-fade-up space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-jade-400" />
              <span className="text-jade-400 font-medium text-sm">{result.source}</span>
              <div className="flex-1 border-t border-dashed border-ink-600" />
              <span className="text-coral-400 font-medium text-sm">{result.destination}</span>
              <span className="w-2 h-2 rounded-full bg-coral-400" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={<Route size={18} />}
                label="Distance"
                value={result.distance}
                sub={result.unit}
                accent
              />
              <InfoCard
                icon={<Clock size={18} />}
                label="Duration"
                value={result.durationFormatted}
                sub="at 60 km/h avg"
              />
            </div>

            <div>
              <StatRow label="Straight-line estimate" value={`~${Math.round(result.distance / 1.3)} km`} />
              <StatRow label="Road factor" value="×1.3" />
              <StatRow label="Avg speed assumed" value="60 km/h" />
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="xl:col-span-3 h-[500px] xl:h-full min-h-[400px]">
        <MapView
          sourceCoords={sourceCoords}
          destCoords={destCoords}
          center={[78.9629, 20.5937]}
          zoom={4}
        />
      </div>
    </div>
  );
};

export default RoutePlanner;

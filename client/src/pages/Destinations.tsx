import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Search, X, ChevronRight } from 'lucide-react';
import { getDestinations } from '../api';
import { Destination } from '../types';
import { LoadingSpinner, ErrorMessage, Badge, SectionHeader } from '../components/UI';
import MapView from '../components/MapView';

const CATEGORIES = ['All', 'Hill Station', 'Beach', 'Heritage', 'Nature', 'Backwaters', 'Beach & Heritage', 'Heritage & Beach'];

const DestinationCard: React.FC<{ dest: Destination; onClick: () => void }> = ({ dest, onClick }) => (
  <div className="card-hover group overflow-hidden p-0" onClick={onClick}>
    {/* Image */}
    <div className="relative h-44 overflow-hidden rounded-t-2xl">
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
      <div className="absolute top-3 left-3">
        <Badge variant="amber">{dest.category}</Badge>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-ink-900/70 backdrop-blur-sm px-2 py-1 rounded-lg">
        <Star size={12} className="text-amber-400 fill-amber-400" />
        <span className="text-amber-400 text-xs font-medium">{dest.rating}</span>
      </div>
      <div className="absolute bottom-3 left-3">
        <h3 className="font-display text-white text-lg leading-tight">{dest.name}</h3>
        <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
          <MapPin size={10} /> {dest.state}
        </p>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 space-y-3">
      <p className="text-ink-400 text-sm leading-relaxed line-clamp-2">{dest.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-ink-500">
          <Clock size={11} />
          <span>Best: {dest.bestTime}</span>
        </div>
        <div className="text-xs text-ink-400">
          ~₹{dest.avgStayCost.toLocaleString('en-IN')}<span className="text-ink-600">/night</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {dest.highlights.slice(0, 3).map((h, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-ink-700 text-ink-400">{h}</span>
        ))}
        {dest.highlights.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-md bg-ink-700 text-ink-500">+{dest.highlights.length - 3}</span>
        )}
      </div>
    </div>
  </div>
);

const DestinationModal: React.FC<{ dest: Destination; onClose: () => void }> = ({ dest, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" />
    <div
      className="relative bg-ink-800 border border-ink-600 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-up shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      {/* Header image */}
      <div className="relative h-56">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover rounded-t-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 to-transparent rounded-t-2xl" />
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-ink-900/70 rounded-lg hover:bg-ink-700 transition-colors">
          <X size={16} className="text-ink-300" />
        </button>
        <div className="absolute bottom-4 left-5">
          <Badge variant="amber">{dest.category}</Badge>
          <h2 className="font-display text-3xl text-white mt-2">{dest.name}</h2>
          <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
            <MapPin size={12} /> {dest.state}, {dest.country}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <p className="text-ink-300 leading-relaxed">{dest.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Rating', value: `★ ${dest.rating}` },
            { label: 'Best Time', value: dest.bestTime },
            { label: 'Stay/night', value: `₹${dest.avgStayCost.toLocaleString('en-IN')}` },
          ].map(({ label, value }, i) => (
            <div key={i} className="bg-ink-700 rounded-xl p-3 text-center">
              <p className="text-ink-400 text-xs mb-1">{label}</p>
              <p className="text-ink-100 font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div>
          <h4 className="text-ink-300 text-sm font-medium mb-2 uppercase tracking-wider">Highlights</h4>
          <div className="grid grid-cols-2 gap-2">
            {dest.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-300">
                <ChevronRight size={12} className="text-amber-500 flex-shrink-0" />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <h4 className="text-ink-300 text-sm font-medium mb-2 uppercase tracking-wider">Location</h4>
          <div className="h-48 rounded-xl overflow-hidden">
            <MapView
              markers={[{ ...dest.coordinates, label: dest.name }]}
              center={[dest.coordinates.lng, dest.coordinates.lat]}
              zoom={8}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button className="btn-primary flex-1">Plan Route Here</button>
          <button onClick={onClose} className="btn-secondary flex-1">Close</button>
        </div>
      </div>
    </div>
  </div>
);

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered]         = useState<Destination[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('All');
  const [selected, setSelected]         = useState<Destination | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDestinations();
        setDestinations(data);
        setFiltered(data);
      } catch {
        setError('Failed to load destinations. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let res = destinations;
    if (category !== 'All') res = res.filter(d => d.category === category);
    if (search) res = res.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(res);
  }, [search, category, destinations]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Explore Destinations"
        subtitle="Discover handpicked tourist gems across India."
        icon={<MapPin size={22} />}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            className="input-field pl-10"
            placeholder="Search destinations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-amber-500 text-ink-900'
                  : 'bg-ink-700 text-ink-400 hover:bg-ink-600 hover:text-ink-200 border border-ink-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-ink-500 text-sm">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {loading && <LoadingSpinner text="Loading destinations…" />}
      {error && <ErrorMessage message={error} />}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-ink-300 font-display text-lg">No destinations found</p>
          <p className="text-ink-500 text-sm mt-1">Try a different search or category</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(dest => (
          <DestinationCard key={dest.id} dest={dest} onClick={() => setSelected(dest)} />
        ))}
      </div>

      {selected && <DestinationModal dest={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Destinations;

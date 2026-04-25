import React, { useState, useEffect } from 'react';
import { Users, Star, Car, Calendar, MapPin, Phone, Shield, X, CheckCircle } from 'lucide-react';
import { getRides, bookRide } from '../api';
import { Ride } from '../types';
import { LoadingSpinner, ErrorMessage, Badge, SectionHeader } from '../components/UI';

const AmenityBadge: React.FC<{ label: string }> = ({ label }) => {
  const icons: Record<string, string> = {
    'AC': '❄️', 'Music': '🎵', 'No Smoking': '🚭',
    'Pet Friendly': '🐾', 'Charging Point': '🔌',
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink-700 text-ink-400 text-xs">
      {icons[label] || '✓'} {label}
    </span>
  );
};

const RideCard: React.FC<{ ride: Ride; onBook: (ride: Ride) => void }> = ({ ride, onBook }) => (
  <div className="card-hover group">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-ink-900 font-bold text-sm flex-shrink-0">
          {ride.driver.avatar}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-ink-200 font-medium text-sm">{ride.driver.name}</p>
            {ride.driver.verified && (
              <Shield size={12} className="text-jade-400" title="Verified" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-ink-400 text-xs">{ride.driver.rating}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-display text-amber-400">₹{ride.price}</p>
        <p className="text-ink-500 text-xs">per seat</p>
      </div>
    </div>

    {/* Route */}
    <div className="flex items-center gap-3 py-3 border-y border-ink-700 mb-4">
      <div className="flex items-center gap-1.5 flex-1">
        <span className="w-2 h-2 rounded-full bg-jade-400 flex-shrink-0" />
        <span className="text-ink-200 font-medium text-sm">{ride.from}</span>
      </div>
      <div className="flex-shrink-0 text-ink-600">────→</div>
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        <span className="text-ink-200 font-medium text-sm">{ride.to}</span>
        <span className="w-2 h-2 rounded-full bg-coral-400 flex-shrink-0" />
      </div>
    </div>

    {/* Details */}
    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
      <div className="flex items-center gap-1.5 text-ink-400">
        <Calendar size={13} className="text-ink-500" />
        {new Date(ride.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {ride.time}
      </div>
      <div className="flex items-center gap-1.5 text-ink-400">
        <Users size={13} className="text-ink-500" />
        {ride.seats} seat{ride.seats !== 1 ? 's' : ''} available
      </div>
      <div className="flex items-center gap-1.5 text-ink-400">
        <Car size={13} className="text-ink-500" />
        {ride.vehicle.model}
      </div>
      <div className="flex items-center gap-1.5 text-ink-400">
        <MapPin size={13} className="text-ink-500" />
        {ride.vehicle.plate}
      </div>
    </div>

    {/* Amenities */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {ride.amenities.map((a, i) => <AmenityBadge key={i} label={a} />)}
    </div>

    <button
      onClick={() => onBook(ride)}
      className="btn-primary w-full text-sm"
    >
      Request to Join
    </button>
  </div>
);

const BookingModal: React.FC<{ ride: Ride; onClose: () => void }> = ({ ride, onClose }) => {
  const [name, setName]       = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError]     = useState('');

  const handleBook = async () => {
    if (!name.trim() || !contact.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await bookRide({ rideId: ride.id, passengerName: name, passengerContact: contact });
      setSuccess(data.bookingId);
    } catch {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" />
      <div
        className="relative bg-ink-800 border border-ink-600 rounded-2xl max-w-md w-full p-6 animate-fade-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-display text-xl text-ink-100">Book This Ride</h3>
            <p className="text-ink-400 text-sm mt-0.5">{ride.from} → {ride.to}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-ink-700 rounded-lg transition-colors">
            <X size={16} className="text-ink-400" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-jade-400 mx-auto mb-3" />
            <h4 className="font-display text-lg text-ink-100 mb-1">Booking Confirmed!</h4>
            <p className="text-ink-400 text-sm mb-2">Booking ID: <code className="text-amber-400">{success}</code></p>
            <p className="text-ink-500 text-xs">Driver will contact you at {contact}</p>
            <button onClick={onClose} className="btn-primary mt-5 px-8">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Ride summary */}
            <div className="bg-ink-700/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink-300">
                <span>Driver</span><span className="text-ink-100">{ride.driver.name}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Vehicle</span><span className="text-ink-100">{ride.vehicle.model}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Date & Time</span>
                <span className="text-ink-100">
                  {new Date(ride.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {ride.time}
                </span>
              </div>
              <div className="flex justify-between text-ink-300 pt-2 border-t border-ink-600">
                <span className="font-medium">Price</span>
                <span className="text-amber-400 font-display text-lg">₹{ride.price}</span>
              </div>
            </div>

            <input
              className="input-field"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Contact number"
              value={contact}
              onChange={e => setContact(e.target.value)}
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex gap-3 pt-1">
              <button onClick={handleBook} disabled={loading} className="btn-primary flex-1">
                {loading ? '⟳ Booking…' : 'Confirm Booking'}
              </button>
              <button onClick={onClose} className="btn-secondary px-4">Cancel</button>
            </div>

            <p className="text-ink-600 text-xs text-center flex items-center justify-center gap-1">
              <Shield size={11} /> Your info is only shared with the driver
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RideSharing: React.FC = () => {
  const [rides, setRides]         = useState<Ride[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filterFrom, setFrom]     = useState('');
  const [filterTo, setTo]         = useState('');
  const [booking, setBooking]     = useState<Ride | null>(null);

  const fetchRides = async () => {
    setLoading(true); setError('');
    try {
      const params: any = {};
      if (filterFrom) params.from = filterFrom;
      if (filterTo)   params.to   = filterTo;
      const { data } = await getRides(params);
      setRides(data);
    } catch {
      setError('Failed to load rides. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRides(); }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Ride Sharing"
        subtitle="Find travel companions and share the journey."
        icon={<Users size={22} />}
      />

      {/* Filter bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jade-400 pointer-events-none" />
            <input className="input-field pl-10" placeholder="From city…" value={filterFrom}
              onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coral-400 pointer-events-none" />
            <input className="input-field pl-10" placeholder="To city…" value={filterTo}
              onChange={e => setTo(e.target.value)} />
          </div>
          <button onClick={fetchRides} className="btn-primary px-6 whitespace-nowrap">
            Search Rides
          </button>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Car size={18} />, label: 'Available Rides', value: rides.length },
          { icon: <Users size={18} />, label: 'Total Seats', value: rides.reduce((s, r) => s + r.seats, 0) },
          { icon: <Star size={18} />, label: 'Avg Driver Rating', value: rides.length ? (rides.reduce((s, r) => s + r.driver.rating, 0) / rides.length).toFixed(1) : '—' },
        ].map(({ icon, label, value }, i) => (
          <div key={i} className="card text-center">
            <div className="text-amber-500 flex justify-center mb-1">{icon}</div>
            <p className="font-display text-2xl text-ink-100">{value}</p>
            <p className="text-ink-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {loading && <LoadingSpinner text="Finding rides…" />}
      {error && <ErrorMessage message={error} />}

      {!loading && rides.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🚗</div>
          <p className="text-ink-300 font-display text-lg">No rides found</p>
          <p className="text-ink-500 text-sm mt-1">Try different cities or clear filters</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rides.map(ride => (
          <RideCard key={ride.id} ride={ride} onBook={setBooking} />
        ))}
      </div>

      {booking && <BookingModal ride={booking} onClose={() => setBooking(null)} />}
    </div>
  );
};

export default RideSharing;

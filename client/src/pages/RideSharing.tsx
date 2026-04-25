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

            {/* ✅ FIXED HERE */}
            {ride.driver.verified && (
              <span title="Verified">
              <Shield size={12} className="text-jade-400" />
            </span>
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

    <button onClick={() => onBook(ride)} className="btn-primary w-full text-sm">
      Request to Join
    </button>
  </div>
);

const BookingModal: React.FC<{ ride: Ride; onClose: () => void }> = ({ ride, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleBook = async () => {
    if (!name.trim() || !contact.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await bookRide({
        rideId: ride.id,
        passengerName: name,
        passengerContact: contact,
      });
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
      <div className="relative bg-ink-800 border border-ink-600 rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl mb-4">Book Ride</h3>

        <input
          className="input-field mb-3"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="input-field mb-3"
          placeholder="Contact number"
          value={contact}
          onChange={e => setContact(e.target.value)}
        />

        {error && <ErrorMessage message={error} />}

        <button onClick={handleBook} className="btn-primary w-full">
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

const RideSharing: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Ride | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data } = await getRides();
        setRides(data);
      } catch {
        setError('Failed to load rides');
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <div>
      <SectionHeader title="Ride Sharing" subtitle="Find rides easily" icon={<Users />} />

      {loading && <LoadingSpinner text="Loading rides..." />}
      {error && <ErrorMessage message={error} />}

      <div className="grid gap-4">
        {rides.map(ride => (
          <RideCard key={ride.id} ride={ride} onBook={setBooking} />
        ))}
      </div>

      {booking && <BookingModal ride={booking} onClose={() => setBooking(null)} />}
    </div>
  );
};

export default RideSharing;
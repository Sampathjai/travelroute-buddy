import React, { useState, useEffect } from 'react';
import { Thermometer, Wind, Droplets, Eye, Search, RefreshCw } from 'lucide-react';
import { getWeather } from '../api';
import { WeatherData } from '../types';
import { LoadingSpinner, ErrorMessage, SectionHeader } from '../components/UI';

const QUICK_CITIES = [
  'Chennai', 'Bangalore', 'Mumbai', 'Ooty', 'Munnar',
  'Coorg', 'Alleppey', 'Gokarna', 'Hampi', 'Pondicherry'
];

const getWeatherBg = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('sunny') || c.includes('clear'))  return 'from-amber-500/20 to-orange-500/10';
  if (c.includes('cloud') || c.includes('overcast')) return 'from-ink-600/40 to-ink-700/20';
  if (c.includes('rain') || c.includes('drizzle'))  return 'from-sky-500/20 to-blue-500/10';
  if (c.includes('fog') || c.includes('mist'))       return 'from-ink-500/30 to-ink-600/15';
  if (c.includes('hot') || c.includes('warm'))       return 'from-red-500/20 to-orange-500/10';
  return 'from-jade-500/15 to-sky-500/10';
};

const WeatherCard: React.FC<{ data: WeatherData }> = ({ data }) => {
  const bg = getWeatherBg(data.condition);

  return (
    <div className={`card bg-gradient-to-br ${bg} border-ink-600 animate-fade-up`}>
      {/* Top */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-3xl text-ink-100">{data.city}</h3>
          <p className="text-ink-400 text-sm mt-0.5">{data.condition}</p>
          {data.source === 'mock' && (
            <span className="text-xs text-ink-500 mt-1 block">⚠️ Mock data — add OpenWeather API key for live</span>
          )}
        </div>
        <div className="text-6xl leading-none">{typeof data.icon === 'string' && data.icon.startsWith('http')
          ? <img src={data.icon} alt="" className="w-16 h-16" />
          : data.icon
        }</div>
      </div>

      {/* Temp */}
      <div className="flex items-end gap-4 mb-6">
        <div>
          <span className="font-display text-7xl text-ink-100">{data.temp}</span>
          <span className="text-3xl text-ink-400 ml-1">°C</span>
        </div>
        <div className="pb-2">
          <p className="text-ink-500 text-sm">Feels like</p>
          <p className="text-ink-300 text-xl font-display">{data.feels_like}°C</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Droplets size={16} />, label: 'Humidity', value: `${data.humidity}%`, color: 'text-sky-400' },
          { icon: <Wind size={16} />,     label: 'Wind',     value: `${data.wind} km/h`, color: 'text-jade-400' },
          { icon: <Thermometer size={16} />, label: 'Feels', value: `${data.feels_like}°`, color: 'text-amber-400' },
        ].map(({ icon, label, value, color }, i) => (
          <div key={i} className="bg-ink-800/60 backdrop-blur rounded-xl p-3 text-center">
            <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
            <p className="text-ink-200 font-medium text-sm">{value}</p>
            <p className="text-ink-500 text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeatherInfo: React.FC = () => {
  const [city, setCity]                       = useState('Chennai');
  const [inputCity, setInputCity]             = useState('Chennai');
  const [weather, setWeather]                 = useState<WeatherData | null>(null);
  const [multiWeather, setMultiWeather]       = useState<WeatherData[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [multiLoading, setMultiLoading]       = useState(false);
  const [error, setError]                     = useState('');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getWeather(cityName);
      setWeather(data);
      setCity(cityName);
    } catch {
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMulti = async () => {
    setMultiLoading(true);
    try {
      const results = await Promise.allSettled(
        QUICK_CITIES.slice(0, 6).map(c => getWeather(c))
      );
      const data = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map(r => r.value.data);
      setMultiWeather(data);
    } finally {
      setMultiLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Chennai');
    fetchMulti();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="Weather Info"
        subtitle="Check real-time weather before you travel."
        icon={<Eye size={22} />}
      />

      {/* Search */}
      <div className="card">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
            <input
              list="weather-cities"
              className="input-field pl-10"
              placeholder="Enter city name…"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather(inputCity)}
            />
            <datalist id="weather-cities">
              {QUICK_CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <button
            onClick={() => fetchWeather(inputCity)}
            disabled={loading}
            className="btn-primary px-5"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>

        {/* Quick cities */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_CITIES.map(c => (
            <button
              key={c}
              onClick={() => { setInputCity(c); fetchWeather(c); }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                city === c
                  ? 'bg-amber-500 text-ink-900 font-medium'
                  : 'bg-ink-700 text-ink-400 hover:bg-ink-600 hover:text-ink-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Main weather card */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          {loading && <LoadingSpinner text="Fetching weather…" />}
          {weather && !loading && <WeatherCard data={weather} />}
        </div>

        {/* Multi-city panel */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-ink-300 text-sm font-medium uppercase tracking-wider">Quick Glance</h3>
          {multiLoading && <LoadingSpinner size={18} text="Loading…" />}
          {multiWeather.map((w, i) => (
            <button
              key={i}
              onClick={() => { setInputCity(w.city); fetchWeather(w.city); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                city === w.city
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-ink-700 bg-ink-800 hover:border-ink-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeof w.icon === 'string' && w.icon.startsWith('http')
                  ? '🌤️' : w.icon}</span>
                <div>
                  <p className="text-ink-200 text-sm font-medium">{w.city}</p>
                  <p className="text-ink-500 text-xs">{w.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-ink-100 font-display text-lg">{w.temp}°</p>
                <p className="text-ink-500 text-xs">{w.humidity}% RH</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;

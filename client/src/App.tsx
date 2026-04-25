import React, { useState } from 'react';
import { Route, Calculator, MapPin, Cloud, Users, Menu, X, Compass } from 'lucide-react';
import { TabId } from './types';
import RoutePlanner from './pages/RoutePlanner';
import CostEstimator from './pages/CostEstimator';
import Destinations from './pages/Destinations';
import WeatherInfo from './pages/WeatherInfo';
import RideSharing from './pages/RideSharing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const TABS: Tab[] = [
  { id: 'planner',      label: 'Route Planner',      shortLabel: 'Planner',      icon: <Route size={18} /> },
  { id: 'cost',         label: 'Cost Estimator',      shortLabel: 'Cost',         icon: <Calculator size={18} /> },
  { id: 'destinations', label: 'Destinations',         shortLabel: 'Places',       icon: <MapPin size={18} /> },
  { id: 'weather',      label: 'Weather Info',         shortLabel: 'Weather',      icon: <Cloud size={18} /> },
  { id: 'rides',        label: 'Ride Sharing',         shortLabel: 'Rides',        icon: <Users size={18} /> },
];

const PAGE_MAP: Record<TabId, React.ReactNode> = {
  planner:      <RoutePlanner />,
  cost:         <CostEstimator />,
  destinations: <Destinations />,
  weather:      <WeatherInfo />,
  rides:        <RideSharing />,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('planner');
  const [menuOpen, setMenuOpen]   = useState(false);

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col noise-bg">
      {/* Header */}
      <header className="glass border-b border-ink-700 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Compass size={20} className="text-ink-900" />
            </div>
            <div>
              <h1 className="font-display text-lg text-ink-100 leading-tight">TravelRoute</h1>
              <p className="text-xs text-amber-500 font-medium leading-tight tracking-wide">BUDDY</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-ink-900 shadow-md shadow-amber-500/25'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl bg-ink-700 hover:bg-ink-600 text-ink-300 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-ink-700 px-4 py-3 space-y-1 animate-fade-up">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-ink-900'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-ink-700 flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-all ${
              activeTab === tab.id
                ? 'text-amber-400'
                : 'text-ink-500 hover:text-ink-300'
            }`}
          >
            <span className={`transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className={`font-medium ${activeTab === tab.id ? 'text-amber-400' : ''}`}>
              {tab.shortLabel}
            </span>
          </button>
        ))}
      </nav>

      {/* Hero banner on home */}
      {activeTab === 'planner' && (
        <div className="relative overflow-hidden bg-gradient-to-r from-ink-800 via-ink-800 to-ink-900 border-b border-ink-700">
          <div className="absolute inset-0 bg-hero-pattern opacity-100" />
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-amber-500/5 to-transparent" />
          <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
            <p className="text-amber-500 text-xs font-medium uppercase tracking-widest mb-2">Your travel companion</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink-100 mb-2">
              Plan Your Perfect <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-ink-400 text-sm max-w-xl">
              Calculate routes, estimate costs, discover destinations, check weather, and share rides — all in one place.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 lg:pb-8">
        <div key={activeTab} className="animate-fade-up h-full">
          {PAGE_MAP[activeTab]}
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden lg:block border-t border-ink-800 px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between text-xs text-ink-600">
          <span>TravelRoute Buddy — Full-Stack Demo</span>
          <span>React · TypeScript · Express · MongoDB · Mapbox</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

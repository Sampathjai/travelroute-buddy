import React, { useState } from 'react';
import { IndianRupee, Fuel, Utensils, BedDouble, Sparkles, Calculator, Users, Calendar, Gauge } from 'lucide-react';
import { getCostEstimate } from '../api';
import { CostBreakdown } from '../types';
import { LoadingSpinner, ErrorMessage, SectionHeader } from '../components/UI';

type Accommodation = 'budget' | 'standard' | 'luxury';

const ACCOMMODATION_INFO: Record<Accommodation, { label: string; emoji: string; desc: string }> = {
  budget:   { label: 'Budget',   emoji: '🏕️', desc: '₹800–1200/night' },
  standard: { label: 'Standard', emoji: '🏨', desc: '₹2000–3500/night' },
  luxury:   { label: 'Luxury',   emoji: '🏰', desc: '₹5000+/night' },
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  const segments = data.map(d => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start };
  });

  const describeArc = (start: number, end: number, r = 60) => {
    const s = start * 2 * Math.PI - Math.PI / 2;
    const e = end * 2 * Math.PI - Math.PI / 2;
    const x1 = 80 + r * Math.cos(s), y1 = 80 + r * Math.sin(s);
    const x2 = 80 + r * Math.cos(e), y2 = 80 + r * Math.sin(e);
    const large = end - start > 0.5 ? 1 : 0;
    return `M 80 80 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-32 h-32 flex-shrink-0">
        {segments.map((s, i) => (
          <path key={i} d={describeArc(s.start, s.start + s.pct)} fill={s.color} opacity={0.9} />
        ))}
        <circle cx="80" cy="80" r="35" fill="#161B22" />
        <text x="80" y="77" textAnchor="middle" fill="#C9D1D9" fontSize="10" fontFamily="DM Sans">Total</text>
        <text x="80" y="90" textAnchor="middle" fill="#FBBF24" fontSize="9" fontFamily="JetBrains Mono">
          ₹{fmt(total)}
        </text>
      </svg>
      <div className="space-y-2 flex-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-ink-400 text-sm">{s.label}</span>
            </div>
            <span className="text-ink-200 text-sm font-mono">₹{fmt(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CostEstimator: React.FC = () => {
  const [distance, setDistance]         = useState(300);
  const [fuelEfficiency, setFuelEff]    = useState(15);
  const [fuelPrice, setFuelPrice]       = useState(102);
  const [days, setDays]                 = useState(2);
  const [travelers, setTravelers]       = useState(2);
  const [accommodation, setAccomm]      = useState<Accommodation>('standard');
  const [result, setResult]             = useState<CostBreakdown | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getCostEstimate({ distance, fuelEfficiency, fuelPrice, days, travelers, accommodation });
      setResult(data);
    } catch {
      setError('Failed to calculate costs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { label: 'Fuel',          value: result.breakdown.fuel,          color: '#FBBF24' },
    { label: 'Accommodation', value: result.breakdown.accommodation,  color: '#38BDF8' },
    { label: 'Food',          value: result.breakdown.food,           color: '#34D399' },
    { label: 'Miscellaneous', value: result.breakdown.miscellaneous,  color: '#F87171' },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SectionHeader
        title="Cost Estimator"
        subtitle="Calculate your total trip budget including fuel, stay, and food."
        icon={<Calculator size={22} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="card space-y-5">
          <h3 className="text-ink-200 font-medium text-sm uppercase tracking-wider">Trip Details</h3>

          {/* Distance */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-ink-400 text-sm flex items-center gap-1.5">
                <Gauge size={14} /> Distance (km)
              </label>
              <span className="text-amber-400 font-mono text-sm">{distance} km</span>
            </div>
            <input type="range" min="50" max="3000" step="50" value={distance}
              onChange={e => setDistance(+e.target.value)}
              className="w-full accent-amber-500" />
            <div className="flex justify-between text-xs text-ink-500 mt-1"><span>50</span><span>3000 km</span></div>
          </div>

          {/* Fuel Efficiency */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-ink-400 text-sm flex items-center gap-1.5">
                <Fuel size={14} /> Fuel Efficiency
              </label>
              <span className="text-amber-400 font-mono text-sm">{fuelEfficiency} km/L</span>
            </div>
            <input type="range" min="8" max="30" step="1" value={fuelEfficiency}
              onChange={e => setFuelEff(+e.target.value)}
              className="w-full accent-amber-500" />
            <div className="flex justify-between text-xs text-ink-500 mt-1"><span>8</span><span>30 km/L</span></div>
          </div>

          {/* Fuel Price */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-ink-400 text-sm flex items-center gap-1.5">
                <IndianRupee size={14} /> Fuel Price
              </label>
              <span className="text-amber-400 font-mono text-sm">₹{fuelPrice}/L</span>
            </div>
            <input type="range" min="80" max="130" step="1" value={fuelPrice}
              onChange={e => setFuelPrice(+e.target.value)}
              className="w-full accent-amber-500" />
            <div className="flex justify-between text-xs text-ink-500 mt-1"><span>₹80</span><span>₹130</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Days */}
            <div>
              <label className="text-ink-400 text-sm flex items-center gap-1.5 mb-2">
                <Calendar size={14} /> Days
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setDays(d => Math.max(1, d - 1))} className="btn-secondary px-3 py-2 text-sm">−</button>
                <span className="text-ink-100 font-mono w-8 text-center">{days}</span>
                <button onClick={() => setDays(d => Math.min(30, d + 1))} className="btn-secondary px-3 py-2 text-sm">+</button>
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="text-ink-400 text-sm flex items-center gap-1.5 mb-2">
                <Users size={14} /> Travelers
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setTravelers(t => Math.max(1, t - 1))} className="btn-secondary px-3 py-2 text-sm">−</button>
                <span className="text-ink-100 font-mono w-8 text-center">{travelers}</span>
                <button onClick={() => setTravelers(t => Math.min(10, t + 1))} className="btn-secondary px-3 py-2 text-sm">+</button>
              </div>
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <label className="text-ink-400 text-sm flex items-center gap-1.5 mb-2">
              <BedDouble size={14} /> Accommodation Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ACCOMMODATION_INFO) as Accommodation[]).map(type => (
                <button
                  key={type}
                  onClick={() => setAccomm(type)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    accommodation === type
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-ink-600 bg-ink-700/50 text-ink-400 hover:border-ink-500'
                  }`}
                >
                  <div className="text-xl mb-1">{ACCOMMODATION_INFO[type].emoji}</div>
                  <div className="text-xs font-medium">{ACCOMMODATION_INFO[type].label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{ACCOMMODATION_INFO[type].desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? '⟳ Calculating…' : <><Sparkles size={16} /> Estimate Cost</>}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-5">
          {loading && <LoadingSpinner text="Crunching numbers…" />}

          {!result && !loading && (
            <div className="card h-full flex flex-col items-center justify-center text-center py-16">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-ink-200 font-display text-lg mb-2">Ready to Estimate</h3>
              <p className="text-ink-400 text-sm">Configure your trip details and hit Estimate Cost.</p>
            </div>
          )}

          {result && (
            <>
              {/* Total highlight */}
              <div className="card border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent">
                <div className="text-center">
                  <p className="text-ink-400 text-sm mb-1">Total Trip Cost</p>
                  <p className="text-5xl font-display text-gradient mb-1">₹{fmt(result.total)}</p>
                  <p className="text-ink-400 text-sm">
                    ₹{fmt(result.perPerson)} <span className="text-ink-500">per person</span>
                  </p>
                </div>
              </div>

              {/* Pie chart */}
              <div className="card">
                <h3 className="text-ink-300 text-sm font-medium mb-4">Cost Breakdown</h3>
                <PieChart data={chartData} />
              </div>

              {/* Line items */}
              <div className="card space-y-3">
                {[
                  { icon: <Fuel size={16} />, label: 'Fuel', value: result.breakdown.fuel, color: 'text-amber-400' },
                  { icon: <BedDouble size={16} />, label: `Accommodation (${days}N)`, value: result.breakdown.accommodation, color: 'text-sky-400' },
                  { icon: <Utensils size={16} />, label: `Food (${travelers}p × ${days}d)`, value: result.breakdown.food, color: 'text-jade-400' },
                  { icon: <Sparkles size={16} />, label: 'Misc & Tolls (15%)', value: result.breakdown.miscellaneous, color: 'text-coral-400' },
                ].map(({ icon, label, value, color }, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-ink-700 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className={color}>{icon}</span>
                      <span className="text-ink-300 text-sm">{label}</span>
                    </div>
                    <span className="text-ink-100 font-mono text-sm">₹{fmt(value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;

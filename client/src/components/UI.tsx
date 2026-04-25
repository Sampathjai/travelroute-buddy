import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

// ── Loading Spinner ─────────────────────────────────────────────
export const LoadingSpinner: React.FC<{ size?: number; text?: string }> = ({
  size = 24,
  text,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12">
    <Loader2 size={size} className="animate-spin text-amber-500" />
    {text && <p className="text-ink-400 text-sm">{text}</p>}
  </div>
);

// ── Error Message ───────────────────────────────────────────────
export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-3 bg-coral-500/10 border border-coral-500/30 rounded-xl p-4 text-coral-400">
    <AlertCircle size={18} className="flex-shrink-0" />
    <p className="text-sm">{message}</p>
  </div>
);

// ── Badge ───────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'jade' | 'sky' | 'coral' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants = {
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    jade:  'bg-jade-500/15 text-jade-400 border border-jade-500/30',
    sky:   'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    coral: 'bg-coral-500/15 text-coral-400 border border-coral-500/30',
    default: 'bg-ink-700 text-ink-300 border border-ink-600',
  };
  return (
    <span className={`badge ${variants[variant]}`}>{children}</span>
  );
};

// ── Stat Row ────────────────────────────────────────────────────
export const StatRow: React.FC<{ label: string; value: string | number; unit?: string }> = ({
  label, value, unit,
}) => (
  <div className="flex justify-between items-center py-2.5 border-b border-ink-700 last:border-0">
    <span className="text-ink-400 text-sm">{label}</span>
    <span className="text-ink-100 font-medium font-mono">
      {value}{unit && <span className="text-ink-400 text-xs ml-1">{unit}</span>}
    </span>
  </div>
);

// ── Section Header ──────────────────────────────────────────────
export const SectionHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({
  title, subtitle, icon,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      {icon && <div className="text-amber-500">{icon}</div>}
      <h2 className="section-title">{title}</h2>
    </div>
    {subtitle && <p className="section-subtitle pl-0">{subtitle}</p>}
  </div>
);

// ── Empty State ─────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: string; title: string; subtitle: string }> = ({
  icon, title, subtitle,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-ink-200 font-display text-lg mb-2">{title}</h3>
    <p className="text-ink-400 text-sm max-w-xs">{subtitle}</p>
  </div>
);

// ── Info Card ───────────────────────────────────────────────────
export const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}> = ({ icon, label, value, sub, accent }) => (
  <div className={`card flex items-center gap-4 ${accent ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
    <div className={`p-3 rounded-xl ${accent ? 'bg-amber-500/20 text-amber-400' : 'bg-ink-700 text-ink-300'}`}>
      {icon}
    </div>
    <div>
      <p className="text-ink-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`font-display text-xl ${accent ? 'text-amber-400' : 'text-ink-100'}`}>{value}</p>
      {sub && <p className="text-ink-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

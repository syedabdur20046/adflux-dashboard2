import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start * 100) / 100);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const icons = { '$': '💰', '%': '📊', 'x': '🚀', '': '📡' };

export default function KPICard({ kpi, index }) {
  const count = useCounter(kpi.value);
  const sparkData = kpi.sparkline.map(v => ({ v }));
  const isPositive = kpi.change > 0;

  const formatValue = (v) => {
    if (kpi.prefix === '$') {
      if (v >= 1000000) return `${(v/1000000).toFixed(2)}M`;
      if (v >= 1000) return `${(v/1000).toFixed(0)}K`;
      return v.toFixed(0);
    }
    if (kpi.suffix === '%') return v.toFixed(2);
    if (kpi.suffix === 'x') return v.toFixed(2);
    return Math.round(v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl p-5 overflow-hidden cursor-pointer"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', backdropFilter: 'blur(20px)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}, transparent)` }} />
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: kpi.color }} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{kpi.label}</p>
          <div className="flex items-baseline gap-1">
            {kpi.prefix === '$' && <span className="text-xl" style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif' }}>$</span>}
            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif' }}>{formatValue(count)}</span>
            {kpi.suffix && <span className="text-lg" style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif' }}>{kpi.suffix}</span>}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
          {icons[kpi.prefix] || icons[kpi.suffix] || '📡'}
        </div>
      </div>

      <div className="h-10 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isPositive ? '#4ade80' : '#f87171' }}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isPositive ? '+' : ''}{kpi.change}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs prev period</span>
      </div>
    </motion.div>
  );
}

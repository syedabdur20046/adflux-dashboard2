import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import TrafficChart from './components/TrafficChart';
import CampaignPerformance from './components/CampaignPerformance';
import CampaignTable from './components/CampaignTable';
import EngagementChart from './components/EngagementChart';
import AIInsights from './components/AIInsights';
import ActivityFeed from './components/ActivityFeed';
import CampaignsPage from './pages/CampaignsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SocialPage from './pages/SocialPage';
import AdsPage from './pages/AdsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { kpis } from './data/mockData';
import { Bot, Calendar, X, Send, Download, CheckCircle } from 'lucide-react';

const DATE_RANGES = ['Today', 'Last 7d', 'Last 30d', 'Last 90d', 'Custom'];

// Map label → kpis/revenueData key
const dateKey = { 'Today': 'today', 'Last 7d': '7d', 'Last 30d': '30d', 'Last 90d': '90d', 'Custom': '12M' };

/* ── Export Modal ── */
function ExportModal({ onClose }) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);
  const [format, setFormat] = useState('PDF');

  const doExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="rounded-2xl p-6 w-full max-w-sm relative" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--sidebar-bg)', border: '1px solid rgba(168,85,247,0.25)', backdropFilter: 'blur(20px)' }}>
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl" style={{ background: 'linear-gradient(90deg,transparent,#a855f7,#3b82f6,transparent)' }} />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Export Analytics</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
        </div>
        {done ? (
          <div className="text-center py-4">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="font-medium" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Export Complete!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your {format} report has been downloaded.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 rounded-xl text-sm text-purple-300" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>Close</button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Choose format and export your dashboard data.</p>
            <div className="flex gap-2 mb-4">
              {['PDF', 'Excel', 'CSV'].map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className="flex-1 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: format === f ? 'linear-gradient(135deg,rgba(168,85,247,0.3),rgba(59,130,246,0.2))' : 'var(--input-bg)',
                    color: format === f ? '#c084fc' : 'var(--text-muted)',
                    border: format === f ? '1px solid rgba(168,85,247,0.3)' : '1px solid var(--card-border)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>{f}</button>
              ))}
            </div>
            <div className="space-y-2 mb-5">
              {['Revenue Analytics', 'Campaign Performance', 'Traffic Sources', 'KPI Summary'].map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked style={{ accentColor: '#a855f7' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>{s}</span>
                </label>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={doExport} disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-white font-medium"
              style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)', opacity: exporting ? 0.7 : 1 }}>
              {exporting
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Download size={14} /></motion.div>
                : <Download size={14} />}
              {exporting ? 'Exporting...' : `Export as ${format}`}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Chat Modal ── */
function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm AdFlux AI. Ask me about your campaigns, ROAS, budget, or marketing strategy!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const aiResponses = {
    roas: 'Your average ROAS is 4.72x. TikTok leads at 6.8x! I recommend shifting more budget there.',
    campaign: 'You have 5 campaigns: 3 active, 1 paused, 1 completed. "TikTok Viral Push" is top performer.',
    budget: "Total budget: $67K. You've spent $45K (67%). Instagram is 90% spent — consider a top-up.",
    instagram: 'Instagram is performing well! CTR up 24%. Your 22–30 age group converts best there.',
    tiktok: 'TikTok is your star — 6.8x ROAS, 8.2% engagement rate. Scale it up!',
    revenue: 'Total ad revenue: $1.28M this year, up 18.4% vs last year. December is your peak month.',
    help: 'I can help with: campaign analysis, budget advice, ROAS optimization, audience targeting, and platform comparisons!',
    default: 'Based on your current data, TikTok and Instagram are your top performers. Conversion rate at 6.84% is above industry average!',
  };

  const send = () => {
    if (!input.trim()) return;
    const msg = input;
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      const key = Object.keys(aiResponses).find(k => msg.toLowerCase().includes(k)) || 'default';
      setMessages(p => [...p, { role: 'ai', text: aiResponses[key] }]);
      setLoading(false);
    }, 900);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end p-0 sm:p-6"
      style={{ pointerEvents: 'none' }}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="w-full sm:w-96 rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col relative"
        style={{ height: 480, background: 'var(--sidebar-bg)', border: '1px solid rgba(168,85,247,0.25)', backdropFilter: 'blur(20px)', pointerEvents: 'all' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#a855f7,#3b82f6,transparent)' }} />
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)' }}>
              <Bot size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>AdFlux AI</p>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] px-3 py-2 rounded-2xl text-sm"
                style={{
                  background: m.role === 'user' ? 'linear-gradient(135deg,rgba(168,85,247,0.35),rgba(59,130,246,0.25))' : 'var(--input-bg)',
                  border: m.role === 'user' ? '1px solid rgba(168,85,247,0.3)' : '1px solid var(--card-border)',
                  color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif',
                }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                      animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--divider)' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif' }} />
          <motion.button whileTap={{ scale: 0.9 }} onClick={send}
            className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)' }}>
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Dashboard Home ── */
function DashboardHome({ dateRange, setDateRange }) {
  const key = dateKey[dateRange] || '12M';
  const currentKpis = kpis[key] || kpis['12M'];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              Marketing{' '}
              <span style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dashboard
              </span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Showing data for: <span style={{ color: '#a855f7' }}>{dateRange}</span>
            </p>
          </div>

          {/* Date Range Picker */}
          <div className="flex gap-1 p-1 rounded-xl overflow-x-auto flex-shrink-0"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            {DATE_RANGES.map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1"
                style={{
                  background: dateRange === r ? 'linear-gradient(135deg,rgba(168,85,247,0.35),rgba(59,130,246,0.2))' : 'transparent',
                  color: dateRange === r ? '#c084fc' : 'var(--text-muted)',
                  border: dateRange === r ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: dateRange === r ? 600 : 400,
                }}>
                {r === 'Custom' && <Calendar size={10} />} {r}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards — re-render on dateRange change with key */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentKpis.map((kpi, i) => (
          <KPICard key={`${dateRange}-${kpi.label}`} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart dateRange={dateRange} />
        </div>
        <TrafficChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <CampaignPerformance />
        <EngagementChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CampaignTable />
        <AIInsights />
        <ActivityFeed />
      </div>
    </>
  );
}

/* ── Page map ── */
const pages = {
  campaigns: CampaignsPage,
  analytics: AnalyticsPage,
  social: SocialPage,
  ads: AdsPage,
  ai: AIInsightsPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

/* ── Root App ── */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30d');
  const [activePage, setActivePage] = useState('dashboard');
  const [showExport, setShowExport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Apply/remove light-mode class on <html> whenever darkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
    }
  }, [darkMode]);

  const PageComp = pages[activePage];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', transition: 'background 0.3s ease' }}>
      {/* Ambient orbs — only in dark mode */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
          <div className="absolute top-1/3 -right-48 w-96 h-96 rounded-full blur-3xl" style={{ opacity: 0.06, background: 'radial-gradient(circle,#3b82f6,transparent)' }} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ opacity: 0.05, background: 'radial-gradient(circle,#06b6d4,transparent)' }} />
        </div>
      )}

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} activePage={activePage} setActivePage={setActivePage} darkMode={darkMode} />

      <div className="relative z-10 transition-all duration-300" style={{ marginLeft: sidebarOpen ? '240px' : '72px' }}>
        <Navbar
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          darkMode={darkMode} setDarkMode={setDarkMode}
          setActivePage={setActivePage}
          onExport={() => setShowExport(true)}
          onAIChat={() => setShowChat(true)}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        />

        <main className="pt-20 px-4 pb-8 lg:px-6">
          <AnimatePresence mode="wait">
            <motion.div key={activePage}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}>
              {activePage === 'dashboard'
                ? <DashboardHome dateRange={dateRange} setDateRange={setDateRange} />
                : PageComp ? <PageComp /> : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-6 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--divider)', color: 'var(--text-muted)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>AdFlux AI v2.4.1 — © 2025</span>
            <span>Data refreshes every 30s</span>
          </div>
        </main>
      </div>

      {/* Floating AI Chat button */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setShowChat(p => !p)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl z-40"
        style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)', boxShadow: '0 0 30px rgba(168,85,247,0.4)' }}>
        {showChat ? <X size={20} /> : <Bot size={22} />}
      </motion.button>

      <AnimatePresence>
        {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </div>
  );
}

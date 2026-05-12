import { RefreshCw } from 'lucide-react'

export default function Header({ lastUpdate, loading, onRefresh, botStatus }) {
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  const isRunning = botStatus === 'running'

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #A08020)', color: '#080808' }}>
            CD
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white">CRYPTODESK</p>
            <p className="text-gold" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>TRADING TERMINAL</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-red-500'}`}
              style={isRunning ? { boxShadow: '0 0 6px #10b981' } : {}} />
            <span className="text-xs font-semibold" style={{ color: isRunning ? '#10b981' : '#ef4444' }}>
              {isRunning ? 'LIVE' : 'OFF'}
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: '#444' }}>{timeStr}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#555', background: '#161616' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  )
}

import { RefreshCw } from 'lucide-react'
import Logo from './Logo'

export default function Header({ lastUpdate, loading, onRefresh, botStatus }) {
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  const isRunning = botStatus === 'running'

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: '#ffffff', borderColor: '#eaedff' }}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <Logo size={34} />
          <div>
            <p className="text-xs font-bold tracking-[0.2em]" style={{ color: '#0a0a0a' }}>BOTVAULT</p>
            <p style={{ fontSize: '9px', letterSpacing: '0.15em', color: '#1a56ff' }}>TRADING TERMINAL</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-red-400'}`}
              style={isRunning ? { boxShadow: '0 0 6px #10b981' } : {}} />
            <span className="text-xs font-semibold" style={{ color: isRunning ? '#10b981' : '#ef4444' }}>
              {isRunning ? 'LIVE' : 'OFF'}
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: '#b0b8d0' }}>{timeStr}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#a0a8c0', background: '#f5f7ff' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  )
}

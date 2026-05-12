import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export default function Header({ lastUpdate, loading, onRefresh, botStatus }) {
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
            C
          </div>
          <span className="text-sm font-bold tracking-widest text-white">CRYPTODESK</span>
        </div>

        <div className="flex items-center gap-3">
          {botStatus === 'running' ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BOT ON
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              BOT OFF
            </span>
          )}
          <span className="text-xs text-slate-500">{timeStr}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  )
}

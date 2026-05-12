import { useEffect, useState } from 'react'
import { Activity, Clock, TrendingUp, Shield, Zap } from 'lucide-react'

const BOT_API = import.meta.env.VITE_BOT_API_URL || null

export default function BotPage({ portfolio }) {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    if (!BOT_API) return
    fetch(`${BOT_API}/config`).then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  const isRunning = portfolio?.botStatus === 'running'

  const StatRow = ({ icon: Icon, label, value, color = 'text-white' }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/60 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon size={15} className="text-slate-500" />
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )

  return (
    <div className="space-y-5">

      {/* Status */}
      <div className={`card border ${isRunning ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Stato Bot</p>
            <p className={`text-2xl font-bold ${isRunning ? 'text-emerald-400' : 'text-red-400'}`}>
              {isRunning ? 'ATTIVO' : 'OFFLINE'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Gira su Railway 24/7</p>
          </div>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center
            ${isRunning ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <Activity size={28} className={isRunning ? 'text-emerald-400' : 'text-red-400'} />
          </div>
        </div>
      </div>

      {/* Configurazione */}
      <div className="card">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Configurazione</p>
        <StatRow icon={Zap}       label="Scan interval"   value={config ? `${config.scanInterval}s` : '60s'} color="text-purple-400" />
        <StatRow icon={TrendingUp} label="Take Profit 1"  value={`+${((config?.takeProft1 || 0.04) * 100).toFixed(0)}%`} color="text-emerald-400" />
        <StatRow icon={TrendingUp} label="Take Profit 2"  value={`+${((config?.takeProfit2 || 0.08) * 100).toFixed(0)}%`} color="text-emerald-400" />
        <StatRow icon={Shield}    label="Stop Loss"       value={`-${((config?.stopLoss || 0.05) * 100).toFixed(0)}%`} color="text-red-400" />
        <StatRow icon={Clock}     label="Coin monitorata" value={config?.pairs?.join(', ') || 'SOL'} color="text-cyan-400" />
      </div>

      {/* Strategia */}
      <div className="card space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategia attiva</p>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex gap-2">
            <span className="text-purple-400">•</span>
            <span>Entra solo se <b className="text-white">RSI ipervenduto</b> + almeno 1 altra condizione</span>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-400">•</span>
            <span>Vende <b className="text-white">50% a +4%</b> e il resto a <b className="text-white">+8%</b></span>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-400">•</span>
            <span>Stop loss automatico a <b className="text-white">-5%</b> per proteggere il capitale</span>
          </div>
          <div className="flex gap-2">
            <span className="text-purple-400">•</span>
            <span>Capitale concentrato su <b className="text-white">SOL/EUR</b> al 100%</span>
          </div>
        </div>
      </div>

      {/* Portfolio summary */}
      {portfolio && (
        <div className="card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Riepilogo</p>
          <StatRow icon={Activity} label="Totale portafoglio" value={`€${portfolio.total?.toFixed(2)}`} color="text-white" />
          <StatRow icon={TrendingUp} label="P&L totale"
            value={`${portfolio.pnl >= 0 ? '+' : ''}€${portfolio.pnl?.toFixed(2)} (${portfolio.pnl >= 0 ? '+' : ''}${portfolio.pnlPct?.toFixed(2)}%)`}
            color={portfolio.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
          <StatRow icon={Shield} label="EUR liberi" value={`€${portfolio.eurFree?.toFixed(2)}`} color="text-cyan-400" />
        </div>
      )}
    </div>
  )
}

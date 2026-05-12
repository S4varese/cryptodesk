import { useEffect, useState } from 'react'
import { Activity, Clock, TrendingUp, Shield, Zap, Circle } from 'lucide-react'

const BOT_API = import.meta.env.VITE_BOT_API_URL || null

export default function BotPage({ portfolio }) {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    if (!BOT_API) return
    fetch(`${BOT_API}/config`).then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  const isRunning = portfolio?.botStatus === 'running'

  const Row = ({ label, value, color }) => (
    <div className="flex items-center justify-between py-3 divider last:border-0">
      <span className="text-sm" style={{ color: '#666' }}>{label}</span>
      <span className="text-sm font-bold" style={{ color: color || '#fff' }}>{value}</span>
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Status */}
      <div className="card" style={{
        borderColor: isRunning ? 'rgba(212,175,55,0.3)' : '#2a2a2a',
        background: isRunning ? 'linear-gradient(135deg, #161410, #111)' : '#111'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="label mb-2">Stato Bot</p>
            <p className="text-3xl font-bold" style={{ color: isRunning ? '#D4AF37' : '#ef4444' }}>
              {isRunning ? 'ATTIVO' : 'OFFLINE'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#444' }}>Railway · 24/7</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: isRunning ? 'rgba(212,175,55,0.1)' : 'rgba(239,68,68,0.1)' }}>
            <Activity size={26} style={{ color: isRunning ? '#D4AF37' : '#ef4444' }} />
          </div>
        </div>
      </div>

      {/* Config */}
      <div className="card">
        <p className="label mb-1">Configurazione</p>
        <Row label="Scan interval"    value={config ? `${config.scanInterval}s` : '60s'}    color="#D4AF37" />
        <Row label="Take Profit 1"    value={`+${((config?.takeProft1 || 0.04) * 100).toFixed(0)}%`}  color="#10b981" />
        <Row label="Take Profit 2"    value={`+${((config?.takeProfit2 || 0.08) * 100).toFixed(0)}%`} color="#10b981" />
        <Row label="Stop Loss"        value={`-${((config?.stopLoss || 0.05) * 100).toFixed(0)}%`}    color="#ef4444" />
        <Row label="Coin monitorata"  value={config?.pairs?.join(', ') || 'SOL'} color="#D4AF37" />
      </div>

      {/* Strategia */}
      <div className="card space-y-3">
        <p className="label">Strategia</p>
        {[
          'Entra solo se RSI ipervenduto + 1 altra condizione',
          'Vende 50% a +4% e il resto a +8%',
          'Stop loss automatico a -5%',
          'Capitale 100% su SOL/EUR',
        ].map((s, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D4AF37', marginTop: 6 }} />
            <span className="text-sm" style={{ color: '#888' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* P&L */}
      {portfolio && (
        <div className="card">
          <p className="label mb-1">Riepilogo</p>
          <Row label="Capitale investito" value={`€${config?.budget?.toFixed(2) ?? '102.00'}`} color="#888" />
          <Row label="Portafoglio totale" value={`€${portfolio.total?.toFixed(2)}`} />
          <Row
            label="P&L totale"
            value={`${portfolio.pnl >= 0 ? '+' : ''}€${portfolio.pnl?.toFixed(2)} (${portfolio.pnl >= 0 ? '+' : ''}${portfolio.pnlPct?.toFixed(2)}%)`}
            color={portfolio.pnl >= 0 ? '#10b981' : '#ef4444'}
          />
          <Row label="EUR liberi" value={`€${portfolio.eurFree?.toFixed(2)}`} color="#D4AF37" />
        </div>
      )}
    </div>
  )
}

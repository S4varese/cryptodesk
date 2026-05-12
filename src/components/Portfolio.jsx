import { TrendingUp, TrendingDown, Euro } from 'lucide-react'

function StatCard({ label, value, sub, color = 'purple', glow = false }) {
  const colorMap = {
    purple: 'text-purple-400 border-purple-500/30',
    cyan:   'text-cyan-400 border-cyan-500/30',
    green:  'text-emerald-400 border-emerald-500/30',
    red:    'text-red-400 border-red-500/30',
    amber:  'text-amber-400 border-amber-500/30',
  }
  return (
    <div className={`card border ${colorMap[color]}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color].split(' ')[0]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Portfolio({ portfolio, prices }) {
  if (!portfolio) return null

  const { total, eurFree, pnl, pnlPct, positions } = portfolio
  const isUp = pnl >= 0

  const fmt = (n, dec = 2) =>
    new Intl.NumberFormat('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n)

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Portfolio</h2>

      {/* Total + P&L */}
      <div className="card-glow-purple">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valore Totale</p>
        <p className="text-4xl font-bold text-white">€{fmt(total)}</p>
        <div className={`flex items-center gap-1.5 mt-2 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span className="text-sm font-semibold">
            {isUp ? '+' : ''}€{fmt(pnl)} ({isUp ? '+' : ''}{fmt(pnlPct)}%)
          </span>
          <span className="text-xs text-slate-500 ml-1">vs capitale iniziale</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="EUR Liberi" value={`€${fmt(eurFree)}`} color="cyan" />
        <StatCard
          label="In Crypto"
          value={`€${fmt(total - eurFree)}`}
          sub={`${fmt((total - eurFree) / total * 100, 1)}% allocato`}
          color="purple"
        />
      </div>

      {/* Positions */}
      <div className="space-y-2">
        {Object.entries(positions).map(([coin, pos]) => {
          const currentPrice = prices?.[coin]?.price || 0
          const currentValue = pos.qty * currentPrice
          const posChange = ((currentPrice - pos.entry) / pos.entry) * 100
          const isPosPnl = posChange >= 0
          return (
            <div key={coin} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{coin}</p>
                <p className="text-xs text-slate-500">{fmt(pos.qty, 4)} @ €{fmt(pos.entry)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">€{fmt(currentValue)}</p>
                <p className={`text-xs font-semibold ${isPosPnl ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPosPnl ? '+' : ''}{fmt(posChange)}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

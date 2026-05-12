import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'

function StatCard({ label, value, sub, color = 'purple' }) {
  const colorMap = {
    purple: 'text-purple-400 border-purple-500/30',
    cyan:   'text-cyan-400 border-cyan-500/30',
    green:  'text-emerald-400 border-emerald-500/30',
    red:    'text-red-400 border-red-500/30',
  }
  return (
    <div className={`card border ${colorMap[color]}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${colorMap[color].split(' ')[0]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

const COIN_DOT = {
  SOL:  'bg-purple-400',
  LINK: 'bg-cyan-400',
  AVAX: 'bg-amber-400',
}

export default function Portfolio({ portfolio, prices, onCoinTap }) {
  if (!portfolio) return null

  const { total, eurFree, pnl, pnlPct, positions } = portfolio
  const isUp = pnl >= 0

  const fmt2 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt4 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n)

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Portfolio</h2>

      {/* Totale */}
      <div className="card-glow-purple">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valore Totale</p>
        <p className="text-4xl font-bold text-white">€{fmt2(total)}</p>
        <div className={`flex items-center gap-1.5 mt-2 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span className="text-sm font-semibold">
            {isUp ? '+' : ''}€{fmt2(pnl)} ({isUp ? '+' : ''}{fmt2(pnlPct)}%)
          </span>
          <span className="text-xs text-slate-500 ml-1">vs capitale iniziale</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="EUR Liberi" value={`€${fmt2(eurFree)}`} color="cyan" />
        <StatCard
          label="In Crypto"
          value={`€${fmt2(total - eurFree)}`}
          sub={total > 0 ? `${fmt2((total - eurFree) / total * 100)}% allocato` : ''}
          color="purple"
        />
      </div>

      {/* Posizioni tappabili */}
      {Object.entries(positions).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-600 px-1">Tocca una posizione per i dettagli</p>
          {Object.entries(positions).map(([coin, pos]) => {
            const currentPrice = prices?.[coin]?.price || pos.price || 0
            const currentValue = pos.qty * currentPrice
            const change = prices?.[coin]?.change ?? 0
            const isPosChnUp = change >= 0
            const dot = COIN_DOT[coin] || 'bg-purple-400'

            return (
              <button
                key={coin}
                onClick={() => onCoinTap?.(coin)}
                className="w-full card flex items-center justify-between hover:bg-slate-800/60 active:scale-[0.98] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot} animate-pulse`} />
                  <div>
                    <p className="text-sm font-bold text-white">{coin}</p>
                    <p className="text-xs text-slate-500">{pos.qty.toFixed(4)} · €{fmt4(currentPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">€{fmt2(currentValue)}</p>
                    <p className={`text-xs font-semibold ${isPosChnUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPosChnUp ? '+' : ''}{change.toFixed(2)}% oggi
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

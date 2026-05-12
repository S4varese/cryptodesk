import { TrendingUp, TrendingDown } from 'lucide-react'

const COIN_COLORS = {
  SOL:  { bg: 'from-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  LINK: { bg: 'from-cyan-500/20',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   dot: 'bg-cyan-400' },
  AVAX: { bg: 'from-amber-500/20',  border: 'border-amber-500/30',  text: 'text-amber-400',  dot: 'bg-amber-400' },
}

export default function LivePrices({ prices, PAIRS }) {
  if (!prices) return null

  const fmt = (n, dec = 2) =>
    new Intl.NumberFormat('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n)

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Prezzi Live</h2>
      <div className="space-y-2">
        {Object.entries(prices).map(([coin, data]) => {
          const c = COIN_COLORS[coin] || COIN_COLORS.SOL
          const isUp = data.change >= 0
          return (
            <div
              key={coin}
              className={`card bg-gradient-to-r ${c.bg} to-transparent border ${c.border} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
                <div>
                  <p className={`text-sm font-bold ${c.text}`}>{PAIRS[coin].label}</p>
                  <p className="text-xs text-slate-500">
                    H: €{fmt(data.high)} · L: €{fmt(data.low)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">€{fmt(data.price)}</p>
                <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span>{isUp ? '+' : ''}{fmt(data.change)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

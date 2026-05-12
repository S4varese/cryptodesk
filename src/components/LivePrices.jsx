import { TrendingUp, TrendingDown } from 'lucide-react'

export default function LivePrices({ prices, PAIRS }) {
  if (!prices) return null

  const fmt = (n, dec = 2) =>
    new Intl.NumberFormat('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n)

  return (
    <section className="space-y-3">
      <p className="label px-1">Prezzi Live</p>
      <div className="space-y-2">
        {Object.entries(prices).map(([coin, data]) => {
          const isUp = data.change >= 0

          return (
            <div key={coin} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(26,86,255,0.08)', color: '#1a56ff' }}>
                  {coin.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#0a0a0a' }}>{PAIRS[coin]?.label || coin}</p>
                  <p className="text-xs font-mono" style={{ color: '#b0b8d0' }}>
                    H: €{fmt(data.high)} · L: €{fmt(data.low)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold font-mono" style={{ color: '#0a0a0a' }}>€{fmt(data.price, 4)}</p>
                <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-500' : 'text-red-400'}`}>
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

import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'

export default function Portfolio({ portfolio, prices, onCoinTap }) {
  if (!portfolio) return null

  const { total, eurFree, pnl, pnlPct, positions } = portfolio
  const isUp = pnl >= 0

  const fmt2 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt4 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n)

  return (
    <section className="space-y-3">
      <p className="label px-1">Portfolio</p>

      <div className="card-hero">
        <p className="label mb-2">Valore Totale</p>
        <p className="text-4xl font-bold tracking-tight" style={{ color: '#0a0a0a' }}>€{fmt2(total)}</p>
        <div className={`flex items-center gap-1.5 mt-3 ${isUp ? 'text-emerald-500' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span className="text-sm font-bold">
            {isUp ? '+' : ''}€{fmt2(pnl)}
          </span>
          <span className="text-sm font-semibold opacity-70">
            ({isUp ? '+' : ''}{fmt2(pnlPct)}%)
          </span>
          <span className="text-xs ml-1" style={{ color: '#b0b8d0' }}>vs investimento</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="label mb-1.5">EUR Liberi</p>
          <p className="text-xl font-bold" style={{ color: '#1a56ff' }}>€{fmt2(eurFree)}</p>
        </div>
        <div className="card">
          <p className="label mb-1.5">In Crypto</p>
          <p className="text-xl font-bold" style={{ color: '#0a0a0a' }}>€{fmt2(total - eurFree)}</p>
          <p className="text-xs mt-0.5" style={{ color: '#b0b8d0' }}>
            {total > 0 ? fmt2((total - eurFree) / total * 100) : '0'}% allocato
          </p>
        </div>
      </div>

      {Object.entries(positions).length > 0 && (
        <div className="space-y-2">
          <p className="label px-1">Posizioni Aperte</p>
          {Object.entries(positions).map(([coin, pos]) => {
            const currentPrice = prices?.[coin]?.price || pos.price || 0
            const currentValue = pos.qty * currentPrice
            const change = prices?.[coin]?.change ?? 0
            const isChgUp = change >= 0

            return (
              <button
                key={coin}
                onClick={() => onCoinTap?.(coin)}
                className="w-full card flex items-center justify-between transition-all active:scale-[0.98] text-left"
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(26,86,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eaedff'}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(26,86,255,0.08)', color: '#1a56ff' }}>
                    {coin.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#0a0a0a' }}>{coin}</p>
                    <p className="text-xs font-mono" style={{ color: '#b0b8d0' }}>
                      {pos.qty.toFixed(4)} · €{fmt4(currentPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#0a0a0a' }}>€{fmt2(currentValue)}</p>
                    <p className={`text-xs font-semibold ${isChgUp ? 'text-emerald-500' : 'text-red-400'}`}>
                      {isChgUp ? '+' : ''}{change.toFixed(2)}% oggi
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: '#d0d4e8' }} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

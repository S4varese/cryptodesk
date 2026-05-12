import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { AreaChart, Area, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const BOT_API = import.meta.env.VITE_BOT_API_URL || null

const COIN_THEME = {
  SOL:  { color: '#8b5cf6', bg: 'from-purple-500/20', border: 'border-purple-500/40' },
  LINK: { color: '#06b6d4', bg: 'from-cyan-500/20',   border: 'border-cyan-500/40' },
  AVAX: { color: '#f59e0b', bg: 'from-amber-500/20',  border: 'border-amber-500/40' },
}

async function executeSell(coin) {
  if (!BOT_API) throw new Error('API non configurata')
  const res = await fetch(`${BOT_API}/sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `HTTP ${res.status}`)
  }
  return await res.json()
}

function LevelRow({ label, price, current, color }) {
  const fmt = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n)
  const diff = current > 0 ? ((price - current) / current * 100) : 0
  const reached = (color === 'red' && current <= price) || (color !== 'red' && current >= price)
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-bold ${color === 'red' ? 'text-red-400' : 'text-emerald-400'}`}>
          €{fmt(price)}
        </span>
        <span className={`ml-2 text-xs ${reached ? 'text-slate-400' : 'text-slate-600'}`}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export default function CoinDetail({ coin, pos, priceData, equityCurve, onBack }) {
  const [sellState, setSellState] = useState('idle')
  const [sellMsg, setSellMsg] = useState('')

  const theme = COIN_THEME[coin] || COIN_THEME.SOL
  const currentPrice = priceData?.price || pos?.price || 0
  const currentValue = (pos?.qty || 0) * currentPrice
  const entryPrice  = pos?.entry || null
  const pnlEur  = entryPrice ? currentValue - (pos.qty * entryPrice) : null
  const pnlPct  = entryPrice ? ((currentPrice - entryPrice) / entryPrice * 100) : null
  const isUp    = (pnlPct ?? priceData?.change ?? 0) >= 0

  const tp1 = entryPrice ? entryPrice * 1.04 : currentPrice * 1.04
  const tp2 = entryPrice ? entryPrice * 1.08 : currentPrice * 1.08
  const sl  = entryPrice ? entryPrice * 0.95 : currentPrice * 0.95

  const fmt2 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
  const fmt4 = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n)

  const handleSell = async () => {
    if (sellState === 'idle') { setSellState('confirm'); return }
    if (sellState === 'confirm') {
      setSellState('loading')
      try {
        await executeSell(coin)
        setSellMsg('Ordine inviato con successo')
        setSellState('done')
      } catch (e) {
        setSellMsg(e.message)
        setSellState('error')
        setTimeout(() => setSellState('idle'), 4000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-bold text-white">{coin} / EUR</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* Prezzo e variazione */}
        <div className={`rounded-2xl bg-gradient-to-br ${theme.bg} to-transparent border ${theme.border} p-5`}>
          <p className="text-4xl font-bold text-white">€{fmt4(currentPrice)}</p>
          <div className={`flex items-center gap-1.5 mt-2 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="text-sm font-semibold">
              {priceData?.change >= 0 ? '+' : ''}{(priceData?.change || 0).toFixed(2)}% oggi
            </span>
            <span className="text-xs text-slate-500 ml-1">
              H: €{fmt2(priceData?.high || 0)} · L: €{fmt2(priceData?.low || 0)}
            </span>
          </div>
        </div>

        {/* Posizione */}
        {pos && (
          <div className="card space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">La tua posizione</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Quantità</p>
                <p className="text-lg font-bold text-white">{pos.qty.toFixed(5)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Valore attuale</p>
                <p className="text-lg font-bold text-white">€{fmt2(currentValue)}</p>
              </div>
              {entryPrice && (
                <>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Prezzo entrata</p>
                    <p className="text-lg font-bold text-slate-300">€{fmt4(entryPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">P&L</p>
                    <p className={`text-lg font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pnlEur >= 0 ? '+' : ''}€{fmt2(pnlEur)} ({pnlPct >= 0 ? '+' : ''}{pnlPct?.toFixed(2)}%)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Livelli TP/SL */}
        <div className="card">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Livelli automatici</p>
          <LevelRow label="Take Profit 1 (+4%)" price={tp1} current={currentPrice} color="green" />
          <LevelRow label="Take Profit 2 (+8%)" price={tp2} current={currentPrice} color="green" />
          <LevelRow label="Stop Loss (-5%)"     price={sl}  current={currentPrice} color="red" />
        </div>

        {/* Mini chart equity */}
        {equityCurve?.length > 1 && (
          <div className="card">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Equity Curve</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={theme.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={theme.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs">
                      <p style={{ color: theme.color }} className="font-bold">€{payload[0].value?.toFixed(2)}</p>
                      <p className="text-slate-500">{payload[0].payload.date}</p>
                    </div>
                  ) : null}
                />
                <Area type="monotone" dataKey="value" stroke={theme.color} strokeWidth={2}
                  fill="url(#detailGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sell */}
        {pos && (
          <div className="space-y-2">
            {sellState === 'done' && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
                <CheckCircle size={14} /> {sellMsg}
              </div>
            )}
            {sellState === 'error' && (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                <AlertTriangle size={14} /> {sellMsg}
              </div>
            )}
            {sellState === 'confirm' && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 space-y-3">
                <p className="text-sm text-red-300 text-center">
                  Vendi {pos.qty.toFixed(5)} {coin} al prezzo di mercato?<br/>
                  <span className="font-bold">~€{fmt2(currentValue)}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSellState('idle')}
                    className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold">
                    Annulla
                  </button>
                  <button onClick={handleSell}
                    className="py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold">
                    CONFERMA
                  </button>
                </div>
              </div>
            )}
            {(sellState === 'idle' || sellState === 'loading') && (
              <button
                onClick={handleSell}
                disabled={sellState === 'loading'}
                className="w-full py-3.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-sm
                  transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sellState === 'loading'
                  ? <><Loader size={14} className="animate-spin" /> Invio...</>
                  : `VENDI ${coin} AL MERCATO`
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

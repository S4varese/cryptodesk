import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const BOT_API = import.meta.env.VITE_BOT_API_URL || null

const COIN_ACCENT = {
  SOL:  '#D4AF37',
  LINK: '#6366f1',
  AVAX: '#ef4444',
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

function LevelRow({ label, price, current, positive }) {
  const fmt = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n)
  const diff = current > 0 ? ((price - current) / current * 100) : 0
  return (
    <div className="flex items-center justify-between py-2.5 divider last:border-0">
      <span className="text-xs" style={{ color: '#666' }}>{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold font-mono" style={{ color: positive ? '#10b981' : '#ef4444' }}>
          €{fmt(price)}
        </span>
        <span className="ml-2 text-xs font-mono" style={{ color: '#444' }}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

export default function CoinDetail({ coin, pos, priceData, equityCurve, onBack }) {
  const [sellState, setSellState] = useState('idle')
  const [sellMsg, setSellMsg]     = useState('')

  const accent = COIN_ACCENT[coin] || '#D4AF37'
  const currentPrice = priceData?.price || pos?.price || 0
  const currentValue = (pos?.qty || 0) * currentPrice
  const entryPrice   = pos?.entry || null
  const pnlEur  = entryPrice ? currentValue - (pos.qty * entryPrice) : null
  const pnlPct  = entryPrice ? ((currentPrice - entryPrice) / entryPrice * 100) : null
  const isUp    = (pnlPct ?? priceData?.change ?? 0) >= 0

  const tp1 = (entryPrice || currentPrice) * 1.04
  const tp2 = (entryPrice || currentPrice) * 1.08
  const sl  = (entryPrice || currentPrice) * 0.95

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
    <div className="min-h-screen pb-24" style={{ background: '#080808' }}>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b px-4 py-3" style={{ background: '#080808', borderColor: '#1a1a1a' }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg transition-colors" style={{ color: '#555', background: '#161616' }}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: accent + '20', color: accent }}>
              {coin.slice(0,2)}
            </div>
            <span className="text-sm font-bold text-white tracking-wide">{coin} / EUR</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Prezzo */}
        <div className="card" style={{ borderColor: accent + '30', background: 'linear-gradient(135deg, #131313, #111)' }}>
          <p className="label mb-2">Prezzo Attuale</p>
          <p className="text-4xl font-bold text-white font-mono">€{fmt4(currentPrice)}</p>
          <div className={`flex items-center gap-1.5 mt-2 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span className="text-sm font-semibold">
              {(priceData?.change || 0) >= 0 ? '+' : ''}{(priceData?.change || 0).toFixed(2)}% oggi
            </span>
            <span className="text-xs ml-1" style={{ color: '#444' }}>
              H: €{fmt2(priceData?.high || 0)} · L: €{fmt2(priceData?.low || 0)}
            </span>
          </div>
        </div>

        {/* Posizione */}
        {pos && (
          <div className="card">
            <p className="label mb-3">La tua posizione</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="label mb-1">Quantità</p>
                <p className="text-lg font-bold text-white font-mono">{pos.qty.toFixed(5)}</p>
              </div>
              <div>
                <p className="label mb-1">Valore</p>
                <p className="text-lg font-bold text-white">€{fmt2(currentValue)}</p>
              </div>
              {entryPrice && (
                <>
                  <div>
                    <p className="label mb-1">Prezzo entrata</p>
                    <p className="text-lg font-bold font-mono" style={{ color: '#888' }}>€{fmt4(entryPrice)}</p>
                  </div>
                  <div>
                    <p className="label mb-1">P&L</p>
                    <p className={`text-lg font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pnlEur >= 0 ? '+' : ''}€{fmt2(pnlEur)}
                      <span className="text-xs ml-1 opacity-70">({pnlPct >= 0 ? '+' : ''}{pnlPct?.toFixed(2)}%)</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Livelli */}
        <div className="card">
          <p className="label mb-1">Livelli automatici</p>
          <LevelRow label="Take Profit 1 (+4%)" price={tp1} current={currentPrice} positive />
          <LevelRow label="Take Profit 2 (+8%)" price={tp2} current={currentPrice} positive />
          <LevelRow label="Stop Loss (-5%)"     price={sl}  current={currentPrice} positive={false} />
        </div>

        {/* Mini chart */}
        {equityCurve?.length > 1 && (
          <div className="card">
            <p className="label mb-3">Equity Curve</p>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="detGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  content={({ active, payload }) => active && payload?.length ? (
                    <div className="rounded-lg px-2 py-1 text-xs border" style={{ background: '#161616', borderColor: '#2a2a2a' }}>
                      <p className="font-bold" style={{ color: accent }}>€{payload[0].value?.toFixed(2)}</p>
                    </div>
                  ) : null}
                />
                <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2}
                  fill="url(#detGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sell */}
        {pos && (
          <div className="space-y-2 pt-1">
            {sellState === 'done' && (
              <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-emerald-400"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle size={14} /> {sellMsg}
              </div>
            )}
            {sellState === 'error' && (
              <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle size={14} /> {sellMsg}
              </div>
            )}
            {sellState === 'confirm' && (
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <p className="text-sm text-center" style={{ color: '#bbb' }}>
                  Vendi {pos.qty.toFixed(5)} {coin} al mercato?<br />
                  <span className="font-bold text-white">~€{fmt2(currentValue)}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSellState('idle')}
                    className="py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ background: '#1a1a1a', color: '#888' }}>
                    Annulla
                  </button>
                  <button onClick={handleSell}
                    className="py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: '#dc2626' }}>
                    CONFERMA
                  </button>
                </div>
              </div>
            )}
            {(sellState === 'idle' || sellState === 'loading') && (
              <button
                onClick={handleSell}
                disabled={sellState === 'loading'}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
                {sellState === 'loading'
                  ? <><Loader size={14} className="animate-spin" /> Invio ordine...</>
                  : `VENDI ${coin} AL MERCATO`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react'

const BOT_API = import.meta.env.VITE_BOT_API_URL || null

const COIN_STYLES = {
  SOL:  { gradient: 'from-purple-600 to-purple-800', glow: 'hover:shadow-purple-500/40', border: 'border-purple-500' },
  LINK: { gradient: 'from-cyan-600 to-cyan-800',     glow: 'hover:shadow-cyan-500/40',   border: 'border-cyan-500' },
  AVAX: { gradient: 'from-amber-600 to-amber-800',   glow: 'hover:shadow-amber-500/40',  border: 'border-amber-500' },
}

async function executeSell(coin) {
  if (!BOT_API) {
    // Simula una vendita quando non c'è backend configurato
    await new Promise(r => setTimeout(r, 1200))
    return { success: true, simulated: true }
  }
  const res = await fetch(`${BOT_API}/sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coin }),
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
}

function SellButton({ coin, qty, value, price }) {
  const [state, setState] = useState('idle') // idle | confirm | loading | done | error
  const [message, setMessage] = useState('')
  const s = COIN_STYLES[coin] || COIN_STYLES.SOL

  const fmt = n => new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const handleSell = async () => {
    if (state === 'idle') { setState('confirm'); return }
    if (state === 'confirm') {
      setState('loading')
      try {
        const result = await executeSell(coin)
        setMessage(result.simulated ? '✓ Simulato (configura VITE_BOT_API_URL)' : `✓ Ordine inviato`)
        setState('done')
        setTimeout(() => setState('idle'), 4000)
      } catch (e) {
        setMessage(e.message)
        setState('error')
        setTimeout(() => setState('idle'), 4000)
      }
    }
  }

  const cancel = () => setState('idle')

  if (state === 'done') {
    return (
      <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
        <CheckCircle size={14} />
        {message}
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
        <AlertTriangle size={14} />
        Errore: {message}
      </div>
    )
  }

  if (state === 'confirm') {
    return (
      <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3">
        <p className="text-xs text-red-300 text-center mb-3">
          ⚠️ Vendi {fmt(qty)} {coin} ({fmt(value)} EUR) al mercato?
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={cancel}
            className="py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSell}
            className="py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors"
          >
            CONFERMA
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleSell}
      disabled={state === 'loading'}
      className={`w-full py-3 rounded-xl bg-gradient-to-r ${s.gradient} border ${s.border}/50
        text-white font-bold text-sm tracking-wide
        hover:shadow-lg ${s.glow} hover:scale-[1.01] active:scale-[0.99]
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2`}
    >
      {state === 'loading' ? (
        <><Loader size={14} className="animate-spin" /> Invio ordine...</>
      ) : (
        <>VENDI {coin} · €{fmt(value)}</>
      )}
    </button>
  )
}

export default function SellButtons({ portfolio, prices }) {
  if (!portfolio?.positions) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Azioni Rapide</h2>
        <span className="text-xs text-red-400 font-semibold">⚡ Vendita Mercato</span>
      </div>
      <div className="space-y-2">
        {Object.entries(portfolio.positions).map(([coin, pos]) => (
          <SellButton
            key={coin}
            coin={coin}
            qty={pos.qty}
            value={pos.qty * (prices?.[coin]?.price || 0)}
            price={prices?.[coin]?.price || 0}
          />
        ))}
      </div>
      {!import.meta.env.VITE_BOT_API_URL && (
        <p className="text-xs text-slate-600 text-center px-2">
          Configura VITE_BOT_API_URL in Vercel per abilitare le vendite reali
        </p>
      )}
    </section>
  )
}

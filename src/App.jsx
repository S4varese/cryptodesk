import { useState } from 'react'
import Header from './components/Header'
import Portfolio from './components/Portfolio'
import EquityCurve from './components/EquityCurve'
import LivePrices from './components/LivePrices'
import BotPage from './components/BotPage'
import CoinDetail from './components/CoinDetail'
import BottomNav from './components/BottomNav'
import { useKrakenData } from './hooks/useKrakenData'

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[140, 90, 200, 140].map((h, i) => (
        <div key={i} className="rounded-2xl" style={{ height: h, background: '#111', border: '1px solid #1a1a1a' }} />
      ))}
    </div>
  )
}

export default function App() {
  const { prices, portfolio, loading, error, lastUpdate, refresh, PAIRS } = useKrakenData()
  const [activePage, setActivePage]   = useState('portfolio')
  const [selectedCoin, setSelectedCoin] = useState(null)

  if (selectedCoin) {
    return (
      <>
        <CoinDetail
          coin={selectedCoin}
          pos={portfolio?.positions?.[selectedCoin] || null}
          priceData={prices?.[selectedCoin] || null}
          equityCurve={portfolio?.equityCurve}
          onBack={() => setSelectedCoin(null)}
        />
        <BottomNav active={activePage} onChange={p => { setSelectedCoin(null); setActivePage(p) }} />
      </>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      <Header
        lastUpdate={lastUpdate}
        loading={loading}
        onRefresh={refresh}
        botStatus={portfolio?.botStatus}
      />

      <main className="max-w-lg mx-auto px-4 py-4 pb-28 space-y-5">
        {error && (
          <div className="rounded-2xl p-3 text-xs text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            ⚠️ {error} — riprovo tra 15s
          </div>
        )}

        {loading && !portfolio ? <Skeleton /> : (
          <>
            {activePage === 'portfolio' && (
              <>
                <Portfolio portfolio={portfolio} prices={prices} onCoinTap={setSelectedCoin} />
                <EquityCurve data={portfolio?.equityCurve} />
              </>
            )}
            {activePage === 'market' && (
              <LivePrices prices={prices} PAIRS={PAIRS} />
            )}
            {activePage === 'bot' && (
              <BotPage portfolio={portfolio} />
            )}
          </>
        )}
      </main>

      <BottomNav active={activePage} onChange={setActivePage} />
    </div>
  )
}

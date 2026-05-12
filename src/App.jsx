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
      {[120, 80, 200, 160].map((h, i) => (
        <div key={i} className="card bg-slate-900/50" style={{ height: h }} />
      ))}
    </div>
  )
}

export default function App() {
  const { prices, portfolio, loading, error, lastUpdate, refresh, PAIRS } = useKrakenData()
  const [activePage, setActivePage] = useState('portfolio')
  const [selectedCoin, setSelectedCoin] = useState(null)

  const handleCoinTap = (coin) => setSelectedCoin(coin)
  const handleBack    = () => setSelectedCoin(null)

  // Schermata dettaglio coin
  if (selectedCoin) {
    return (
      <>
        <CoinDetail
          coin={selectedCoin}
          pos={portfolio?.positions?.[selectedCoin] || null}
          priceData={prices?.[selectedCoin] || null}
          equityCurve={portfolio?.equityCurve}
          onBack={handleBack}
        />
        <BottomNav active={activePage} onChange={(p) => { setSelectedCoin(null); setActivePage(p) }} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        lastUpdate={lastUpdate}
        loading={loading}
        onRefresh={refresh}
        botStatus={portfolio?.botStatus}
      />

      <main className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-6">
        {error && (
          <div className="card border border-red-500/30 bg-red-500/10 text-red-400 text-xs text-center">
            ⚠️ {error} — riprovo tra 15s
          </div>
        )}

        {loading && !portfolio ? (
          <Skeleton />
        ) : (
          <>
            {activePage === 'portfolio' && (
              <>
                <Portfolio
                  portfolio={portfolio}
                  prices={prices}
                  onCoinTap={handleCoinTap}
                />
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

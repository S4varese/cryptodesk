import Header from './components/Header'
import Portfolio from './components/Portfolio'
import EquityCurve from './components/EquityCurve'
import LivePrices from './components/LivePrices'
import SellButtons from './components/SellButtons'
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

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        lastUpdate={lastUpdate}
        loading={loading}
        onRefresh={refresh}
        botStatus={portfolio?.botStatus}
      />

      <main className="max-w-lg mx-auto px-4 py-4 pb-10 space-y-6">
        {error && (
          <div className="card border border-red-500/30 bg-red-500/10 text-red-400 text-xs text-center">
            ⚠️ {error} — riprovo tra 15s
          </div>
        )}

        {loading && !portfolio ? (
          <Skeleton />
        ) : (
          <>
            <Portfolio portfolio={portfolio} prices={prices} />
            <EquityCurve data={portfolio?.equityCurve} />
            <LivePrices prices={prices} PAIRS={PAIRS} />
            <SellButtons portfolio={portfolio} prices={prices} />
          </>
        )}
      </main>
    </div>
  )
}

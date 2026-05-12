import { useState, useEffect, useCallback } from 'react'

const KRAKEN_API = 'https://api.kraken.com/0/public'
// TODO: sostituisci con l'URL del tuo backend Railway
const BOT_API = import.meta.env.VITE_BOT_API_URL || null

const PAIRS = {
  SOL:  { kraken: 'SOLEUR',  label: 'SOL/EUR',  color: '#8b5cf6' },
  LINK: { kraken: 'LINKEUR', label: 'LINK/EUR', color: '#06b6d4' },
  AVAX: { kraken: 'AVAXEUR', label: 'AVAX/EUR', color: '#f59e0b' },
}

async function fetchKrakenTicker() {
  const symbols = Object.values(PAIRS).map(p => p.kraken).join(',')
  const res = await fetch(`${KRAKEN_API}/Ticker?pair=${symbols}`)
  const data = await res.json()
  if (data.error?.length) throw new Error(data.error[0])

  return Object.entries(PAIRS).reduce((acc, [coin, meta]) => {
    const entry = data.result[meta.kraken] || Object.values(data.result)[0]
    acc[coin] = {
      price:  parseFloat(entry?.c?.[0] || 0),
      change: parseFloat(entry?.p?.[1] || 0), // 24h VWAP-based change
      high:   parseFloat(entry?.h?.[1] || 0),
      low:    parseFloat(entry?.l?.[1] || 0),
      volume: parseFloat(entry?.v?.[1] || 0),
    }
    return acc
  }, {})
}

async function fetchBotPortfolio() {
  if (!BOT_API) return null
  try {
    const res = await fetch(`${BOT_API}/portfolio`, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    // Normalizza la risposta dell'API reale aggiungendo equityCurve
    return { ...data, equityCurve: generateMockEquity(data.total) }
  } catch {
    return null
  }
}

// Dati mock usati finché Railway non è configurato
function getMockPortfolio(prices) {
  const solValue  = 2.5  * (prices?.SOL?.price  || 160)
  const linkValue = 15.0 * (prices?.LINK?.price || 13)
  const avaxValue = 3.8  * (prices?.AVAX?.price || 28)
  const eurFree   = 245.30
  const total     = solValue + linkValue + avaxValue + eurFree
  return {
    total,
    eurFree,
    positions: {
      SOL:  { qty: 2.5,  value: solValue,  entry: 148.20 },
      LINK: { qty: 15.0, value: linkValue, entry: 12.40 },
      AVAX: { qty: 3.8,  value: avaxValue, entry: 26.80 },
    },
    pnl: total - 850,
    pnlPct: ((total - 850) / 850) * 100,
    equityCurve: generateMockEquity(total),
    botStatus: 'running',
  }
}

function generateMockEquity(currentTotal) {
  const points = 30
  const base = currentTotal * 0.88
  return Array.from({ length: points }, (_, i) => {
    const noise = (Math.random() - 0.4) * 20
    const trend = (i / points) * (currentTotal - base)
    return {
      day: i + 1,
      value: Math.round((base + trend + noise) * 100) / 100,
    }
  }).concat([{ day: points + 1, value: Math.round(currentTotal * 100) / 100 }])
}

export function useKrakenData() {
  const [prices, setPrices]     = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [tickerData, botData] = await Promise.all([
        fetchKrakenTicker(),
        fetchBotPortfolio(),
      ])
      setPrices(tickerData)
      // Se l'API reale include i prezzi, li usa per aggiornare anche il ticker
      if (botData?.prices) {
        Object.entries(botData.prices).forEach(([coin, p]) => {
          if (tickerData[coin]) Object.assign(tickerData[coin], p)
        })
      }
      setPortfolio(botData || getMockPortfolio(tickerData))
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 15000)
    return () => clearInterval(interval)
  }, [refresh])

  return { prices, portfolio, loading, error, lastUpdate, refresh, PAIRS }
}

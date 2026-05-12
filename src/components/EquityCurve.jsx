import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-xl px-3 py-2 text-xs border"
      style={{ background: '#ffffff', borderColor: '#eaedff', boxShadow: '0 4px 12px rgba(26,86,255,0.1)' }}>
      <p className="font-bold" style={{ color: '#1a56ff' }}>€{payload[0].value?.toFixed(2)}</p>
      <p style={{ color: '#b0b8d0' }}>{p.date ?? `Giorno ${p.day}`}</p>
    </div>
  )
}

export default function EquityCurve({ data }) {
  if (!data?.length) return null

  const min   = Math.min(...data.map(d => d.value)) * 0.995
  const max   = Math.max(...data.map(d => d.value)) * 1.005
  const first = data[0]?.value || 0
  const last  = data[data.length - 1]?.value || 0
  const isUp  = last >= first

  const lineColor = isUp ? '#1a56ff' : '#ef4444'
  const fillStart = isUp ? 'rgba(26,86,255,0.12)' : 'rgba(239,68,68,0.08)'

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="label">Equity Curve</p>
        <span className={`text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-400'}`}>
          {isUp ? '+' : ''}€{(last - first).toFixed(2)}
        </span>
      </div>

      <div className="card">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={lineColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis domain={[min, max]} hide />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={first} stroke="#e0e4f4" strokeDasharray="4 4" />
            <Area
              type="monotone" dataKey="value"
              stroke={lineColor} strokeWidth={2.5}
              fill="url(#eqGrad)" dot={false}
              activeDot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-purple-400 font-bold">€{payload[0].value.toFixed(2)}</p>
      <p className="text-slate-500">Giorno {payload[0].payload.day}</p>
    </div>
  )
}

export default function EquityCurve({ data }) {
  if (!data?.length) return null

  const min = Math.min(...data.map(d => d.value)) * 0.995
  const max = Math.max(...data.map(d => d.value)) * 1.005
  const first = data[0]?.value || 0
  const last  = data[data.length - 1]?.value || 0
  const isUp  = last >= first

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Equity Curve</h2>
        <span className="text-xs text-slate-500">30 giorni</span>
      </div>

      <div className={`card border ${isUp ? 'border-purple-500/30' : 'border-red-500/30'}`}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={isUp ? '#8b5cf6' : '#ef4444'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isUp ? '#8b5cf6' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" hide />
            <YAxis domain={[min, max]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isUp ? '#8b5cf6' : '#ef4444'}
              strokeWidth={2}
              fill="url(#equityGrad)"
              dot={false}
              activeDot={{ r: 4, fill: isUp ? '#8b5cf6' : '#ef4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

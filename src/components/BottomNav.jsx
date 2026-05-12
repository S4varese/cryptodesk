import { LayoutDashboard, TrendingUp, Bot } from 'lucide-react'

const tabs = [
  { id: 'portfolio', label: 'Portfolio', icon: LayoutDashboard },
  { id: 'market',    label: 'Mercato',   icon: TrendingUp },
  { id: 'bot',       label: 'Bot',       icon: Bot },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: '#ffffff', borderColor: '#eaedff' }}>
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative"
              style={{ color: isActive ? '#1a56ff' : '#b0b8d0' }}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-xs font-semibold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                {label.toUpperCase()}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#1a56ff' }} />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

import { LayoutDashboard, TrendingUp, Bot } from 'lucide-react'

const tabs = [
  { id: 'portfolio', label: 'Portfolio', icon: LayoutDashboard },
  { id: 'market',    label: 'Mercato',   icon: TrendingUp },
  { id: 'bot',       label: 'Bot',       icon: Bot },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors
                ${isActive ? 'text-purple-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
              {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-purple-400 rounded-full" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

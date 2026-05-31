import { Bell, Settings } from 'lucide-react'

type TopBarProps = {
  title: string
  userName?: string
  shopName?: string
}

export function TopBar({ title, userName = 'Kandis', shopName = 'Maker Studio' }: TopBarProps) {
  const initials = userName.slice(0, 2).toUpperCase()
  return (
    <header className="h-[60px] bg-white border-b border-pine/10 flex items-center justify-between px-7 shrink-0">
      <h1 className="text-xl font-bold text-pine">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-salt transition-colors">
          <Bell size={20} className="text-pine/50" strokeWidth={2} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-salt transition-colors">
          <Settings size={20} className="text-pine/50" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-[34px] h-[34px] rounded-full bg-candy flex items-center justify-center">
            <span className="text-xs font-bold text-pine">{initials}</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-pine">Hey {userName}</p>
            <p className="text-xs text-pine/50">{shopName}</p>
          </div>
          <span className="text-[10px] text-pine/40">▾</span>
        </div>
      </div>
    </header>
  )
}

'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Calculator, Truck,
  BarChart2, DollarSign, Settings, Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard',          href: '/',           icon: LayoutDashboard },
  { label: 'Products',           href: '/products',   icon: Package         },
  { label: 'Pricing Calculator', href: '/calculator', icon: Calculator      },
  { label: 'Suppliers',          href: '/suppliers',  icon: Truck           },
  { label: 'Insights',           href: '/insights',   icon: BarChart2       },
  { label: 'Overhead',           href: '/overhead',   icon: DollarSign      },
  { label: 'Settings',           href: '/settings',   icon: Settings        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[210px] shrink-0 bg-white border-r border-pine/10 flex flex-col py-6 px-4">
      <Image
        src="/images/logo-candy.png"
        alt="Mak'rs Mode"
        width={140}
        height={44}
        className="mb-8 ml-1"
        priority
      />

      <nav className="flex-1 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-poppy/10 text-poppy font-medium'
                  : 'text-pine/60 hover:text-pine hover:bg-salt'
              )}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="bg-salt rounded-card p-4 mt-6">
        <div className="w-7 h-7 rounded-full bg-honey/20 flex items-center justify-center mb-2">
          <Lightbulb size={14} className="text-honey" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium text-pine mb-1">Need help?</p>
        <p className="text-xs text-pine/60 mb-2 leading-relaxed">
          Visit our resource center for guides and tips.
        </p>
        <a href="#" className="text-xs font-medium text-poppy">
          Explore resources →
        </a>
      </div>
    </aside>
  )
}

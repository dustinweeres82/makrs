import { TrendingUp, AlertCircle, MoreHorizontal, Plus, BarChart2, ArrowRight } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, delta, alert, accentColor, glyphColor,
}: {
  label: string; value: string; sub: string
  delta?: string; alert?: boolean
  accentColor: string; glyphColor: string
}) {
  return (
    <Card className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-[0.7px] text-pine/40 uppercase mb-1.5">{label}</p>
          <p className="text-[28px] font-bold text-pine leading-none">{value}</p>
          <p className="text-xs text-pine/50 mt-1">{sub}</p>
        </div>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${accentColor}`}>
          <span className={`text-2xl leading-none ${glyphColor}`}>✳</span>
        </div>
      </div>
      {delta && (
        <div className="flex items-center gap-1 mt-3">
          <TrendingUp size={12} className="text-pear" strokeWidth={2} />
          <span className="text-xs font-medium text-pear">{delta}</span>
        </div>
      )}
      {alert && (
        <div className="flex items-center gap-1 mt-3">
          <AlertCircle size={14} className="text-poppy" strokeWidth={2} />
          <a href="#" className="text-xs font-medium text-poppy">View products →</a>
        </div>
      )}
    </Card>
  )
}

// ─── Donut chart ─────────────────────────────────────────────────────────────

function DonutChart() {
  const segments = [
    { pct: 58, color: '#CCD580', label: 'Healthy', count: 7 },
    { pct: 25, color: '#E8A820', label: 'Warning', count: 3 },
    { pct: 17, color: '#F04D2A', label: 'Low',     count: 2 },
  ]
  const r = 52, cx = 68, cy = 68
  const circ = 2 * Math.PI * r
  let offset = -90

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[136px] h-[136px] shrink-0">
        <svg width={136} height={136}>
          {segments.map(({ pct, color }) => {
            const dash = circ * (pct / 100)
            const rotation = offset
            offset += (pct / 100) * 360
            return (
              <circle
                key={color}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={color}
                strokeWidth={20}
                strokeDasharray={`${dash} ${circ - dash}`}
                transform={`rotate(${rotation} ${cx} ${cy})`}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-bold text-pine leading-none">12</span>
          <span className="text-xs text-pine/50">products</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {segments.map(({ label, count, pct, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium text-pine w-14">{label}</span>
            <span className="text-sm text-pine/50">({count})</span>
            <span className="text-sm text-pine/50 ml-1">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Right panel ─────────────────────────────────────────────────────────────

function RightPanel() {
  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-pine">Profit Summary</h2>
          <button className="text-xs text-pine/50 border border-pine/15 rounded px-2.5 py-1">
            This Month ▾
          </button>
        </div>

        <p className="text-[10px] font-medium tracking-[0.7px] text-pine/40 uppercase mb-1">Total Revenue</p>
        <div className="flex items-center justify-between">
          <p className="text-[28px] font-bold text-pine">$1,280.00</p>
          <div className="w-10 h-10 rounded-full bg-candy/20 flex items-center justify-center">
            <span className="text-xl text-candy">✳</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1 mb-4">
          <TrendingUp size={12} className="text-pear" strokeWidth={2} />
          <span className="text-xs font-medium text-pear">22% vs last month</span>
        </div>

        <div className="border-t border-pine/10 pt-4">
          <p className="text-sm font-medium text-pine mb-3">Breakdown</p>
          {[
            ['Total Cost',     '$592.00'],
            ['Gross Profit',   '$688.00'],
            ['Average Margin', '47%'    ],
            ['Best Margin',    '54% (Lavender Soap)'],
            ['Lowest Margin',  '12% (Bath Bomb)'    ],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center mb-2">
              <span className="text-sm text-pine/60">{k}</span>
              <span className="text-sm font-medium text-pine text-right max-w-[140px]">{v}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-pine/10 pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-pine">Margin Range Guide</p>
            <a href="#" className="text-xs font-medium text-poppy">What&apos;s this?</a>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden mb-1.5">
            {['#F04D2A','#E8A820','#CCD580','#34a853'].map(c => (
              <div key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-pine/40 mb-1">
            {['0%','30%','50%','70%','100%'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="flex justify-between text-[10px] font-medium">
            {[['Low','#F04D2A'],['Okay','#E8A820'],['Good','#CCD580'],['Excellent','#34a853']].map(([l,c]) => (
              <span key={l} style={{ color: c }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <Card variant="salt" className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-cornflower/30 flex items-center justify-center shrink-0 text-base">
            🌐
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-pine mb-1">Market Comparison</p>
            <p className="text-xs text-pine/60 leading-relaxed">
              You&apos;re doing great! Your average margin is 9% higher than similar makers.
            </p>
          </div>
          <button className="w-8 h-8 rounded-full border border-pine/15 flex items-center justify-center shrink-0">
            <ArrowRight size={14} className="text-pine" strokeWidth={2} />
          </button>
        </div>
      </Card>

      <button className="w-full bg-poppy hover:bg-poppy/90 transition-colors rounded-card p-5 flex items-center justify-between text-left">
        <div>
          <p className="text-base font-bold text-white">Create New Product</p>
          <p className="text-xs text-white/70 mt-0.5">Start pricing a new product</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Plus size={20} className="text-white" strokeWidth={2.5} />
        </div>
      </button>
    </div>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { name: 'Lavender Soap',        size: '4oz',   price: '$18.50', cost: '$4.92',  margin: '54%', status: 'healthy' as const, date: 'May 20, 2024', emoji: '🌸' },
  { name: 'Vanilla Candle',       size: '8oz',   price: '$21.00', cost: '$13.02', margin: '38%', status: 'warning' as const, date: 'May 18, 2024', emoji: '🕯️' },
  { name: 'Eucalyptus Bath Bomb', size: '2.5oz', price: '$6.00',  cost: '$5.28',  margin: '12%', status: 'low'     as const, date: 'May 15, 2024', emoji: '💚' },
]

const OPPORTUNITIES = [
  { name: 'Lavender Soap',  body: 'You could increase price by $1.25 and improve margin by 8%', gain: '+$1.25', icon: '📈' },
  { name: 'Vanilla Candle', body: 'Packaging costs are 18% higher than similar products',        gain: null,     icon: '📦' },
  { name: 'Bath Bomb',      body: 'Margin is too low. Consider reducing costs or raising price.', gain: null,     icon: '%'  },
]

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" rightPanel={<RightPanel />}>
      <div className="p-7 flex flex-col gap-5">

        {/* Stat cards */}
        <div className="flex gap-4">
          <StatCard label="Products"          value="12"     sub="priced"                    delta="2 this week"        accentColor="bg-candy/20"   glyphColor="text-candy"   />
          <StatCard label="Avg Margin"        value="47%"    sub="across all products"       delta="5% vs last month"   accentColor="bg-thistle/20" glyphColor="text-thistle" />
          <StatCard label="Monthly Revenue"   value="$1,280" sub="based on current prices"   delta="$230 vs last month" accentColor="bg-honey/20"   glyphColor="text-honey"   />
          <StatCard label="Low Margin Alerts" value="2"      sub="products"                  alert                      accentColor="bg-poppy/10"   glyphColor="text-poppy"   />
        </div>

        {/* Recent products table */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="text-lg font-bold text-pine">Recent Products</h2>
            <a href="#" className="text-sm font-medium text-poppy">View all products →</a>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_32px] px-5 pb-2">
            {['Product','Retail Price','Cost','Margin','Status','Last Updated',''].map(h => (
              <span key={h} className="text-[10px] font-medium tracking-[0.6px] text-pine/40 uppercase">{h}</span>
            ))}
          </div>
          {PRODUCTS.map((p) => (
            <div key={p.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_32px] items-center px-5 py-3.5 border-t border-pine/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-salt flex items-center justify-center text-sm">{p.emoji}</div>
                <div>
                  <p className="text-sm font-medium text-pine">{p.name}</p>
                  <p className="text-xs text-pine/50">{p.size}</p>
                </div>
              </div>
              <span className="text-sm text-pine">{p.price}</span>
              <span className="text-sm text-pine">{p.cost}</span>
              <span className="text-sm text-pine">{p.margin}</span>
              <StatusBadge variant={p.status} label={p.status === 'healthy' ? 'Healthy' : p.status === 'warning' ? 'Warning' : 'Low'} />
              <span className="text-sm text-pine/50">{p.date}</span>
              <button className="text-pine/30 hover:text-pine/60">
                <MoreHorizontal size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </Card>

        {/* Margin health + Pricing opportunities */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h2 className="text-lg font-bold text-pine mb-4">Margin Health</h2>
            <DonutChart />
            <div className="flex items-center gap-2 bg-pear/20 rounded-lg px-3 py-2.5 mt-4">
              <span className="text-sm">☀️</span>
              <p className="text-xs text-pine">Great job! 58% of your products are in a healthy margin range.</p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="text-lg font-bold text-pine">Pricing Opportunities</h2>
              <a href="#" className="text-sm font-medium text-poppy">View all insights →</a>
            </div>
            {OPPORTUNITIES.map((o, i) => (
              <div key={o.name} className={`flex items-center gap-3 px-5 py-4 ${i < OPPORTUNITIES.length - 1 ? 'border-b border-pine/[0.08]' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-salt flex items-center justify-center text-base shrink-0">{o.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pine">{o.name}</p>
                  <p className="text-xs text-pine/60 leading-relaxed">{o.body}</p>
                </div>
                {o.gain && <span className="text-base font-bold text-pine shrink-0">{o.gain}</span>}
                <button className="text-xs font-medium text-pine border border-pine/20 rounded px-3 py-1.5 shrink-0 hover:bg-salt transition-colors">
                  Review
                </button>
              </div>
            ))}
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-bold text-pine mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: <Plus size={18} className="text-poppy" />,        title: 'New Product',        sub: 'Add a product to price',    active: true  },
              { icon: <span className="text-lg">🧮</span>,              title: 'Pricing Calculator', sub: 'Calculate product pricing', active: false },
              { icon: <span className="text-lg">💰</span>,              title: 'Add Overhead',       sub: 'Update monthly costs',      active: false },
              { icon: <BarChart2 size={18} className="text-pine/60" />, title: 'View Insights',      sub: 'See detailed analytics',    active: false },
            ].map(({ icon, title, sub, active }) => (
              <button key={title} className={`flex items-center gap-3 bg-white rounded-card p-4 border text-left hover:bg-salt transition-colors ${active ? 'border-poppy/30' : 'border-pine/10'}`}>
                {icon}
                <div>
                  <p className={`text-sm font-medium ${active ? 'text-poppy' : 'text-pine'}`}>{title}</p>
                  <p className="text-xs text-pine/50">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}

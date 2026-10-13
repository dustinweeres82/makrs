import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Slider } from '@/components/ui/Slider'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Icon, ICON_NAMES, ICON_COUNT } from '@/components/ui/Icon'

// ── Palette (source of truth: brand board) ───────────────────────────────────

const PALETTE = [
  { name: 'Poppy',      hex: '#F04D2A', role: 'Primary CTA · Hero',            darkName: false },
  { name: 'Candy',      hex: '#F5A7BC', role: 'Soft accent · Highlights',      darkName: false },
  { name: 'Honey',      hex: '#E8A820', role: 'Tips · Stars',                  darkName: false },
  { name: 'Pear',       hex: '#CCD580', role: 'Savings · Best deals',          darkName: false },
  { name: 'Pine',       hex: '#1C4A4A', role: 'Body text · Anchor',            darkName: false },
  { name: 'Cornflower', hex: '#BAC8E8', role: 'Market data · Insights',        darkName: false },
  { name: 'Thistle',    hex: '#D6B2CA', role: 'Premium features · Alerts',     darkName: false },
  { name: 'Salt',       hex: '#F7F4F0', role: 'Background · Text on dark',     darkName: true  },
]

const TYPE_SCALE = [
  { cls: 'type-heading text-page', label: 'Heading',           spec: 'Inter · 800 · Uppercase · Poppy/Pine', use: 'Headlines, prices, title labels', sample: 'More making.' },
  { cls: 'type-secondary text-2xl', label: 'Secondary heading', spec: 'Inter · 700 · Uppercase · Pine',            use: 'Section titles, key numbers',     sample: 'Your spreadsheet' },
  { cls: 'type-third text-lg', label: 'Third heading',          spec: 'Inter · 600 · Uppercase · Pine',            use: 'Cards, buttons, navigation',      sample: 'Price my product' },
  { cls: 'type-tagline text-base', label: 'Fourth heading',     spec: 'Inter · 400 · Sentence case · Pine',        use: 'Taglines',                        sample: "Let's get you paid properly." },
  { cls: 'type-body text-sm', label: 'Body text',               spec: 'Inter · 400 · Sentence case · Pine',        use: 'Descriptions, tips, metadata',    sample: 'Ordering one thing at a time means you pay shipping on every order.' },
]

// ── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <p className="type-third text-xs text-poppy mb-1">{kicker}</p>
      <h2 className="type-secondary text-2xl mb-6">{title}</h2>
      {children}
    </section>
  )
}

function Swatch({ name, hex, role, darkName }: (typeof PALETTE)[number]) {
  return (
    <div className="rounded-card overflow-hidden bg-salt shadow-card">
      <div className="h-32 flex items-end p-4" style={{ backgroundColor: hex }}>
        <span className={`type-third text-lg ${darkName ? 'text-pine' : 'text-salt'}`}>{name}</span>
      </div>
      <div className="p-4">
        <p className="font-sans text-sm font-medium text-poppy">{hex}</p>
        <p className="type-body text-xs mt-1">{role}</p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <div className="h-screen overflow-y-auto bg-salt">
      <div className="max-w-5xl mx-auto px-8 py-14">

        {/* Masthead */}
        <header className="mb-16">
          <h1 className="type-heading text-hero text-poppy">Mak&rsquo;rs Mode</h1>
          <p className="type-tagline text-lg mt-3">Design system — priced by vibes, documented properly.</p>
        </header>

        {/* Colour */}
        <Section kicker="Foundations" title="Colour">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PALETTE.map((c) => <Swatch key={c.name} {...c} />)}
          </div>
        </Section>

        {/* Typography */}
        <Section kicker="Foundations" title="Typography">
          <div className="flex flex-col gap-6">
            {TYPE_SCALE.map((t) => (
              <div key={t.label} className="grid md:grid-cols-[220px_1fr] gap-4 border-b border-pine/10 pb-6">
                <div>
                  <p className="type-third text-sm">{t.label}</p>
                  <p className="type-body text-xs mt-1">{t.spec}</p>
                  <p className="type-body text-xs mt-2 text-pine/50">{t.use}</p>
                </div>
                <p className={t.cls}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section kicker="Components" title="Buttons">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Price my product</Button>
              <Button variant="pine">Get on the list</Button>
              <Button variant="secondary">View all</Button>
              <Button variant="ghost">Skip for now</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button withChevron>Price my product</Button>
              <Button variant="secondary" withChevron iconPosition="left">Back</Button>
              <Button variant="pine">No icon</Button>
            </div>
          </div>
        </Section>

        {/* Iconography */}
        <Section kicker="Foundations" title="Iconography">
          <p className="type-body text-sm mb-6 max-w-content">
            {ICON_COUNT} hand-drawn brand marks. They ship with baked-in colour (they don&rsquo;t
            inherit text colour) — use them as static artwork.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {ICON_NAMES.map((slug) => (
              <div
                key={slug}
                className="flex flex-col items-center justify-center gap-2 rounded-card bg-white shadow-card px-2 py-5"
              >
                <Icon name={slug} size={44} />
                <span className="type-body text-[10px] text-pine/40 text-center">{slug}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Slider */}
        <Section kicker="Components" title="Slider">
          <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
            <Slider label="Margin" defaultValue={54} suffix="%" minLabel="tight" maxLabel="healthy" />
            <Slider label="Overhead split" defaultValue={30} suffix="%" fillColor="#BAC8E8" />
          </div>
        </Section>

        {/* Inputs */}
        <Section kicker="Components" title="Form fields">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <Input label="Email" name="email" type="email" placeholder="you@shop.com" hint="We'll only email you the good stuff." />
            <Input label="Shop name" name="shop" placeholder="@handle (optional)" />
            <Input label="Price" name="price" placeholder="$0.00" error="Enter a price above your cost." />
          </div>
        </Section>

        {/* Badges */}
        <Section kicker="Components" title="Status badges">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge variant="healthy" label="Healthy" />
            <StatusBadge variant="warning" label="Warning" />
            <StatusBadge variant="low" label="Low" />
            <StatusBadge variant="info" label="Insight" />
          </div>
        </Section>

        {/* Cards */}
        <Section kicker="Components" title="Cards">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <p className="type-third text-sm mb-1">White</p>
              <p className="type-body text-sm">Default surface for content on a salt background.</p>
            </Card>
            <Card variant="salt">
              <p className="type-third text-sm mb-1">Salt</p>
              <p className="type-body text-sm">Subtle surface for nested or secondary content.</p>
            </Card>
            <Card variant="highlighted">
              <p className="type-third text-sm mb-1 text-poppy">Highlighted</p>
              <p className="type-body text-sm">Poppy-bordered surface to draw the eye.</p>
            </Card>
          </div>
        </Section>

      </div>
    </div>
  )
}

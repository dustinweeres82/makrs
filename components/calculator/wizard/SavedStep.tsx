'use client'

import { Check, Heart, Asterisk, BarChart3, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepLayout } from './StepLayout'

type Tone = 'candy' | 'honey' | 'thistle' | 'cornflower'

const toneCircle: Record<Tone, string> = {
  candy: 'bg-candy/50',
  honey: 'bg-honey/40',
  thistle: 'bg-thistle/50',
  cornflower: 'bg-cornflower/50',
}

function FeatureRow({
  tone,
  icon,
  filled,
  children,
  sub,
}: {
  tone: Tone
  icon: React.ReactNode
  filled?: boolean
  children: React.ReactNode
  sub?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl px-4 py-4',
        filled ? 'bg-candy/70' : 'border border-pine/15',
      )}
    >
      <span
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-pine',
          filled ? 'bg-white/70' : toneCircle[tone],
        )}
      >
        {icon}
      </span>
      <div>
        <p className="font-sans font-semibold text-pine leading-snug">{children}</p>
        {sub && <p className="type-body text-sm mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function SavedStep({ retail }: { retail: number }) {
  return (
    <div>
      {/* Saved banner */}
      <div className="flex items-center gap-4">
        <span className="w-16 h-16 rounded-full bg-pear flex items-center justify-center shrink-0">
          <Check size={30} className="text-pine" strokeWidth={3} />
        </span>
        <div>
          <p className="type-heading text-2xl">
            Saved<span className="text-poppy">.</span>
          </p>
          <p className="type-body text-sm mt-0.5">
            Your ${Math.round(retail)} pricing is in your inbox.
          </p>
        </div>
      </div>

      <hr className="border-t border-dashed border-pine/20 my-8" />

      <StepLayout
        left={
          <div>
            <h1 className="type-heading text-page">
              Now, the<br /><span className="text-poppy">good part.</span>
            </h1>
            <p className="type-body text-base mt-4 max-w-sm">
              When the full app opens, here&rsquo;s what you unlock:
            </p>

            {/* Early access pricing */}
            <div className="rounded-2xl bg-pine p-6 mt-8">
              <p className="type-secondary text-lg text-pear">Early access &amp; launch pricing</p>
              <p className="font-sans text-base text-salt/90 leading-relaxed mt-3">
                First 100 subscribers lock in{' '}
                <strong className="font-bold text-pear">$9.99/mo</strong> for tier one, forever.
                Everyone after pays $14.99.
              </p>
              <hr className="border-salt/20 my-4" />
              <p className="type-heading text-xl text-salt">
                You get first dibs<br />the day we open<span className="text-poppy">.</span>
              </p>
            </div>
          </div>
        }
        right={
          <div className="flex flex-col gap-3">
            <FeatureRow tone="candy" icon={<Heart size={22} strokeWidth={2} />}>
              Know what products are actually <span className="text-poppy">profitable</span>
            </FeatureRow>
            <FeatureRow tone="honey" icon={<Asterisk size={22} strokeWidth={2.5} />}>
              Spot <span className="text-poppy">underpriced</span> products before they cost you
            </FeatureRow>
            <FeatureRow tone="thistle" icon={<BarChart3 size={22} strokeWidth={2} />}>
              Compare pricing across the market so you price{' '}
              <span className="text-poppy">competitively</span>
            </FeatureRow>
            <FeatureRow tone="cornflower" icon={<Search size={22} strokeWidth={2} />}>
              Find the lowest cost on supplies to keep more $ in your pocket
            </FeatureRow>
            <FeatureRow
              tone="candy"
              filled
              icon={<Asterisk size={22} strokeWidth={2.5} />}
              sub="no burnout here."
            >
              Build a sustainable &amp; profitable business
            </FeatureRow>
          </div>
        }
      />
    </div>
  )
}

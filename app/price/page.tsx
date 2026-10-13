import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PricingSummaryCard } from '@/components/calculator/PricingSummaryCard'

export default function PricePage() {
  return (
    <div className="h-screen overflow-y-auto bg-salt">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="type-third text-sm text-candy">Free calculator</span>
              <span className="type-third text-xs text-pine bg-pear/50 rounded-pill px-3 py-1">
                No sign-up
              </span>
            </div>

            <h1 className="type-heading text-page md:text-hero">
              Stop pricing<br />
              <span className="text-poppy">by vibes.</span>
            </h1>

            <p className="text-pine text-lg md:text-xl mt-6 max-w-md">
              See what your handmade product actually costs to make — materials, your
              time, and the sneaky stuff nobody counts.
            </p>

            <p className="type-tagline italic text-pine/50 mt-4 max-w-md">
              Toss those scribbled notes, and do more than your spreadsheet could ever
              dream of.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/price/start"
                className="inline-flex items-center justify-center gap-2.5 rounded-pill bg-poppy text-salt shadow-card
                           font-semibold uppercase tracking-[0.03em] text-base px-8 py-4
                           hover:bg-poppy/90 transition-colors"
              >
                Price my product
                <ChevronRight size={20} strokeWidth={2.5} />
              </Link>
              <span className="type-tagline italic text-pine/50 text-sm">
                6 steps · about 3 minutes
              </span>
            </div>
          </div>

          {/* Right — example card */}
          <PricingSummaryCard example />

        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'
import { Star } from 'lucide-react'

/**
 * Public marketing header — full-width Poppy pill with the wordmark and a
 * single high-intent CTA. Used on the landing / calculator funnel pages.
 */
export function SiteHeader() {
  return (
    <header className="px-4 pt-4">
      <div className="max-w-6xl mx-auto bg-poppy rounded-pill flex items-center justify-between pl-7 pr-3 py-3">
        <a href="https://makrsmode.com" className="type-secondary text-xl text-salt">
          Mak&rsquo;rs Mode
        </a>
        <Link
          href="/price/start"
          className="inline-flex items-center gap-2 bg-salt rounded-pill pl-5 pr-4 py-2.5 hover:bg-white transition-colors"
        >
          <span className="type-third text-xs text-poppy">Get early access</span>
          <Star size={16} className="fill-honey text-honey" />
        </Link>
      </div>
    </header>
  )
}

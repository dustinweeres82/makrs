import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette (source of truth: brand board) ──────────────────
        poppy:      '#F04D2A', // Primary CTA / Hero
        candy:      '#F5A7BC', // Soft accent / Highlights
        honey:      '#E8A820', // Tips / Stars
        pear:       '#CCD580', // Savings / Best deals
        pine:       '#1C4A4A', // Body text / Anchor
        cornflower: '#BAC8E8', // Market data / Insights
        thistle:    '#D6B2CA', // Premium features / Alerts
        salt:       '#F7F4F0', // Background / Text on dark
      },
      fontFamily: {
        sans:     ['var(--font-inter)', 'sans-serif'],
        hertical: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        // Hertical headline scale
        'hero':    ['64px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'page':    ['48px', { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'section': ['32px', { lineHeight: '1.15' }],
        'card':    ['24px', { lineHeight: '1.2'  }],
      },
      maxWidth: {
        content: '720px',
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(28, 74, 74, 0.08)',
        pop:  '0 8px 24px rgba(28, 74, 74, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config

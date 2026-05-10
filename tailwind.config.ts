import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        poppy:      '#F04D2A',
        candy:      '#F5A7BC',
        honey:      '#E8A820',
        pear:       '#CCD580',
        pine:       '#1C4A4A',
        cornflower: '#BAC8E8',
        thistle:    '#D6B2CA',
        salt:       '#F5F0E8',
      },
      fontFamily: {
        sans:     ['var(--font-dm-sans)', 'sans-serif'],
        hertical: ['Hertical Sans', 'sans-serif'],
      },
      fontSize: {
        // Hertical headline scale
        'hero':    ['64px', { lineHeight: '1.05' }],
        'page':    ['48px', { lineHeight: '1.1'  }],
        'section': ['32px', { lineHeight: '1.15' }],
        'card':    ['24px', { lineHeight: '1.2'  }],
      },
      maxWidth: {
        content: '720px',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}

export default config

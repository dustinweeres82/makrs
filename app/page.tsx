import Image from 'next/image'
import Link from 'next/link'

const palette = [
  { name: 'Poppy',      hex: '#F04D2A', bg: 'bg-poppy',      text: 'text-white',      use: 'Primary CTA, key numbers'   },
  { name: 'Candy',      hex: '#F5A7BC', bg: 'bg-candy',      text: 'text-pine',       use: 'Secondary accent'            },
  { name: 'Honey',      hex: '#E8A820', bg: 'bg-honey',      text: 'text-pine',       use: 'Warnings'                    },
  { name: 'Pear',       hex: '#CCD580', bg: 'bg-pear',       text: 'text-pine',       use: 'Success, healthy margin'     },
  { name: 'Pine',       hex: '#1C4A4A', bg: 'bg-pine',       text: 'text-white',      use: 'Primary text, brand colour'  },
  { name: 'Cornflower', hex: '#BAC8E8', bg: 'bg-cornflower', text: 'text-pine',       use: 'Info, tooltips'              },
  { name: 'Thistle',    hex: '#D6B2CA', bg: 'bg-thistle',    text: 'text-pine',       use: 'Soft accent'                 },
  { name: 'Salt',       hex: '#F5F0E8', bg: 'bg-salt border border-pine/10', text: 'text-pine', use: 'Page background'   },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-salt py-16 px-6">
      <div className="max-w-content mx-auto space-y-16">

        {/* Logo + hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <Image
            src="/images/logo-candy.png"
            alt="Mak'rs Mode"
            width={200}
            height={100}
            priority
            className="h-16 w-auto"
          />
          <div>
            <p className="text-lg text-pine/70 mt-1">
              We hate math. So we did it for you.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-pear/40 text-pine px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-pear inline-block" />
            Day 1 — foundation is live
          </div>
          <Link
            href="/calculator"
            className="bg-poppy text-white font-sans font-medium px-6 py-3 rounded-md text-sm hover:bg-poppy/90 transition-colors"
          >
            Open calculator
          </Link>
        </section>

        {/* Colour palette */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-pine/40">Colour system</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {palette.map(({ name, hex, bg, text, use }) => (
              <div key={name} className="rounded-card overflow-hidden shadow-sm">
                <div className={`h-14 ${bg}`} />
                <div className="bg-white px-3 py-2">
                  <p className="text-sm font-medium text-pine">{name}</p>
                  <p className="text-xs text-pine/50 font-mono">{hex}</p>
                  <p className="text-xs text-pine/40 mt-0.5 leading-tight">{use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Type scale */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-pine/40">Type scale</h2>
          <div className="bg-white rounded-card shadow-sm p-6 space-y-6 overflow-hidden">

            <div>
              <p className="text-xs text-pine/40 uppercase tracking-widest mb-2 font-medium">
                Hertical Sans 800 — awaiting font files from Kandis
              </p>
              <p className="font-hertical text-section uppercase text-pine tracking-tight">
                PRICE WHAT YOU MAKE
              </p>
              <p className="text-xs text-pine/40 mt-1 font-mono">font-hertical / text-section / 32px</p>
            </div>

            <div className="border-t border-pine/10 pt-6 space-y-4">
              <p className="text-xs text-pine/40 uppercase tracking-widest mb-2 font-medium">DM Sans — active</p>
              <div>
                <p className="text-xl font-medium text-pine">$18.50 suggested retail</p>
                <p className="text-xs text-pine/40 font-mono mt-0.5">text-xl / 20px / 500</p>
              </div>
              <div>
                <p className="text-base text-pine">How long does it take to make this product?</p>
                <p className="text-xs text-pine/40 font-mono mt-0.5">text-base / 16px / 400</p>
              </div>
              <div>
                <p className="text-sm text-pine/70">Only include shipping supplies if YOU eat the cost.</p>
                <p className="text-xs text-pine/40 font-mono mt-0.5">text-sm / 14px / 400</p>
              </div>
              <div>
                <p className="text-xs text-pine/50 uppercase tracking-[0.05em] font-medium">Net profit</p>
                <p className="text-xs text-pine/40 font-mono mt-0.5">text-xs / 12px / 500 / 0.05em spacing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Component primitives */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-pine/40">Component primitives</h2>
          <div className="bg-white rounded-card shadow-sm p-6 flex flex-wrap gap-3 items-center">
            <button className="bg-poppy text-white font-medium px-6 py-3 rounded-md text-sm">
              Primary button
            </button>
            <button className="border-2 border-pine text-pine font-medium px-6 py-3 rounded-md text-sm bg-transparent">
              Secondary
            </button>
            <button className="text-pine underline text-sm">
              Text link
            </button>
            <button className="bg-poppy text-white font-medium px-6 py-3 rounded-md text-sm opacity-50 cursor-not-allowed">
              Disabled
            </button>
          </div>

          <div className="bg-white rounded-card shadow-sm p-6 space-y-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-pine">What do you make?</label>
              <input
                type="text"
                placeholder="Lavender soap, 4oz"
                className="w-full border border-pine/30 rounded-md px-[14px] py-[10px] text-base text-pine placeholder:text-pine/30 focus:border-pine focus:outline-none"
              />
              <p className="text-[13px] text-pine/70">A name only you need to recognize.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-pear/20 border border-pear rounded-card px-4 py-3 text-sm font-medium text-pine">
              Pear — success
            </div>
            <div className="bg-honey/20 border border-honey rounded-card px-4 py-3 text-sm font-medium text-pine">
              Honey — warning
            </div>
            <div className="bg-poppy/10 border border-poppy rounded-card px-4 py-3 text-sm font-medium text-poppy">
              Poppy — error
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

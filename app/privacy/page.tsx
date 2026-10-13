import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/SiteHeader'

export const metadata: Metadata = {
  title: "Privacy Policy | Mak'rs Mode",
}

// Plain-language policy for the free calculator (PIPEDA + CASL). Same text is pasted into the Wix site.
const UPDATED = 'October 13, 2026'
const CONTACT = 'hello@makrsmode.com'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="type-secondary text-xl text-pine">{title}</h2>
      <div className="type-body text-base text-pine mt-2 flex flex-col gap-3">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="h-screen overflow-y-auto bg-white">
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 pt-10 pb-16">
        <h1 className="type-heading text-page text-pine">Privacy policy</h1>
        <p className="type-body text-sm text-pine/60 mt-2">Last updated {UPDATED}</p>

        <Section title="The short version">
          <p>
            We collect your email and the numbers you put into the calculator so we can send you
            your price. We only send you marketing emails if you tick the box saying yes. We never
            sell your information. Email us any time and we&rsquo;ll delete it.
          </p>
        </Section>

        <Section title="Who we are">
          <p>
            Mak&rsquo;rs Mode is a Canadian business that makes pricing tools for handmade sellers.
            Questions about your information go to <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </Section>

        <Section title="What we collect">
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Your email address.</li>
            <li>
              What you make (the category you pick) and your pricing results: suggested retail,
              cost, margin and wholesale price.
            </li>
            <li>Whether you said yes to marketing emails, and when.</li>
            <li>Basic technical info, like your browser type.</li>
          </ul>
          <p>
            The materials, overhead and time you enter stay in your browser. We only keep the
            totals listed above.
          </p>
        </Section>

        <Section title="Why we collect it">
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>To email you your price and breakdown, which you asked for.</li>
            <li>
              If you ticked the box: to send you early access news, launch offers and the odd
              pricing tip.
            </li>
            <li>
              To understand, in combined and anonymous form, what makers sell and how they price
              it, so we can build better tools. We never publish anything that identifies you.
            </li>
          </ul>
        </Section>

        <Section title="Marketing emails">
          <p>
            We only add you to our mailing list if you tick the box. Every marketing email has an
            unsubscribe link, and you can also email us to stop them. Unsubscribing doesn&rsquo;t
            affect the price email you already received.
          </p>
        </Section>

        <Section title="Who helps us run this">
          <p>
            We use a few trusted services to run the calculator: Vercel (hosting), Supabase (data
            storage) and Resend (sending email). They only use your information to provide their
            service to us. Some of them store data outside Canada, including in the United States,
            where it may be subject to local laws.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep your information while it&rsquo;s useful for the reasons above, or until you
            ask us to delete it.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask to see, correct or delete your information at any time by emailing{' '}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>. We&rsquo;ll reply
            within 30 days. If you&rsquo;re not happy with how we handled it, you can contact the
            Office of the Privacy Commissioner of Canada.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we change this policy, we&rsquo;ll update the date at the top of this page.
          </p>
        </Section>
      </main>
    </div>
  )
}

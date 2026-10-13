import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { priceEmail } from '@/lib/priceEmail'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://price.makrsmode.com'

type LeadBody = {
  email: string
  consent: boolean
  category: string
  retail: number
  cost: number
  marginPct: number
  wholesale: number
}

function num(v: unknown) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export async function POST(req: Request) {
  let raw: Partial<LeadBody>
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }

  const email = String(raw.email ?? '').trim().toLowerCase().slice(0, 254)
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 })
  }

  const lead: LeadBody = {
    email,
    consent: raw.consent === true,
    category: String(raw.category ?? 'other').slice(0, 40),
    retail: num(raw.retail),
    cost: num(raw.cost),
    marginPct: num(raw.marginPct),
    wholesale: num(raw.wholesale),
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  const supabase =
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
          auth: { persistSession: false },
        })
      : null

  // Each job runs independently: one failing (e.g. Resend hiccup) never blocks the others.
  const jobs: Record<string, PromiseLike<unknown>> = {}

  // 1. Save the row: market data + email backup + consent record (CASL).
  if (supabase) {
    jobs.save = supabase
      .from('leads')
      .insert({
        email: lead.email,
        consent: lead.consent,
        consent_text: lead.consent ? 'Yes, send me early access and the odd pricing tip' : null,
        category: lead.category,
        retail: lead.retail,
        cost: lead.cost,
        margin_pct: lead.marginPct,
        wholesale: lead.wholesale,
        user_agent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
      })
      .then(({ error }) => {
        if (error) throw error
      })
  }

  if (resend) {
    // 2. Send their price. Transactional, so it goes to everyone who asked for it.
    const { subject, html, text } = priceEmail({ ...lead, siteUrl: SITE_URL })
    jobs.email = resend.emails
      .send({
        from: process.env.RESEND_FROM ?? "Mak'rs Mode <hello@makrsmode.com>",
        to: lead.email,
        ...(process.env.RESEND_REPLY_TO ? { replyTo: process.env.RESEND_REPLY_TO } : {}),
        subject,
        html,
        text,
      })
      .then(({ error }) => {
        if (error) throw error
      })

    // 3. Marketing list: only people who ticked the box.
    if (lead.consent) {
      const segment = process.env.RESEND_SEGMENT_ID
      jobs.contact = resend.contacts
        .create({ email: lead.email, ...(segment ? { segments: [{ id: segment }] } : {}) })
        .then(({ error }) => {
          // Already on the list is fine.
          if (error && !/already exists/i.test(error.message)) throw error
        })
    }
  }

  const names = Object.keys(jobs)
  const results = await Promise.allSettled(Object.values(jobs))
  const failed = names.filter((_, i) => results[i].status === 'rejected')
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[lead] ${names[i]} failed:`, r.reason)
  })
  if (!names.length) console.warn('[lead] no RESEND_API_KEY / SUPABASE_* set; nothing saved', lead)

  return NextResponse.json({ ok: failed.length === 0, failed })
}

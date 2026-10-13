// The "here's your price" email sent from /api/lead. Copy approved by Kandis 2026-10-13.

type PriceEmailInput = {
  category: string
  retail: number
  cost: number
  marginPct: number
  wholesale: number
  siteUrl: string
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function priceEmail({ category, retail, cost, marginPct, wholesale, siteUrl }: PriceEmailInput) {
  const what = category.toLowerCase() === 'other' ? 'product' : category.toLowerCase()
  const subject = 'Your price is in.'
  const host = siteUrl.replace(/^https?:\/\//, '')

  const text = [
    `You priced your ${what} at $${retail}.`,
    '',
    "Here's the breakdown:",
    `Cost: $${cost.toFixed(2)}`,
    `Margin: ${marginPct}%`,
    `Wholesale: $${wholesale}`,
    '',
    "We hate math, but we did it. Want to tweak it? Run it again any time at",
    siteUrl,
    '',
    "Price your products the Mak'rs Way.",
  ].join('\n')

  const row = (label: string, value: string) => `
    <td style="padding:0 16px 0 0;">
      <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#1C4A4A;opacity:.6;">${label}</div>
      <div style="font-size:18px;font-weight:700;color:#1C4A4A;margin-top:2px;">${value}</div>
    </td>`

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F7F4F0;font-family:Inter,Helvetica,Arial,sans-serif;color:#1C4A4A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4F0;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="background:#F04D2A;border-radius:999px;padding:14px 24px;">
          <span style="color:#F7F4F0;font-weight:800;font-size:16px;letter-spacing:.04em;">MAK&rsquo;RS MODE</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:20px;padding:32px;margin-top:16px;display:block;">
          <p style="margin:0;font-size:16px;line-height:1.5;">You priced your ${esc(what)} at</p>
          <p style="margin:4px 0 0;font-size:48px;font-weight:800;color:#F04D2A;line-height:1.1;">$${retail}</p>
          <p style="margin:24px 0 8px;font-size:16px;">Here&rsquo;s the breakdown:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #E8E2D8;padding-top:12px;width:100%;">
            <tr>
              ${row('Cost', `$${cost.toFixed(2)}`)}
              ${row('Margin', `${marginPct}%`)}
              ${row('Wholesale', `$${wholesale}`)}
            </tr>
          </table>
          <p style="margin:28px 0 0;font-size:16px;line-height:1.5;">
            We hate math, but we did it. Want to tweak it? Run it again any time at
            <a href="${siteUrl}" style="color:#F04D2A;font-weight:700;">${host}</a>.
          </p>
          <p style="margin:24px 0 0;font-size:16px;font-weight:700;">Price your products the Mak&rsquo;rs Way.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  return { subject, html, text }
}

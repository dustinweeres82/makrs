import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Mak'rs Mode — Price your products the Mak'rs Way",
  description:
    "A free pricing calculator for handmade sellers. We hate math. So we did it for you. Plug in the numbers, get a price that actually pays you.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans bg-salt h-screen overflow-hidden">{children}</body>
    </html>
  )
}

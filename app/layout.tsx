import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-salt h-screen overflow-hidden">{children}</body>
    </html>
  )
}

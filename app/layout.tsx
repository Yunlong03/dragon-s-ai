import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from "@/components/navbar"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dragon C AI | Your Bridge to China\'s Robotics Revolution',
  description: 'Dragon C AI helps Western companies source, evaluate, and partner with Chinese robotics players. AI-powered advisory for sourcing, due diligence, and partnership facilitation in China\'s robotics ecosystem.',
  keywords: 'China robotics, Chinese robotics companies, robotics sourcing China, AI advisory, China AI market, robotics partnership China, due diligence China robotics',
  openGraph: {
    title: 'Dragon C AI | China Robotics Advisory',
    description: 'Source, evaluate, and partner with Chinese robotics players. AI-powered intelligence meets on-the-ground access.',
    type: 'website',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <div className="pt-16">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from "@/components/navbar"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dragon C | China Robotics & Physical AI Sourcing',
  description: 'We source, vet and manage Chinese robotics and physical-AI suppliers for Western companies, on the ground and in Chinese.',
  keywords: 'China robotics, Chinese robotics companies, robotics sourcing China, physical AI, China supplier due diligence, robotics quality control China, China robotics market intelligence',
  openGraph: {
    title: 'Dragon C | China Robotics & Physical AI Sourcing',
    description: 'We source, vet and manage Chinese robotics and physical-AI suppliers for Western companies, on the ground and in Chinese.',
    siteName: 'Dragon C',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
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
      </body>
    </html>
  )
}

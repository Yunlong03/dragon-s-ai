import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { TrackerClient } from "@/components/tracker/tracker-client"
import { TrackerStats } from "@/components/tracker-stats"
import { getCompanies } from "@/lib/companies"

const TITLE = "Deal Flow Tracker | Dragon C"
const DESCRIPTION =
  "Chinese robotics and physical-AI companies, profiled from Chinese-language sources, with our view on why each matters."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, siteName: "Dragon C", type: "website" },
}

export default function TrackerPage() {
  const companies = getCompanies()

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Deal Flow{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Tracker</span>
            </h1>
            <p className="mt-3 text-gray-300 max-w-xl">{DESCRIPTION}</p>
          </div>
          <TrackerStats />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Clients get specific supplier shortlists on request.{" "}
          <Link href="/#contact" className="text-[#00f0ff]/80 hover:text-[#00f0ff] hover:underline">
            Get in touch
          </Link>
        </p>

        <TrackerClient companies={companies} />
      </section>

      <Footer />
    </main>
  )
}

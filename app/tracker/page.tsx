import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { TrackerClient } from "@/components/tracker/tracker-client"
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
  const sectorCount = new Set(companies.map((c) => c.sector)).size

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="border border-[#00a8ff]/20 bg-[#0f0f19]/60 rounded-2xl p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Deal Flow{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Tracker</span>
          </h1>
          <p className="mt-3 text-gray-300 max-w-3xl">{DESCRIPTION}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {companies.length} companies profiled across {sectorCount} sectors. Clients get specific supplier
            shortlists on request:{" "}
            <Link href="/#contact" className="text-[#00f0ff] hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>

        <TrackerClient companies={companies} />
      </section>

      <Footer />
    </main>
  )
}

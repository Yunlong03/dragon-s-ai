import Link from "next/link"
import { ArrowRight, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadCompanies } from "@/lib/companies"

const COMPANIES_SCREENED = "200+"

export function TrackerPreviewSection() {
  // Row count of data/companies.csv, read at build time.
  const companiesProfiled = loadCompanies().length

  const stats = [
    { value: COMPANIES_SCREENED, label: "companies screened" },
    { value: String(companiesProfiled), label: "companies profiled" },
  ]

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#00a8ff]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00f0ff]/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 mb-6">
              <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-sm text-[#00f0ff]">Deal Flow Tracker</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Deal Flow{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">
                Tracker
              </span>
            </h2>

            <p className="text-lg text-gray-300 mb-4 leading-relaxed">
              Chinese robotics and physical-AI companies, profiled from Chinese-language sources, with our view on why each matters.
            </p>
            <p className="text-muted-foreground mb-8">Clients get specific supplier shortlists on request.</p>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#00a8ff] to-[#00f0ff] hover:from-[#00a8ff]/90 hover:to-[#00f0ff]/90 text-[#0a0a0f] font-semibold px-8 py-6 text-lg"
            >
              <Link href="/tracker">
                Explore the tracker
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-8 rounded-2xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

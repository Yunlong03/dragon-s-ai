import { loadCompanies } from "@/lib/companies"

const COMPANIES_SCREENED = "200+"

/** "200+ companies screened · N companies profiled" tiles; N is the CSV row count at build time. */
export function TrackerStats({ className = "" }: { className?: string }) {
  const stats = [
    { value: COMPANIES_SCREENED, label: "companies screened" },
    { value: String(loadCompanies().length), label: "companies profiled" },
  ]

  return (
    <div className={`grid grid-cols-2 gap-4 md:gap-6 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="p-6 md:p-8 rounded-2xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 text-center">
          <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

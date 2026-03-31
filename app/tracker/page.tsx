"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Footer } from "@/components/footer"

const STATS_URL =
  "https://dragon-deal-tracker--yunlong03.replit.app//api/stats"
const COMPANIES_URL =
  "https://dragon-deal-tracker--yunlong03.replit.app//api/companies"

type StatsResponse = {
  total: number
  by_sector: Record<string, number>
  by_funding_stage: Record<string, number>
}

type Company = {
  id: number
  name_en: string
  name_cn: string
  sector: string
  sub_sector?: string | null
  city: string
  funding_stage: string
  funding_total_m: number | null
  founded_year?: number | null
  employees_range?: string | null
  description?: string | null
  why_it_matters?: string | null
  key_products?: string | null
  product_status?: string | null
  website?: string | null
  source_urls?: string | null
  last_updated?: string | null
  [key: string]: unknown
}

type SortKey = "alpha" | "funding" | "founded"

function formatFunding(value: number | null | undefined) {
  if (value === null || value === undefined) return "N/A"
  if (Number.isNaN(value)) return "N/A"
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
}

function safeString(value: unknown) {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export default function DealFlowTrackerPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [sector, setSector] = useState<string>("")
  const [fundingStage, setFundingStage] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [sortKey, setSortKey] = useState<SortKey>("alpha")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")

  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companiesError, setCompaniesError] = useState<string | null>(null)

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 450)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setStatsLoading(true)
    setStatsError(null)

    ;(async () => {
      try {
        const res = await fetch(STATS_URL)
        if (!res.ok) throw new Error(`Stats fetch failed (${res.status})`)
        const data = (await res.json()) as StatsResponse
        if (cancelled) return
        setStats(data)
      } catch (e) {
        if (cancelled) return
        setStatsError(e instanceof Error ? e.message : "Failed to load stats")
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setCompaniesLoading(true)
    setCompaniesError(null)

    const params = new URLSearchParams()
    if (sector) params.set("sector", sector)
    if (fundingStage) params.set("funding_stage", fundingStage)
    if (debouncedSearch) params.set("q", debouncedSearch)

    const url = params.toString() ? `${COMPANIES_URL}?${params.toString()}` : COMPANIES_URL

    ;(async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Companies fetch failed (${res.status})`)
        const data = (await res.json()) as Company[]
        if (cancelled) return
        setCompanies(data ?? [])
      } catch (e) {
        if (cancelled) return
        setCompaniesError(e instanceof Error ? e.message : "Failed to load companies")
      } finally {
        if (!cancelled) setCompaniesLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sector, fundingStage, debouncedSearch])

  const sectors = useMemo(() => {
    if (!stats) return []
    return Object.keys(stats.by_sector).sort((a, b) => a.localeCompare(b))
  }, [stats])

  const fundingStages = useMemo(() => {
    if (!stats) return []
    return Object.keys(stats.by_funding_stage).sort((a, b) => a.localeCompare(b))
  }, [stats])

  const sectorsCount = stats ? Object.keys(stats.by_sector).length : 0

  const sortedCompanies = useMemo(() => {
    const copy = [...companies]

    if (sortKey === "alpha") {
      copy.sort((a, b) => (a.name_en ?? "").localeCompare(b.name_en ?? ""))
      return copy
    }

    if (sortKey === "funding") {
      copy.sort((a, b) => {
        const av = a.funding_total_m ?? 0
        const bv = b.funding_total_m ?? 0
        return bv - av
      })
      return copy
    }

    copy.sort((a, b) => {
      const av = a.founded_year ?? 0
      const bv = b.founded_year ?? 0
      return bv - av
    })
    return copy
  }, [companies, sortKey])

  const modalEntries = useMemo(() => {
    if (!selectedCompany) return []

    const preferredOrder = [
      "id",
      "name_en",
      "name_cn",
      "sector",
      "sub_sector",
      "city",
      "founded_year",
      "employees_range",
      "funding_stage",
      "funding_total_m",
      "description",
      "why_it_matters",
      "key_products",
      "product_status",
      "website",
      "source_urls",
      "last_updated",
    ] as const

    const entries = Object.entries(selectedCompany) as [string, unknown][]
    const byKey = new Map(entries.map(([k, v]) => [k, v]))

    const ordered: [string, unknown][] = []
    for (const key of preferredOrder) {
      if (byKey.has(key)) ordered.push([key, byKey.get(key)])
    }
    for (const [k, v] of entries) {
      if (!preferredOrder.includes(k as never)) ordered.push([k, v])
    }
    return ordered
  }, [selectedCompany])

  function openDetails(company: Company) {
    setSelectedCompany(company)
    setDetailsOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <div className="border border-[#00a8ff]/20 bg-[#0f0f19]/60 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Dashboard</div>
              <div className="text-white text-lg md:text-xl font-semibold">
                {statsLoading ? "Loading tracking metrics..." : `Tracking ${stats?.total ?? 0} companies across ${sectorsCount} sectors`}
              </div>
              {statsError ? <div className="text-red-400 text-sm mt-1">{statsError}</div> : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                <span className="text-sm text-muted-foreground">Live API data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-[#00a8ff]/20 bg-[#0f0f19]/60 rounded-2xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Sector</label>
              <select
                className="w-full h-10 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                    {stats?.by_sector?.[s] !== undefined ? ` (${stats.by_sector[s]})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Funding Stage</label>
              <select
                className="w-full h-10 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
                value={fundingStage}
                onChange={(e) => setFundingStage(e.target.value)}
              >
                <option value="">All Stages</option>
                {fundingStages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                    {stats?.by_funding_stage?.[s] !== undefined ? ` (${stats.by_funding_stage[s]})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Search</label>
              <input
                type="text"
                className="w-full h-10 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="lg:w-52">
              <label className="block text-xs text-muted-foreground mb-2">Sort</label>
              <select
                className="w-full h-10 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
              >
                <option value="alpha">Alphabetical</option>
                <option value="funding">Funding Amount</option>
                <option value="founded">Founded Year</option>
              </select>
            </div>
          </div>

          {(companiesLoading || companiesError) && (
            <div className="mt-4 text-sm text-muted-foreground">
              {companiesLoading ? "Loading companies..." : null}
              {companiesError ? <span className="text-red-400">{companiesError}</span> : null}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {sortedCompanies.length === 0 ? "No matching companies." : `Showing ${sortedCompanies.length} companies.`}
          </div>
          <button
            type="button"
            className="text-xs text-[#00f0ff]/90 hover:text-[#00f0ff] transition-colors"
            onClick={() => {
              setSector("")
              setFundingStage("")
              setSearch("")
              setSortKey("alpha")
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCompanies.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => openDetails(c)}
              className="text-left rounded-2xl border border-[#00a8ff]/20 bg-[#0f0f19] p-5 hover:border-[#00a8ff]/50 hover:bg-[#0a0a0f] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold text-base leading-tight">{c.name_en}</div>
                  <div className="text-[#00f0ff]/90 text-sm mt-1">{c.name_cn}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {c.funding_stage ? (
                    <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-1 text-[#00f0ff]">
                      {c.funding_stage}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#00a8ff]/10 px-3 py-1 text-xs text-[#00f0ff]">
                  {c.sector}
                </span>
                {c.city ? (
                  <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-1 text-xs text-muted-foreground">
                    {c.city}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Funding total:{" "}
                <span className="text-white font-medium">{formatFunding(c.funding_total_m)}</span>
              </div>
              {c.founded_year ? (
                <div className="mt-1 text-sm text-muted-foreground">
                  Founded: <span className="text-white font-medium">{c.founded_year}</span>
                </div>
              ) : null}

              {c.description ? (
                <div className="mt-3 text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                  {c.description}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl bg-[#0a0a0f] border border-[#00a8ff]/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedCompany?.name_en ?? "Company"}{" "}
              {selectedCompany?.name_cn ? (
                <span className="text-sm font-normal text-[#00f0ff]/90">({selectedCompany.name_cn})</span>
              ) : null}
            </DialogTitle>
            <DialogDescription>
              {selectedCompany?.sector ? (
                <span className="text-[#00f0ff]/90">{selectedCompany.sector}</span>
              ) : null}
              {selectedCompany?.city ? ` · ${selectedCompany.city}` : ""}
              {selectedCompany?.funding_stage ? ` · ${selectedCompany.funding_stage}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCompany?.sector ? (
              <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#00a8ff]/10 px-3 py-1 text-xs text-[#00f0ff]">
                {selectedCompany.sector}
              </span>
            ) : null}
            {selectedCompany?.funding_stage ? (
              <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-1 text-xs text-[#00f0ff]">
                {selectedCompany.funding_stage}
              </span>
            ) : null}
            {selectedCompany?.city ? (
              <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-1 text-xs text-muted-foreground">
                {selectedCompany.city}
              </span>
            ) : null}
            {selectedCompany?.funding_total_m !== undefined ? (
              <span className="inline-flex items-center rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 py-1 text-xs text-white">
                {formatFunding(selectedCompany.funding_total_m)}
              </span>
            ) : null}
            {selectedCompany?.website ? (
              <a
                href={safeString(selectedCompany.website)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-3 py-1 text-xs text-[#00f0ff] hover:bg-[#00a8ff]/20 transition-colors"
              >
                Website
              </a>
            ) : null}
          </div>

          <div className="mt-5 max-h-[70vh] overflow-auto pr-1">
            <div className="flex flex-col gap-4">
              {selectedCompany?.description ? (
                <div className="rounded-xl border border-[#00a8ff]/20 bg-[#0f0f19] p-4">
                  <div className="text-xs text-muted-foreground">description</div>
                  <div className="text-sm text-white mt-2 whitespace-pre-wrap">
                    {selectedCompany.description}
                  </div>
                </div>
              ) : null}

              {selectedCompany?.why_it_matters ? (
                <div className="rounded-xl border border-[#00a8ff]/20 bg-[#0f0f19] p-4 border-l-2 border-l-[#00a8ff]">
                  <div className="text-xs text-muted-foreground">why_it_matters</div>
                  <div className="text-sm text-white mt-2 whitespace-pre-wrap">
                    {selectedCompany.why_it_matters}
                  </div>
                </div>
              ) : null}

              <div className="rounded-xl border border-[#00a8ff]/20 bg-[#0f0f19] p-4">
                <div className="text-xs text-muted-foreground mb-2">All fields</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {modalEntries
                    .filter(([k]) => !["source_urls", "description", "why_it_matters"].includes(k))
                    .map(([k, v]) => {
                      const renderedWebsite =
                        k === "website" && typeof v === "string" && v.length > 0 ? (
                          <a
                            href={v}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors break-all"
                          >
                            {v}
                          </a>
                        ) : null

                      const valueNode =
                        renderedWebsite ?? (
                          <span className={safeString(v) ? "text-white break-all" : "text-muted-foreground"}>
                            {safeString(v) || "N/A"}
                          </span>
                        )

                      return (
                        <div
                          key={k}
                          className="rounded-xl border border-[#00a8ff]/10 bg-[#0a0a0f] p-3"
                        >
                          <div className="text-xs text-muted-foreground mb-1">{k}</div>
                          <div className="text-sm">{valueNode}</div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}


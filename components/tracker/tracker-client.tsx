"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Shuffle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Company } from "@/lib/companies"

type SortKey = "name" | "founded" | "funding"
type FacetKey = "sector" | "stage" | "city"
type Filters = Record<FacetKey, string> & { q: string; sort: SortKey }

const DEFAULT_FILTERS: Filters = { sector: "", stage: "", city: "", q: "", sort: "name" }

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name (A–Z)" },
  { value: "founded", label: "Founded (newest first)" },
  { value: "funding", label: "Funding (highest first)" },
]

// Funding stages in deal order; anything unknown sorts after these, alphabetically.
const STAGE_ORDER = ["Seed", "Angel", "Pre-A", "Series A", "Series B", "Series C", "Series D+", "Pre-IPO", "Public"]

const FACETS: { key: FacetKey; label: string; all: string; field: (c: Company) => string }[] = [
  { key: "sector", label: "Sector", all: "All sectors", field: (c) => c.sector },
  { key: "stage", label: "Funding stage", all: "All stages", field: (c) => c.fundingStage },
  { key: "city", label: "City", all: "All cities", field: (c) => c.city },
]

// Unfiltered view: a random sample of 4 cards on phones, 6 on tablets, 8 on laptops and up.
const SAMPLE_SIZE = 8
function sampleVisibility(i: number) {
  if (i >= 6) return "hidden lg:block"
  if (i >= 4) return "hidden md:block"
  return ""
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** New random sample, preferring companies not in the previous one. */
function pickSample(all: Company[], previous: Company[] | null) {
  const prev = new Set(previous?.map((c) => c.id))
  const fresh = shuffle(all.filter((c) => !prev.has(c.id)))
  const seen = shuffle(all.filter((c) => prev.has(c.id)))
  return [...fresh, ...seen].slice(0, SAMPLE_SIZE)
}

const CONTROL =
  "w-full h-10 rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00a8ff]/60"

function sortOptions(key: FacetKey, values: string[]) {
  if (key !== "stage") return values.sort((a, b) => a.localeCompare(b, "en"))
  const rank = (v: string) => (STAGE_ORDER.includes(v) ? STAGE_ORDER.indexOf(v) : STAGE_ORDER.length)
  return values.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "en"))
}

function searchText(c: Company) {
  return [c.nameEn, c.nameCn, c.sector, c.subSector, c.city, c.fundingStage, c.keyProducts, c.description, c.whyItMatters]
    .join(" ")
    .toLowerCase()
}

/** Larger first, missing values last. */
function compareDesc(a: number | null, b: number | null) {
  if (a === null) return b === null ? 0 : 1
  if (b === null) return -1
  return b - a
}

function readFiltersFromUrl(options: Record<FacetKey, string[]>): Filters {
  const params = new URLSearchParams(window.location.search)
  const pick = (key: FacetKey) => {
    const v = params.get(key) ?? ""
    return options[key].includes(v) ? v : ""
  }
  const sort = params.get("sort")
  return {
    sector: pick("sector"),
    stage: pick("stage"),
    city: pick("city"),
    q: params.get("q") ?? "",
    sort: sort === "founded" || sort === "funding" ? sort : "name",
  }
}

function writeFiltersToUrl(filters: Filters) {
  const params = new URLSearchParams()
  for (const key of ["sector", "stage", "city", "q"] as const) {
    if (filters[key]) params.set(key, filters[key])
  }
  if (filters.sort !== "name") params.set("sort", filters.sort)
  const qs = params.toString()
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  if (url !== window.location.pathname + window.location.search) {
    window.history.replaceState(null, "", url)
  }
}

export function TrackerClient({ companies }: { companies: Company[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [urlLoaded, setUrlLoaded] = useState(false)
  // Picked after mount only, so server and client render the same HTML (no hydration mismatch).
  const [sample, setSample] = useState<Company[] | null>(null)
  const [selected, setSelected] = useState<Company | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const index = useMemo(() => new Map(companies.map((c) => [c.id, searchText(c)])), [companies])

  const allOptions = useMemo(() => {
    const out = {} as Record<FacetKey, string[]>
    for (const facet of FACETS) {
      out[facet.key] = sortOptions(facet.key, [...new Set(companies.map(facet.field))])
    }
    return out
  }, [companies])

  // Once mounted: apply URL filters, pick the random sample, then keep the URL in sync.
  useEffect(() => {
    setFilters(readFiltersFromUrl(allOptions))
    setSample(pickSample(companies, null))
    setUrlLoaded(true)
  }, [allOptions, companies])

  useEffect(() => {
    if (urlLoaded) writeFiltersToUrl(filters)
  }, [filters, urlLoaded])

  const query = filters.q.trim().toLowerCase()

  function matches(c: Company, skip?: FacetKey) {
    for (const facet of FACETS) {
      if (facet.key !== skip && filters[facet.key] && facet.field(c) !== filters[facet.key]) return false
    }
    return !query || (index.get(c.id) ?? "").includes(query)
  }

  // Each facet's counts reflect every other active filter (and the search), but not itself.
  const facetCounts = FACETS.map((facet) => {
    const pool = companies.filter((c) => matches(c, facet.key))
    return {
      ...facet,
      options: allOptions[facet.key].map((value) => ({
        value,
        count: pool.filter((c) => facet.field(c) === value).length,
      })),
    }
  })

  function bySort(a: Company, b: Company) {
    const byName = a.nameEn.localeCompare(b.nameEn, "en")
    if (filters.sort === "founded") return compareDesc(a.foundedYear, b.foundedYear) || byName
    if (filters.sort === "funding") return compareDesc(a.fundingTotalM, b.fundingTotalM) || byName
    return byName
  }

  const isFiltered = Boolean(filters.sector || filters.stage || filters.city || query)
  const results = isFiltered ? companies.filter((c) => matches(c)).sort(bySort) : []
  const shown = isFiltered ? results : sample ? [...sample].sort(bySort) : null

  function update(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }))
  }

  function openDetails(c: Company) {
    setSelected(c)
    setDetailsOpen(true)
  }

  return (
    <>
      <div className="mt-6 border border-[#00a8ff]/20 bg-[#0f0f19]/60 rounded-2xl p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="tracker-search" className="block text-xs text-muted-foreground mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="tracker-search"
                type="search"
                className={`${CONTROL} pl-9`}
                placeholder="Name, product, city…"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
              />
            </div>
          </div>

          {facetCounts.map((facet) => (
            <div key={facet.key}>
              <label htmlFor={`tracker-${facet.key}`} className="block text-xs text-muted-foreground mb-2">
                {facet.label}
              </label>
              <select
                id={`tracker-${facet.key}`}
                className={CONTROL}
                value={filters[facet.key]}
                onChange={(e) => update({ [facet.key]: e.target.value })}
              >
                <option value="">{facet.all}</option>
                {facet.options.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.count === 0 && o.value !== filters[facet.key]}>
                    {o.value} ({o.count})
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label htmlFor="tracker-sort" className="block text-xs text-muted-foreground mb-2">
              Sort by
            </label>
            <select
              id="tracker-sort"
              className={CONTROL}
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {isFiltered
            ? results.length === 0
              ? "No companies match these filters."
              : `Showing ${results.length} of ${companies.length} companies`
            : `A random selection of our ${companies.length} profiled companies. Use the filters or search to find any of them.`}
        </p>
        {isFiltered ? (
          <button
            type="button"
            className="text-sm text-[#00f0ff]/90 hover:text-[#00f0ff] transition-colors"
            onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))}
          >
            Clear filters
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00a8ff]/30 px-3 py-1.5 text-sm text-[#00f0ff] hover:bg-[#00a8ff]/10 transition-colors"
            onClick={() => setSample((prev) => pickSample(companies, prev))}
          >
            <Shuffle className="w-4 h-4" />
            Show other companies
          </button>
        )}
      </div>

      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shown === null
          ? // Placeholders until the random sample is picked on the client.
            Array.from({ length: SAMPLE_SIZE }, (_, i) => (
              <li key={i} aria-hidden="true" className={sampleVisibility(i)}>
                <div className="h-56 rounded-2xl border border-[#00a8ff]/10 bg-[#0f0f19] animate-pulse motion-reduce:animate-none" />
              </li>
            ))
          : shown.map((c, i) => (
              <li key={c.id} className={isFiltered ? "" : sampleVisibility(i)}>
                <CompanyCard company={c} onOpen={() => openDetails(c)} />
              </li>
            ))}
      </ul>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90dvh] overflow-y-auto bg-[#0a0a0f] border-[#00a8ff]/20">
          {selected ? <CompanyDetails company={selected} /> : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function CompanyCard({ company: c, onOpen }: { company: Company; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="h-full w-full flex flex-col text-left rounded-2xl border border-[#00a8ff]/20 bg-[#0f0f19] p-5 hover:border-[#00a8ff]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a8ff]/60 transition-colors"
    >
      <div className="text-white font-semibold leading-tight">{c.nameEn}</div>
      <div className="text-[#00f0ff]/90 text-sm mt-1">{c.nameCn}</div>
      <span className="mt-3 self-start rounded-xl border border-[#00a8ff]/20 bg-[#0a0a0f] px-2.5 py-1 text-xs text-[#00f0ff] whitespace-nowrap">
        {c.fundingStage}
      </span>
      <div className="mt-3 text-sm text-gray-300">
        {c.sector} · {c.subSector}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {c.city}
        {c.foundedYear ? ` · Founded ${c.foundedYear}` : ""} · <span className="text-white">{c.fundingLabel}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
    </button>
  )
}

function CompanyDetails({ company: c }: { company: Company }) {
  const facts: [string, string][] = [
    ["Sector", c.sector],
    ["Sub-sector", c.subSector],
    ["City", c.city],
    ["Founded", c.foundedYear ? String(c.foundedYear) : "—"],
    ["Funding stage", c.fundingStage || "—"],
    ["Total funding", c.fundingLabel],
    ["Product status", c.productStatus || "—"],
  ]
  const sections: [string, string][] = [
    ["Key products", c.keyProducts],
    ["About", c.description],
    ["Why it matters", c.whyItMatters],
  ]

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white text-xl pr-8">{c.nameEn}</DialogTitle>
        <DialogDescription className="text-[#00f0ff]/90">{c.nameCn}</DialogDescription>
      </DialogHeader>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#00a8ff]/10 bg-[#0f0f19] p-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm text-white mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        {sections
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <section
              key={label}
              className={`rounded-xl border border-[#00a8ff]/20 bg-[#0f0f19] p-4 ${label === "Why it matters" ? "border-l-2 border-l-[#00a8ff]" : ""}`}
            >
              <h3 className="text-xs text-muted-foreground">{label}</h3>
              <p className="text-sm text-white mt-2 whitespace-pre-wrap">{value}</p>
            </section>
          ))}
      </div>
    </>
  )
}

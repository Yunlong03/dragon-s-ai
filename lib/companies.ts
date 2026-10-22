import { readFileSync } from "node:fs"
import path from "node:path"

// Columns the site shows. data/companies.csv must contain all of them (extra columns are ignored).
export const COMPANY_COLUMNS = [
  "name_en",
  "name_cn",
  "sector",
  "sub_sector",
  "city",
  "founded_year",
  "funding_stage",
  "funding_total_m",
  "product_status",
  "key_products",
  "description",
  "why_it_matters",
] as const

export type CompanyColumn = (typeof COMPANY_COLUMNS)[number]
export type CompanyRow = Record<CompanyColumn, string>

const CSV_PATH = path.join(process.cwd(), "data", "companies.csv")

/**
 * Minimal RFC 4180 parser: quoted fields may contain commas, newlines and "" escapes.
 * Accepts LF or CRLF line endings and strips a leading UTF-8 BOM.
 */
export function parseCsv(text: string): string[][] {
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"' && field === "") {
      inQuotes = true
    } else if (ch === ",") {
      row.push(field)
      field = ""
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += ch
    }
  }

  if (inQuotes) throw new Error("CSV ends inside a quoted field")
  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  // Drop blank lines (a single empty field).
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""))
}

/** Parses the companies CSV, failing loudly on missing columns or ragged rows. */
export function parseCompanies(text: string, source = "data/companies.csv"): CompanyRow[] {
  const [header, ...records] = parseCsv(text)
  if (!header) throw new Error(`${source} is empty`)

  const names = header.map((h) => h.trim())
  const missing = COMPANY_COLUMNS.filter((c) => !names.includes(c))
  if (missing.length > 0) {
    throw new Error(`${source} is missing required column(s): ${missing.join(", ")}`)
  }

  return records.map((fields, i) => {
    if (fields.length !== names.length) {
      throw new Error(
        `${source} line ${i + 2}: expected ${names.length} fields, found ${fields.length}`,
      )
    }
    const row = {} as CompanyRow
    for (const col of COMPANY_COLUMNS) {
      row[col] = fields[names.indexOf(col)].trim()
    }
    return row
  })
}

let cache: CompanyRow[] | null = null

/** Reads data/companies.csv once per process (at build time for static pages). */
export function loadCompanies(): CompanyRow[] {
  cache ??= parseCompanies(readFileSync(CSV_PATH, "utf8"))
  return cache
}

/** What the tracker UI receives: display-ready, serialisable, no hidden columns. */
export type Company = {
  id: string
  nameEn: string
  nameCn: string
  sector: string
  subSector: string
  city: string
  foundedYear: number | null
  fundingStage: string
  fundingTotalM: number | null
  fundingLabel: string
  productStatus: string
  keyProducts: string
  description: string
  whyItMatters: string
}

/** "Singapore (founded in Beijing)" -> "Singapore" */
export function normaliseCity(city: string): string {
  return city.replace(/\s*\(founded in [^)]*\)\s*$/i, "")
}

export function formatFunding(millions: number | null): string {
  return millions === null ? "—" : `US$ ${millions.toLocaleString("en-US")} M`
}

function parseNumber(value: string, column: CompanyColumn, name: string): number | null {
  if (value === "") return null
  const n = Number(value)
  if (!Number.isFinite(n)) {
    throw new Error(`data/companies.csv: ${column} for "${name}" is not a number: "${value}"`)
  }
  return n
}

export function getCompanies(): Company[] {
  return loadCompanies().map((row, i) => {
    const fundingTotalM = parseNumber(row.funding_total_m, "funding_total_m", row.name_en)
    return {
      id: String(i),
      nameEn: row.name_en,
      nameCn: row.name_cn,
      sector: row.sector,
      subSector: row.sub_sector,
      city: normaliseCity(row.city),
      foundedYear: parseNumber(row.founded_year, "founded_year", row.name_en),
      fundingStage: row.funding_stage,
      fundingTotalM,
      fundingLabel: formatFunding(fundingTotalM),
      productStatus: row.product_status,
      keyProducts: row.key_products,
      description: row.description,
      whyItMatters: row.why_it_matters,
    }
  })
}

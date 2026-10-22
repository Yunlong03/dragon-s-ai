// Shared by the contact form (client) and POST /api/contact (server). No Node-only imports here.

export const CONTACT_EMAIL = "contact@dragonc.hk"

export const INTERESTS = [
  "Sourcing & quality control",
  "Market intelligence",
  "Representation",
  "Due diligence",
  "Other",
] as const

export type Interest = (typeof INTERESTS)[number]

/** Hidden field that only bots fill in. */
export const HONEYPOT_FIELD = "fax"

export const LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  website: 200,
  messenger: 100,
  message: 5000,
} as const

export type ContactInput = {
  name: string
  email: string
  company: string
  website: string
  messenger: string
  interest: Interest
  message: string
}

export type ContactField = keyof ContactInput
export type FieldErrors = Partial<Record<ContactField, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown, singleLine: boolean): string {
  if (typeof value !== "string") return ""
  const s = value.trim()
  // Single-line fields end up in mail headers (subject, reply-to); never let line breaks through.
  return singleLine ? s.replace(/[\r\n]+/g, " ") : s
}

export function validateContact(
  raw: unknown,
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const data = {
    name: str(body.name, true),
    email: str(body.email, true),
    company: str(body.company, true),
    website: str(body.website, true),
    messenger: str(body.messenger, true),
    interest: str(body.interest, true) as Interest,
    message: str(body.message, false),
  }

  const errors: FieldErrors = {}
  if (!data.name) errors.name = "Please enter your name."
  if (!data.email) errors.email = "Please enter your work email."
  else if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address."
  if (!data.company) errors.company = "Please enter your company."
  if (!INTERESTS.includes(data.interest)) errors.interest = "Please choose an interest."
  if (!data.message) errors.message = "Please enter a message."

  for (const field of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (!errors[field] && data[field].length > LIMITS[field]) {
      errors[field] = `Please keep this under ${LIMITS[field]} characters.`
    }
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data }
}

import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { HONEYPOT_FIELD, validateContact, type ContactInput } from "@/lib/contact"

export const runtime = "nodejs"

// All mail settings come from these environment variables only. Their values are never logged or returned.
const ENV_KEYS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const

function readSmtpConfig() {
  const env = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]?.trim() ?? ""])) as Record<
    (typeof ENV_KEYS)[number],
    string
  >
  if (ENV_KEYS.some((k) => !env[k])) return null
  const port = Number(env.SMTP_PORT)
  if (!Number.isInteger(port) || port <= 0) return null
  return { host: env.SMTP_HOST, port, user: env.SMTP_USER, pass: env.SMTP_PASS, to: env.CONTACT_TO }
}

// Basic in-memory rate limit per IP: resets on restart and is per process, which is enough for a contact form.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }
  return recent.length > MAX_PER_WINDOW
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
}

function formatBody(d: ContactInput) {
  return [
    `Name: ${d.name}`,
    `Work email: ${d.email}`,
    `Company: ${d.company}`,
    `Company website: ${d.website || "—"}`,
    `WhatsApp / WeChat: ${d.messenger || "—"}`,
    `Interest: ${d.interest}`,
    "",
    "Message:",
    d.message,
  ].join("\n")
}

export async function POST(req: Request) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  // Honeypot hit: pretend it worked, send nothing.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT_FIELD]
  if (typeof trap === "string" && trap.trim() !== "") {
    return NextResponse.json({ ok: true })
  }

  const result = validateContact(body)
  if (!result.ok) {
    return NextResponse.json({ error: "invalid", errors: result.errors }, { status: 400 })
  }

  const smtp = readSmtpConfig()
  if (!smtp) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }

  const d = result.data
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // implicit TLS on 465; otherwise upgrade with STARTTLS
      requireTLS: smtp.port !== 465,
      auth: { user: smtp.user, pass: smtp.pass },
    })
    await transporter.sendMail({
      from: { name: "Dragon C website", address: smtp.user },
      to: smtp.to,
      replyTo: { name: d.name, address: d.email },
      subject: `Website enquiry: ${d.interest} – ${d.company}`,
      text: formatBody(d),
    })
  } catch (error) {
    // Log only the error code (e.g. EAUTH, ECONNECTION), never the message, config or credentials.
    const code = (error as { code?: unknown })?.code
    console.error(`Contact form: sending failed (${typeof code === "string" ? code : "unknown"})`)
    return NextResponse.json({ error: "send_failed" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

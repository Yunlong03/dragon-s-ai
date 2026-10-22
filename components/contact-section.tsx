"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle, Mail } from "lucide-react"
import {
  CONTACT_EMAIL,
  HONEYPOT_FIELD,
  INTERESTS,
  LIMITS,
  type ContactField,
  type FieldErrors,
} from "@/lib/contact"

type Status = "idle" | "submitting" | "success" | "fallback"

const EMPTY_FORM: Record<ContactField | typeof HONEYPOT_FIELD, string> = {
  name: "",
  email: "",
  company: "",
  website: "",
  messenger: "",
  interest: "",
  message: "",
  [HONEYPOT_FIELD]: "",
}

const FIELD_CLASS =
  "bg-[#1a1a2e] border-[#00a8ff]/30 text-white placeholder:text-muted-foreground focus:border-[#00a8ff] focus:ring-[#00a8ff]/20"

export function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<Status>("idle")
  const [errors, setErrors] = useState<FieldErrors>({})

  function set(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field as ContactField]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("submitting")
    setErrors({})
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        return
      }
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { errors?: FieldErrors } | null
        if (data?.errors && Object.keys(data.errors).length > 0) {
          setErrors(data.errors)
          setStatus("idle")
          return
        }
      }
      // Missing mail settings (503), send failure (502), rate limit (429) or anything else.
      setStatus("fallback")
    } catch {
      setStatus("fallback")
    }
  }

  function field(id: ContactField, label: string, input: React.ReactNode) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-white">
          {label}
        </Label>
        {input}
        {errors[id] ? (
          <p id={`${id}-error`} className="text-sm text-red-400">
            {errors[id]}
          </p>
        ) : null}
      </div>
    )
  }

  function inputProps(id: ContactField) {
    return {
      id,
      name: id,
      value: form[id],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(id, e.target.value),
      "aria-invalid": errors[id] ? true : undefined,
      "aria-describedby": errors[id] ? `${id}-error` : undefined,
      maxLength: id in LIMITS ? LIMITS[id as keyof typeof LIMITS] : undefined,
    }
  }

  return (
    <section id="contact" className="py-24 relative scroll-mt-16">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00a8ff]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Touch</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Ready to explore China&apos;s robotics opportunities? Let&apos;s start a conversation.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="p-8 md:p-10 rounded-3xl bg-[#0f0f19]/90 border border-[#00a8ff]/20 backdrop-blur-sm">
            {status === "success" ? (
              <div className="text-center py-8" role="status">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <p className="text-xl font-semibold text-white">Thank you. We&apos;ll get back to you shortly.</p>
              </div>
            ) : status === "fallback" ? (
              <div className="text-center py-8" role="alert">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#00a8ff]/20 border border-[#00a8ff]/30 flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <p className="text-xl font-semibold text-white">
                  Please email us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00f0ff] hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {field("name", "Name*", <Input {...inputProps("name")} autoComplete="name" required className={FIELD_CLASS} />)}
                  {field(
                    "email",
                    "Work email*",
                    <Input {...inputProps("email")} type="email" autoComplete="email" required className={FIELD_CLASS} />,
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {field(
                    "company",
                    "Company*",
                    <Input {...inputProps("company")} autoComplete="organization" required className={FIELD_CLASS} />,
                  )}
                  {field(
                    "website",
                    "Company website (optional)",
                    <Input {...inputProps("website")} autoComplete="url" placeholder="example.com" className={FIELD_CLASS} />,
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {field(
                    "messenger",
                    "WhatsApp or WeChat (optional)",
                    <Input {...inputProps("messenger")} className={FIELD_CLASS} />,
                  )}
                  {field(
                    "interest",
                    "Interest*",
                    <select
                      id="interest"
                      name="interest"
                      required
                      value={form.interest}
                      onChange={(e) => set("interest", e.target.value)}
                      aria-invalid={errors.interest ? true : undefined}
                      aria-describedby={errors.interest ? "interest-error" : undefined}
                      className={`w-full h-9 rounded-md border px-3 text-sm outline-none focus:ring-2 ${FIELD_CLASS}`}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {INTERESTS.map((interest) => (
                        <option key={interest} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </select>,
                  )}
                </div>

                {field(
                  "message",
                  "Message*",
                  <Textarea {...inputProps("message")} required rows={5} className={FIELD_CLASS} />,
                )}

                {/* Honeypot: hidden from people and assistive tech; bots that fill it are silently dropped. */}
                <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                  <label htmlFor={HONEYPOT_FIELD}>Fax</label>
                  <input
                    id={HONEYPOT_FIELD}
                    name={HONEYPOT_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form[HONEYPOT_FIELD]}
                    onChange={(e) => set(HONEYPOT_FIELD, e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "submitting"}
                    className="w-full bg-gradient-to-r from-[#00a8ff] to-[#00f0ff] hover:from-[#00a8ff]/90 hover:to-[#00f0ff]/90 text-[#0a0a0f] font-semibold py-6"
                  >
                    {status === "submitting" ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Inquiry
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    We use your details only to reply to your enquiry. See our{" "}
                    <Link href="/privacy" className="underline hover:text-white">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

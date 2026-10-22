import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { CONTACT_EMAIL } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Privacy Policy | Dragon C",
  description: "How Dragon C handles personal data sent through its website and by email.",
}

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00a8ff] hover:text-[#00f0ff]">
    {CONTACT_EMAIL}
  </a>
)

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who we are.",
    body: <>Dragon C is a brand of Dragon Caravan Limited, a company incorporated in Hong Kong. Contact: {mail}.</>,
  },
  {
    title: "2. Our commitment.",
    body: (
      <>
        We handle personal data in line with the Hong Kong Personal Data (Privacy) Ordinance (Cap. 486) and, for
        visitors in the European Union, the EU General Data Protection Regulation (GDPR).
      </>
    ),
  },
  {
    title: "3. What we collect.",
    body: (
      <>
        Only what you send us through the contact form or by email: your name, work email, company, company website,
        an optional WhatsApp or WeChat handle, your area of interest and your message. Fields marked * are needed for us
        to reply.
      </>
    ),
  },
  {
    title: "4. Why we use it.",
    body: (
      <>
        To reply to your enquiry and, if you wish, to discuss and provide our services. For EU visitors, the legal basis
        is your request (steps before a possible contract) and our legitimate interest in answering business enquiries.
        We do not add you to marketing lists, sell your data, or share it with others for their marketing.
      </>
    ),
  },
  {
    title: "5. Who handles it.",
    body: (
      <>
        Our email service provider (based in Switzerland) and our website hosting provider process this data on our
        behalf. Your data may therefore be processed in Hong Kong, Switzerland and other places where these providers
        operate, which may not offer the same level of protection as your home country. We use providers with strong
        security practices.
      </>
    ),
  },
  {
    title: "6. How long we keep it.",
    body: <>Up to 24 months after our last contact, unless an ongoing business relationship requires longer.</>,
  },
  {
    title: "7. Security.",
    body: <>Data is encrypted in transit (HTTPS for the website, TLS for email).</>,
  },
  {
    title: "8. Your rights.",
    body: (
      <>
        You can ask to access or correct your personal data. Visitors in the EU can also ask for erasure, restriction,
        portability, or object to processing, and may complain to their local data protection authority. Write to{" "}
        {mail}. We may need to confirm your identity first.
      </>
    ),
  },
  {
    title: "9. Visiting this website.",
    body: (
      <>
        We use no tracking or analytics cookies. Our hosting provider may keep standard technical logs (such as IP
        address, time and page requested) for security and reliability.
      </>
    ),
  },
  {
    title: "10. Changes.",
    body: <>We may update this policy. The date above shows the latest version.</>,
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <article className="container mx-auto px-4 py-12 md:py-16 max-w-3xl flex-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 21 October 2026</p>

        <div className="mt-8 space-y-5 text-sm md:text-base leading-relaxed text-gray-300">
          {sections.map((s) => (
            <p key={s.title}>
              <strong className="text-white font-semibold">{s.title}</strong> {s.body}
            </p>
          ))}
        </div>
      </article>
      <Footer />
    </main>
  )
}

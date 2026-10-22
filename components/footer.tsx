import Image from "next/image"
import Link from "next/link"
import { CONTACT_EMAIL } from "@/lib/contact"

export function Footer() {
  return (
    <footer className="py-8 border-t border-[#00a8ff]/10 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-small.png" alt="Dragon C logo" width={28} height={32} />
              <span className="text-white font-semibold">Dragon C</span>
            </div>
            <span className="text-muted-foreground text-sm">A Dragon Caravan company</span>
          </div>

          {/* Contact */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-[#00a8ff] hover:text-[#00f0ff] transition-colors"
          >
            {CONTACT_EMAIL}
          </a>

          {/* Legal */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&copy; 2026 Dragon C</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

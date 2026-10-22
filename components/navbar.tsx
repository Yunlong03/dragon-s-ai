"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/tracker", label: "Deal Flow Tracker" },
  { href: "/#contact", label: "Contact" },
] as const

const MOBILE_MENU_ID = "mobile-menu"

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logo-small.png" alt="Dragon C logo" width={32} height={36} className="shrink-0" />
      <span className="text-white font-semibold tracking-wide">Dragon C</span>
    </div>
  )
}

function NavLink({
  href,
  children,
  onClick,
  active,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
}) {
  const base =
    "text-sm text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
  const activeCls = active ? "bg-[#00a8ff]/10 text-[#00f0ff]" : ""

  return (
    <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={`${base} ${activeCls}`}>
      {children}
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Close the mobile menu on Esc or on a tap/click outside the navbar.
  useEffect(() => {
    if (!mobileOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false)
    }
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [mobileOpen])

  const isActive = (href: string) => href === pathname

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur border-b border-[#00a8ff]/10"
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} active={isActive(link.href)}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#00a8ff]/20 bg-[#0a0a0f] hover:border-[#00a8ff]/50 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      <nav
        id={MOBILE_MENU_ID}
        aria-label="Main (mobile)"
        hidden={!mobileOpen}
        className="md:hidden border-t border-[#00a8ff]/10"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

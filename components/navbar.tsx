"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logo-small.png" alt="Dragon C logo" width={32} height={36} className="shrink-0" />
      <span className="text-white font-semibold tracking-wide">Dragon C</span>
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function NavLink({
    href,
    children,
    onClick,
    active,
  }: {
    href?: string
    children: React.ReactNode
    onClick?: () => void
    active?: boolean
  }) {
    const base =
      "text-sm text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff]/60"
    const activeCls = active ? "bg-[#00a8ff]/10 text-[#00f0ff]" : ""

    if (!href) {
      return (
        <button type="button" className={`${base} ${activeCls}`} onClick={onClick}>
          {children}
        </button>
      )
    }

    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${base} ${activeCls}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur border-b border-[#00a8ff]/10">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/tracker" active={pathname === "/tracker"}>
              Deal Flow Tracker
            </NavLink>
            <NavLink href="/#contact">Contact</NavLink>
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#00a8ff]/20 bg-[#0a0a0f] hover:border-[#00a8ff]/50 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-[#00a8ff]/10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col gap-1">
              <NavLink
                href="/"
                active={pathname === "/"}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                href="/tracker"
                active={pathname === "/tracker"}
                onClick={() => setMobileOpen(false)}
              >
                Deal Flow Tracker
              </NavLink>
              <NavLink href="/#contact" onClick={() => setMobileOpen(false)}>
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}


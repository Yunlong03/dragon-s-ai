import Image from "next/image"
export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-8 border-t border-[#00a8ff]/10 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-white font-semibold">Dragon C AI</span>
          </div>

          {/* Link */}
          <div className="text-muted-foreground text-sm">
            A{" "}
            <a 
              href="#" 
              className="text-[#00a8ff] hover:text-[#00f0ff] transition-colors"
            >
              Dragon Caravan
            </a>
            {" "}company
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            &copy; {currentYear} Dragon C AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-8 border-t border-[#00a8ff]/10 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00a8ff] to-[#00f0ff] flex items-center justify-center">
              <span className="text-[#0a0a0f] font-bold text-sm">DS</span>
            </div>
            <span className="text-white font-semibold">Dragon S AI</span>
          </div>

          {/* Link */}
          <div className="text-muted-foreground text-sm">
            A{" "}
            <a 
              href="#" 
              className="text-[#00a8ff] hover:text-[#00f0ff] transition-colors"
            >
              Dragon S
            </a>
            {" "}company
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            &copy; {currentYear} Dragon S AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

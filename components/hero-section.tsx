"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 168, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 168, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        {/* Circuit board pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 10 10 L 10 50 L 50 50" fill="none" stroke="#00a8ff" strokeWidth="0.5" />
                <path d="M 90 10 L 90 30 L 50 30" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="2" fill="#00a8ff" />
                <circle cx="50" cy="50" r="2" fill="#00f0ff" />
                <circle cx="90" cy="10" r="2" fill="#00a8ff" />
                <circle cx="50" cy="30" r="2" fill="#00f0ff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00a8ff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="text-sm text-[#00f0ff]">Bridging West & China Robotics</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          Your Bridge to China&apos;s{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">
            Robotics Revolution
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 text-pretty">
        We help Western companies source, evaluate, and partner with Chinese robotics players — and help Chinese innovators expand globally. 
          Navigate the world&apos;s fastest-growing robotics market with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#00a8ff] to-[#00f0ff] hover:from-[#00a8ff]/90 hover:to-[#00f0ff]/90 text-[#0a0a0f] font-semibold px-8 py-6 text-lg"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-[#00a8ff]/50 text-[#00f0ff] hover:bg-[#00a8ff]/10 px-8 py-6 text-lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Get in Touch
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-[#00a8ff]/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-[#00a8ff] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

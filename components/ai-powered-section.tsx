import { Radio, Brain, Bell } from "lucide-react"

const features = [
  {
    icon: Radio,
    title: "Real-Time Chinese Source Monitoring",
    description: "Our AI continuously scans Chinese-language news, company announcements, patents, and regulatory filings that Western monitoring tools miss."
  },
  {
    icon: Brain,
    title: "AI-Powered Company Screening",
    description: "Machine learning models analyze thousands of data points to score and rank Chinese robotics companies against your specific criteria."
  },
  {
    icon: Bell,
    title: "Automated Deal Alerts",
    description: "Receive instant notifications when new opportunities, partnerships, or market movements match your investment thesis or sourcing needs."
  }
]

export function AIPoweredSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#00a8ff]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00f0ff]/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Main content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-sm text-[#00f0ff]">Technology Edge</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">
                AI-Powered
              </span>{" "}
              Edge
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI monitoring system tracks <span className="text-[#00f0ff] font-semibold">200+ Chinese robotics companies</span> in 
              real-time across Chinese-language sources, giving you intelligence that traditional research simply cannot provide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#00a8ff]">200+</div>
                <div className="text-xs text-muted-foreground mt-1">Companies Tracked</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#00f0ff]">24/7</div>
                <div className="text-xs text-muted-foreground mt-1">Real-Time Monitoring</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#00a8ff]">50+</div>
                <div className="text-xs text-muted-foreground mt-1">Chinese Sources</div>
              </div>
            </div>
          </div>

          {/* Right side - Feature cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group flex gap-5 p-6 rounded-2xl bg-gradient-to-r from-[#0f0f19]/90 to-[#0f0f19]/50 border border-[#00a8ff]/20 backdrop-blur-sm hover:border-[#00a8ff]/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#00a8ff]/20 to-[#00f0ff]/10 border border-[#00a8ff]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#00f0ff]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

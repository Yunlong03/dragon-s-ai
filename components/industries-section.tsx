import { Factory, Truck, HeartPulse, PersonStanding } from "lucide-react"

const industries = [
  {
    icon: Factory,
    title: "Manufacturing Automation",
    description: "Industrial robots, collaborative robots, CNC machines, assembly systems, and smart factory solutions.",
    highlight: "Largest segment in China's robotics market"
  },
  {
    icon: Truck,
    title: "Logistics & Warehousing",
    description: "AGVs, AMRs, sorting systems, automated storage and retrieval systems (AS/RS), and last-mile delivery robots.",
    highlight: "Fastest-growing robotics application"
  },
  {
    icon: HeartPulse,
    title: "Healthcare Robotics",
    description: "Surgical robots, rehabilitation robots, diagnostic systems, pharmacy automation, and eldercare solutions.",
    highlight: "High-growth emerging sector"
  },
  {
    icon: PersonStanding,
    title: "Humanoid Robotics",
    description: "General-purpose humanoid robots, service robots, companion robots, and next-generation AI-powered systems.",
    highlight: "China's strategic priority focus"
  }
]

export function IndustriesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f19] to-[#0a0a0f]" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Industries We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Cover</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep expertise across the key verticals driving China&apos;s robotics revolution
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {industries.map((industry, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 backdrop-blur-sm hover:border-[#00f0ff]/50 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 via-transparent to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00a8ff]/20 to-[#00f0ff]/10 border border-[#00a8ff]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <industry.icon className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{industry.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{industry.description}</p>
                  <span className="inline-block text-xs text-[#00f0ff] px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                    {industry.highlight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

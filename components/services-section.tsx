import { Search, Handshake, FileSearch, Activity, Building2, Lightbulb } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Sourcing",
    description: "Identify and shortlist the best Chinese robotics companies for your specific requirements, from component suppliers to complete system integrators."
  },
  {
    icon: Handshake,
    title: "Partnership Facilitation",
    description: "Bridge cultural and business gaps to facilitate successful partnerships, joint ventures, and strategic alliances with Chinese robotics firms."
  },
  {
    icon: FileSearch,
    title: "Due Diligence",
    description: "Comprehensive verification of Chinese robotics companies including financial health, technical capabilities, client references, and regulatory compliance."
  },
  {
    icon: Activity,
    title: "Market Monitoring",
    description: "Real-time tracking of China's robotics landscape including emerging players, funding rounds, product launches, and competitive movements."
  },
  {
    icon: Building2,
    title: "Market Representation",
    description: "Serve as your on-the-ground presence in China, attending trade shows, meeting potential partners, and representing your interests."
  },
  {
    icon: Lightbulb,
    title: "Strategic Advisory",
    description: "Expert guidance on China market entry strategies, regulatory navigation, pricing strategies, and long-term competitive positioning."
  }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive solutions to help you navigate and succeed in China&apos;s robotics ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#0f0f19]/90 to-[#0a0a0f]/90 border border-[#00a8ff]/20 backdrop-blur-sm hover:border-[#00f0ff]/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00a8ff]/5 via-transparent to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00a8ff]/20 to-[#00f0ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-[#00f0ff]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

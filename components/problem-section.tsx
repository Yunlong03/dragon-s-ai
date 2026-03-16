import { Languages, ShieldAlert, Zap } from "lucide-react"

const problems = [
  {
    icon: Languages,
    title: "Language & Information Barrier",
    description: "Critical market intelligence and company data exist only in Chinese, making it nearly impossible for Western teams to access accurate, timely information."
  },
  {
    icon: ShieldAlert,
    title: "Trust & Verification Gap",
    description: "How do you verify a Chinese robotics supplier's capabilities, financials, and track record from the other side of the world?"
  },
  {
    icon: Zap,
    title: "Speed of Market Change",
    description: "China's robotics ecosystem evolves weekly. New players emerge, partnerships form, and technologies advance faster than traditional research can track."
  }
]

export function ProblemSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f19] to-[#0a0a0f]" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            The China Robotics{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Gap</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Western companies face significant challenges when trying to engage with China&apos;s robotics market
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 backdrop-blur-sm hover:border-[#00a8ff]/50 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00a8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mb-6">
                  <problem.icon className="w-7 h-7 text-[#00a8ff]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

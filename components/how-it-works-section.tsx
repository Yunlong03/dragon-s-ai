import { FileText, Search, CheckCircle, Trophy } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Brief Us",
    description: "Share your requirements, target specifications, and strategic goals. We listen and understand your unique needs."
  },
  {
    number: "02",
    icon: Search,
    title: "We Screen & Analyze",
    description: "Our AI-powered system and expert analysts identify and evaluate the best matches from China's robotics ecosystem."
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "You Evaluate",
    description: "Review our curated shortlist with detailed profiles, verified data, and our strategic recommendations."
  },
  {
    number: "04",
    icon: Trophy,
    title: "Deal Closes",
    description: "We facilitate introductions, negotiations, and support you through to successful partnership completion."
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f19] to-[#0a0a0f]" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A streamlined process designed to get you results efficiently
          </p>
        </div>

        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00a8ff]/50 to-transparent -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="group p-6 rounded-2xl bg-[#0f0f19]/80 border border-[#00a8ff]/20 backdrop-blur-sm hover:border-[#00a8ff]/50 transition-all duration-300 text-center">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#00a8ff] text-[#0a0a0f] font-bold text-sm flex items-center justify-center">
                    {step.number}
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#00a8ff]/20 to-[#00f0ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-[#00f0ff]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Arrow connector - between cards on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 -translate-y-1/2 z-10">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-[#00a8ff]/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

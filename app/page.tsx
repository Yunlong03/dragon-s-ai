import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { ServicesSection } from "@/components/services-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AIPoweredSection } from "@/components/ai-powered-section"
import { IndustriesSection } from "@/components/industries-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <AIPoweredSection />
      <IndustriesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

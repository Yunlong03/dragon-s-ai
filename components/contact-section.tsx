"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, CheckCircle } from "lucide-react"

const inquiryTypes = [
  { value: "sourcing", label: "Sourcing" },
  { value: "partnership", label: "Partnership" },
  { value: "due-diligence", label: "Due Diligence" },
  { value: "market-intel", label: "Market Intel" },
  { value: "other", label: "Other" }
]

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00a8ff]/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-[#00f0ff]">Touch</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Ready to explore China&apos;s robotics opportunities? Let&apos;s start a conversation.
            </p>
          </div>

          {/* Contact Form Card */}
          <div className="p-8 md:p-10 rounded-3xl bg-[#0f0f19]/90 border border-[#00a8ff]/20 backdrop-blur-sm">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/30 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Thank You!</h3>
                <p className="text-muted-foreground">
                  We&apos;ve received your inquiry and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      className="bg-[#1a1a2e] border-[#00a8ff]/30 text-white placeholder:text-muted-foreground focus:border-[#00a8ff] focus:ring-[#00a8ff]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company"
                      required
                      className="bg-[#1a1a2e] border-[#00a8ff]/30 text-white placeholder:text-muted-foreground focus:border-[#00a8ff] focus:ring-[#00a8ff]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-[#1a1a2e] border-[#00a8ff]/30 text-white placeholder:text-muted-foreground focus:border-[#00a8ff] focus:ring-[#00a8ff]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiry" className="text-white">What are you looking for?</Label>
                  <Select required>
                    <SelectTrigger className="bg-[#1a1a2e] border-[#00a8ff]/30 text-white focus:border-[#00a8ff] focus:ring-[#00a8ff]/20">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-[#00a8ff]/30">
                      {inquiryTypes.map((type) => (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="text-white focus:bg-[#00a8ff]/20 focus:text-white"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00a8ff] to-[#00f0ff] hover:from-[#00a8ff]/90 hover:to-[#00f0ff]/90 text-[#0a0a0f] font-semibold py-6"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Inquiry
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

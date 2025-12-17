"use client"

import { Shield, Zap, Globe, Coins } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure & Scalable",
    description: "Built on AWS infrastructure with encrypted storage and enterprise-grade security.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Deploy AI models instantly using  EC2 servers and our custom orchestration layer.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Run and serve models from AWS machines for ultra-low latency worldwide.",
  },
  {
    icon: Coins,
    title: "Efficient Pricing",
    description: "Pay only for actual compute usage with transparent, usage-based AWS billing.",
  },
]


export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Why Choose Our Platform</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the future of AI with our decentralized marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-balance">{feature.title}</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

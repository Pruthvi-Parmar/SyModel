"use client"

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToExplore = () => {
    document.getElementById("explore-models")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <p className="text-sm text-muted-foreground">
            A simple marketplace for publishing and discovering AI models
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
            Onchain <span className="gradient-text">AI Hub</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Upload model files to Walrus and store metadata on Polygon. Connect with MetaMask to publish.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" onClick={scrollToExplore} className="gap-2">
              Explore models
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/upload">Upload a model</Link>
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { label: "Models", value: "50+" },
              { label: "Developers", value: "5K+" },
              { label: "Transactions", value: "1M+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

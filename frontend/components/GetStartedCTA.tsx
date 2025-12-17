"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Search } from "lucide-react"

export function GetStartedCTA() {
  return (
    <section className="py-20 bg-muted/20 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join thousands of developers and creators building the future of AI
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/models">
                <span className="inline-flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Explore Models</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent gap-2" asChild>
              <Link to="/upload">
                <Upload className="w-4 h-4" />
                Upload a Model
              </Link>
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            <p>Connect your wallet to start using the platform</p>
          </div>
        </div>
      </div>
    </section>
  )
}

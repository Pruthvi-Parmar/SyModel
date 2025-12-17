"use client"

import { Link } from "react-router-dom"
import { ModelCard } from "@/components/ModelCard"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { ModelManifest } from "@/types/model"

const featuredModels: ModelManifest[] = [
  {
    id: "1",
    name: "GPT-4 Turbo",
    about: "Advanced language model for complex reasoning and creative tasks",
    type: "text",
    tags: ["language", "reasoning", "creative"],
    thumbnailUrl: "/ai-brain-neural-network.jpg",
    pricing: { mode: "hourly", pricePerHour: 0.05 },
    framework: "PyTorch",
  },
  {
    id: "2",
    name: "DALL-E 3",
    about: "State-of-the-art image generation from text descriptions",
    type: "image",
    tags: ["image-generation", "creative", "art"],
    thumbnailUrl: "/ai-generated-art-colorful.jpg",
    pricing: { mode: "hourly", pricePerHour: 0.08 },
    framework: "TensorFlow",
  },
  {
    id: "3",
    name: "Whisper Large",
    about: "Robust speech recognition and transcription model",
    type: "audio",
    tags: ["speech", "transcription", "multilingual"],
    thumbnailUrl: "/audio-waveform-visualization.png",
    pricing: { mode: "hourly", pricePerHour: 0.03 },
    framework: "PyTorch",
  },
  {
    id: "4",
    name: "CLIP Vision",
    about: "Multi-modal model connecting text and images",
    type: "multimodal",
    tags: ["vision", "text", "embedding"],
    thumbnailUrl: "/computer-vision-eye-technology.jpg",
    pricing: { mode: "hourly", pricePerHour: 0.04 },
    framework: "PyTorch",
  },
  {
    id: "5",
    name: "CodeLlama",
    about: "Specialized model for code generation and programming assistance",
    type: "text",
    tags: ["code", "programming", "development"],
    thumbnailUrl: "/code-programming-terminal.jpg",
    pricing: { mode: "hourly", pricePerHour: 0.06 },
    framework: "PyTorch",
  },
  {
    id: "6",
    name: "MusicGen",
    about: "Generate high-quality music from text descriptions",
    type: "audio",
    tags: ["music", "generation", "creative"],
    thumbnailUrl: "/music-notes-sound-waves.jpg",
    pricing: { mode: "hourly", pricePerHour: 0.07 },
    framework: "PyTorch",
  },
]

export function ExploreModels() {
  return (
    <section id="explore-models" className="py-20 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">Explore AI Models</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Discover cutting-edge AI models from the community. Deploy instantly and pay only for what you use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 auto-rows-fr">
          {featuredModels.map((model) => (
            <div key={model.id} className="h-full">
              <ModelCard model={model} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="group bg-transparent" asChild>
            <Link to="/models">
              View All Models
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

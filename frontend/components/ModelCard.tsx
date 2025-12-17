"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Zap } from "lucide-react"
import type { ModelManifest } from "@/types/model"

interface ModelCardProps {
  model: ModelManifest
}

export function ModelCard({ model }: ModelCardProps) {
  const formatPrice = (pricing: ModelManifest["pricing"]) => {
    if (!pricing || pricing.mode === "free") return "Free"
    if (pricing.mode === "hourly" && pricing.pricePerHour) {
      return `${pricing.pricePerHour} POL/hr`
    }
    return "Custom"
  }

  return (
    <div className="h-full">
      <Card className="model-card h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
            <img
              src={model.thumbnailUrl || "/ai-brain-neural-network.jpg"}
              alt={model.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm border-white/10">
                {model.type}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-xs bg-black/40 backdrop-blur-sm border-white/10">
                {model.framework}
              </Badge>
            </div>
          </div>

          <h3 className="font-semibold text-lg text-balance">{model.name}</h3>
          <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{model.about}</p>
        </CardHeader>

        <CardContent className="pb-3 flex-1">
          <div className="flex flex-wrap gap-1 mb-3">
            {model.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{model.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>Instant</span>
            </div>
            <div className="flex items-center font-medium">
              <Zap className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{formatPrice(model.pricing)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Try Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

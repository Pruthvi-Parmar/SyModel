"use client"

export function VideoEmbed() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">See It In Action</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Watch how easy it is to deploy and use AI models on our platform
          </p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border">
          <iframe
            src="https://www.youtube.com/embed/YVkswhpFN3Q"
            title="AI Marketplace Demo"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

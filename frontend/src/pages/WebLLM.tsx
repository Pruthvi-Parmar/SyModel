import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Send,
  Loader2,
  Trash2,
  Cpu,
  Download,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
} from "lucide-react"

import type {
  MLCEngine,
  InitProgressReport,
  ChatCompletionMessageParam,
} from "@mlc-ai/web-llm"

const AVAILABLE_MODELS = [
  { id: "SmolLM2-360M-Instruct-q4f32_1-MLC", label: "SmolLM2 360M (Fastest)", size: "~580 MB" },
  { id: "SmolLM2-1.7B-Instruct-q4f32_1-MLC", label: "SmolLM2 1.7B", size: "~1.1 GB" },
  { id: "Llama-3.2-1B-Instruct-q4f32_1-MLC", label: "Llama 3.2 1B", size: "~880 MB" },
  { id: "Llama-3.2-3B-Instruct-q4f32_1-MLC", label: "Llama 3.2 3B", size: "~2 GB" },
  { id: "Qwen2.5-0.5B-Instruct-q4f32_1-MLC", label: "Qwen2.5 0.5B", size: "~630 MB" },
  { id: "gemma-2-2b-it-q4f32_1-MLC", label: "Gemma 2 2B", size: "~1.5 GB" },
  { id: "Phi-3.5-mini-instruct-q4f32_1-MLC", label: "Phi 3.5 Mini (3.8B)", size: "~2.6 GB" },
]

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

type EngineStatus = "idle" | "loading" | "ready" | "error"

/**
 * Renders the WebLLM chat page that manages model selection and loading, in-browser model initialization,
 * chat history, streaming assistant responses, and related UI controls.
 *
 * The component handles WebGPU checks, dynamic model loading with progress updates, sending messages
 * to the in-browser engine with streaming output, clearing browser caches/IndexedDB for retries,
 * and UI state (status, progress, errors, input, and message list).
 *
 * @returns A JSX element for the WebLLM chat user interface page.
 */
export default function WebLLMChat() {
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id)
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("idle")
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadStage, setLoadStage] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState("")

  const engineRef = useRef<MLCEngine | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText])

  const handleInitProgress = useCallback((report: InitProgressReport) => {
    setLoadProgress(Math.round(report.progress * 100))
    setLoadStage(report.text)
  }, [])

  const clearModelCache = async () => {
    try {
      const keys = await caches.keys()
      for (const key of keys) {
        if (key.includes("webllm") || key.includes("mlc") || key.includes("wasm")) {
          await caches.delete(key)
        }
      }
    } catch {
      // Cache API may not be available
    }
    try {
      const dbs = await indexedDB.databases()
      for (const db of dbs) {
        if (db.name && (db.name.includes("webllm") || db.name.includes("mlc"))) {
          indexedDB.deleteDatabase(db.name)
        }
      }
    } catch {
      // IndexedDB databases() may not be available
    }
  }

  const loadModel = async () => {
    setEngineStatus("loading")
    setLoadProgress(0)
    setLoadStage("Checking WebGPU support...")
    setErrorMsg("")

    try {
      if (!navigator.gpu) {
        throw new Error(
          "WebGPU is not available in your browser. Please use Chrome 113+ or Edge 113+ with WebGPU enabled."
        )
      }

      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) {
        throw new Error(
          "Could not get a WebGPU adapter. Your GPU may not be supported, or WebGPU may be disabled. Try chrome://flags/#enable-unsafe-webgpu"
        )
      }

      setLoadStage("Initializing engine...")
      const { CreateMLCEngine, prebuiltAppConfig } = await import("@mlc-ai/web-llm")

      const appConfig = {
        ...prebuiltAppConfig,
        useIndexedDBCache: true,
      }

      const engine = await CreateMLCEngine(selectedModel, {
        appConfig,
        initProgressCallback: handleInitProgress,
      })

      engineRef.current = engine
      setEngineStatus("ready")
      setLoadStage("")
    } catch (err: any) {
      console.error("WebLLM load error:", err)
      setEngineStatus("error")
      setErrorMsg(err?.message || "Failed to load model")
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !engineRef.current || isGenerating) return

    const userMsg: ChatMessage = { role: "user", content: input.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setIsGenerating(true)
    setStreamingText("")

    try {
      const apiMessages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: "You are a helpful AI assistant running entirely inside the user's browser via WebLLM and WebGPU. Be concise and helpful.",
        },
        ...updatedMessages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ]

      const chunks = await engineRef.current.chat.completions.create({
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      })

      let fullReply = ""
      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta?.content || ""
        fullReply += delta
        setStreamingText(fullReply)
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullReply },
      ])
      setStreamingText("")
    } catch (err: any) {
      console.error("Generation error:", err)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err?.message || "Generation failed"}` },
      ])
      setStreamingText("")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setStreamingText("")
    engineRef.current?.resetChat()
  }

  const statusIcon = {
    idle: <Cpu className="w-4 h-4" />,
    loading: <Download className="w-4 h-4 animate-pulse" />,
    ready: <CheckCircle className="w-4 h-4 text-green-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
  }

  const statusLabel = {
    idle: "Not loaded",
    loading: "Downloading model...",
    ready: "Ready — running in your browser",
    error: "Error",
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              WebLLM Chat
            </span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Run an LLM entirely inside your browser using WebGPU. No server, no API keys — complete
            privacy. Select a model, load it once, then chat.
          </p>
        </motion.div>

        {/* Model Selection + Status */}
        <Card className="border-border/60">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  disabled={engineStatus === "loading" || isGenerating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <span>{m.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{m.size}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={loadModel}
                disabled={engineStatus === "loading"}
                className="w-full sm:w-auto"
              >
                {engineStatus === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : engineStatus === "ready" ? (
                  "Reload Model"
                ) : (
                  "Load Model"
                )}
              </Button>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-2 text-sm">
              {statusIcon[engineStatus]}
              <span className="text-muted-foreground">{statusLabel[engineStatus]}</span>
              {engineStatus === "ready" && (
                <Badge variant="outline" className="ml-auto text-xs text-green-400 border-green-400/30">
                  WebGPU Active
                </Badge>
              )}
            </div>

            {/* Progress bar during loading */}
            {engineStatus === "loading" && (
              <div className="space-y-1.5">
                <Progress value={loadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground truncate">{loadStage}</p>
              </div>
            )}

            {/* Error message */}
            {engineStatus === "error" && errorMsg && (
              <div className="space-y-2">
                <p className="text-sm text-red-400 bg-red-400/10 rounded-md p-3">{errorMsg}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await clearModelCache()
                      setErrorMsg("")
                      setEngineStatus("idle")
                    }}
                  >
                    Clear Cache & Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadModel}>
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Browser tip */}
            {engineStatus === "idle" && (
              <p className="text-xs text-muted-foreground/70">
                Requires Chrome 113+ or Edge 113+ with WebGPU. Models are cached in the browser after first download.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 border-border/60 flex flex-col min-h-[400px]">
          <CardContent className="p-4 flex flex-col flex-1 gap-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {messages.length === 0 && !streamingText && (
                <div className="flex-1 flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center space-y-2 text-muted-foreground">
                    <Bot className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm">
                      {engineStatus === "ready"
                        ? "Model loaded. Type a message to start chatting."
                        : "Load a model above to begin."}
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming response */}
              {streamingText && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="max-w-[80%] rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-1.5 h-4 bg-purple-400 ml-0.5 animate-pulse rounded-sm" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 items-end border-t border-border/40 pt-4">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  engineStatus === "ready"
                    ? "Type your message... (Enter to send, Shift+Enter for newline)"
                    : "Load a model first..."
                }
                disabled={engineStatus !== "ready" || isGenerating}
                className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                rows={1}
              />
              <div className="flex flex-col gap-1.5">
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || engineStatus !== "ready" || isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={clearChat}
                  disabled={messages.length === 0 && !streamingText}
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

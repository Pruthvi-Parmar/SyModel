import { Contract, JsonRpcProvider, type BrowserProvider } from "ethers"
import type { ModelManifest, ModelType } from "@/types/model"

export type RegisterModelParams = {
  blobId: string
  objectId: string
  name: string
  description: string
  modelType?: ModelType
  tags?: string[]
  framework?: string
  pricingMode?: "free" | "hourly" | "custom"
  pricePerHour?: number
}

export type RegistrationResult = {
  success: boolean
  transactionHash: string
  error?: string
}

const MODEL_REGISTRY_ABI = [
  "function modelExists(string blobId) view returns (bool)",
  "function getAllModels() view returns (tuple(address uploader,uint256 uploadedAt,string blobId,string objectId,string name,string description,string modelType,string tagsCsv,string framework,string pricingMode,uint256 pricePerHour)[])",
  "function registerModel(string blobId,string objectId,string name,string description,string modelType,string tagsCsv,string framework,string pricingMode,uint256 pricePerHour) returns (uint256)",
]

export function getPolygonRpcProvider(): JsonRpcProvider {
  const rpcUrl =
    (import.meta.env.VITE_POLYGON_RPC_URL as string | undefined) ||
    "https://polygon-amoy-bor-rpc.publicnode.com"
  return new JsonRpcProvider(rpcUrl)
}

export function getModelRegistryAddress(): string {
  const addr = import.meta.env.VITE_POLYGON_MODEL_REGISTRY_ADDRESS as string | undefined
  if (!addr) throw new Error("Missing VITE_POLYGON_MODEL_REGISTRY_ADDRESS")
  return addr
}

export function tagsToCsv(tags?: string[]): string {
  if (!tags?.length) return ""
  return tags.map((t) => t.trim()).filter(Boolean).join(",")
}

export function tagsFromCsv(csv?: string): string[] {
  if (!csv) return []
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export async function modelExistsOnPolygon(blobId: string): Promise<boolean> {
  const provider = getPolygonRpcProvider()
  const contract = new Contract(getModelRegistryAddress(), MODEL_REGISTRY_ABI, provider)
  return (await contract.modelExists(blobId)) as boolean
}

export async function registerModelOnPolygon(
  params: RegisterModelParams,
  browserProvider: BrowserProvider
): Promise<RegistrationResult> {
  try {
    const signer = await browserProvider.getSigner()
    const contract = new Contract(getModelRegistryAddress(), MODEL_REGISTRY_ABI, signer)

    const tx = await contract.registerModel(
      params.blobId,
      params.objectId ?? "",
      params.name,
      params.description,
      params.modelType ?? "text",
      tagsToCsv(params.tags),
      params.framework ?? "Custom",
      params.pricingMode ?? "free",
      Math.floor(params.pricePerHour ?? 0)
    )

    const receipt = await tx.wait()
    return {
      success: true,
      transactionHash: receipt?.hash ?? tx.hash,
    }
  } catch (error) {
    return {
      success: false,
      transactionHash: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

type PolygonModelTuple = {
  uploader: string
  uploadedAt: bigint
  blobId: string
  objectId: string
  name: string
  description: string
  modelType: string
  tagsCsv: string
  framework: string
  pricingMode: string
  pricePerHour: bigint
}

export async function getAllModelsFromPolygon(): Promise<ModelManifest[]> {
  const provider = getPolygonRpcProvider()
  const contract = new Contract(getModelRegistryAddress(), MODEL_REGISTRY_ABI, provider)
  const rows = (await contract.getAllModels()) as PolygonModelTuple[]

  return rows.map((m) => {
    const createdAt = new Date(Number(m.uploadedAt) * 1000).toISOString()
    const type = (m.modelType as ModelType) || "text"
    return {
      id: m.blobId,
      name: m.name || "Unnamed Model",
      about: m.description || "No description provided",
      type,
      tags: tagsFromCsv(m.tagsCsv),
      framework: (m.framework as any) || "Custom",
      pricing: { mode: (m.pricingMode as any) || "free" },
      createdAt,
      author: m.uploader,
      uploader: m.uploader,
      blobId: m.blobId,
      objectId: m.objectId,
    }
  })
}



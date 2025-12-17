import { useState, useEffect } from 'react'
import { getAllModelsFromPolygon } from '@/lib/polygonRegistry'
import type { ModelManifest } from '@/types/model'

export function useBlockchainModels() {
  const [models, setModels] = useState<ModelManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const polygonModels = await getAllModelsFromPolygon()
      setModels(polygonModels)
      
    } catch (err) {
      console.error('❌ Error fetching Polygon blockchain models:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch models')
      setModels([]) // Fallback to empty array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  return {
    models,
    loading,
    error,
    refetch: fetchModels
  }
}
import { useState, useEffect } from 'react'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'

export const useRecommendations = (productId?: string, limit: number = 4) => {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [productId])

  const fetchRecommendations = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0) 
        .limit(limit)

      if (productId) {

        const { data: currentProduct } = await supabase
          .from('products')
          .select('category')
          .eq('id', productId)
          .single()

        if (currentProduct?.category) {
          query = query
            .neq('id', productId)
            .eq('category', currentProduct.category)
        }
      }

      const { data, error } = await query

      if (error) throw error
      
      if (!data || data.length === 0) {
        const { data: fallbackData } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .neq('id', productId || '')
          .limit(limit)
        
        setRecommendations(fallbackData || [])
      } else {
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  return { recommendations, loading }
}
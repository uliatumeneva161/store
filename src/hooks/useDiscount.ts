import { useState } from 'react'

interface Discount {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses?: number
  used_count: number
  is_active: boolean
  valid_until?: string
}

export const useDiscount = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateDiscount = async (code: string, orderAmount: number): Promise<Discount | null> => {
    setLoading(true)
    setError('')
    
    try {
      const mockDiscounts: Discount[] = [
        {
          id: '1',
          code: 'WELCOME10',
          discount_type: 'percentage',
          discount_value: 10,
          min_order_amount: 1000,
          used_count: 0,
          is_active: true
        },
        {
          id: '2', 
          code: 'SUMMER2024',
          discount_type: 'fixed',
          discount_value: 500,
          min_order_amount: 3000,
          used_count: 5,
          max_uses: 100,
          is_active: true
        }
      ]

      const discount = mockDiscounts.find(d => 
        d.code === code.toUpperCase() && 
        d.is_active &&
        orderAmount >= d.min_order_amount &&
        (!d.max_uses || d.used_count < d.max_uses) &&
        (!d.valid_until || new Date(d.valid_until) > new Date())
      )

      if (!discount) {
        setError('Промокод недействителен или истек срок действия')
        return null
      }

      return discount
    } catch (err) {
      setError('Ошибка при проверке промокода')
      return null
    } finally {
      setLoading(false)
    }
  }

  const applyDiscount = (discount: Discount, orderAmount: number): number => {
    if (discount.discount_type === 'percentage') {
      return orderAmount * (discount.discount_value / 100)
    } else {
      return Math.min(discount.discount_value, orderAmount)
    }
  }

  const markDiscountAsUsed = (discountId: string) => {
    console.log(`Discount ${discountId} marked as used`)
  }

  return {
    validateDiscount,
    applyDiscount,
    markDiscountAsUsed,
    loading,
    error,
    setError
  }
}
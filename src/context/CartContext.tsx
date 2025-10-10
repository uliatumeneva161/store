import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product, CartItem } from '../types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  state: CartState,
  cartItems: CartItem[], 
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Константа для localStorage
const CART_STORAGE_KEY = 'samreshung_cart'

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState

  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.product.id === action.payload.id)
      
      if (existingItem) {
        newState = {
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        newState = {
          items: [...state.items, { product: action.payload, quantity: 1 }]
        }
      }
      break

    case 'REMOVE_FROM_CART':
      newState = {
        items: state.items.filter(item => item.product.id !== action.payload)
      }
      break

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newState = {
          items: state.items.filter(item => item.product.id !== action.payload.productId)
        }
      } else {
        newState = {
          items: state.items.map(item =>
            item.product.id === action.payload.productId
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
        }
      }
      break

    case 'CLEAR_CART':
      newState = {
        items: []
      }
      break

    default:
      return state
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState.items))
  return newState
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const items = JSON.parse(savedCart)
        items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: item.product })
          if (item.quantity > 1) {
            dispatch({ 
              type: 'UPDATE_QUANTITY', 
              payload: { productId: item.product.id, quantity: item.quantity } 
            })
          }
        })
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
    }
  }, [])

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  return (
    <CartContext.Provider value={{
      state,
      cartItems: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
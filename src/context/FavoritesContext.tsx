import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '../types'

interface FavoritesState {
  items: Product[]
}

type FavoritesAction =
  | { type: 'ADD_TO_FAVORITES'; payload: Product }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: Product[] }

interface FavoritesContextType {
  state: FavoritesState
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  clearFavorites: () => void
  isInFavorites: (productId: string) => boolean
  getTotalFavorites: () => number
  syncFavoritesWithProducts: (currentProducts: Product[]) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Ключ для localStorage
const FAVORITES_STORAGE_KEY = 'favorites_items'

// Функция для загрузки из localStorage
const loadFavoritesFromStorage = (): Product[] => {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
  }
  return []
}

// Функция для сохранения в localStorage
const saveFavoritesToStorage = (items: Product[]) => {
  try {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  let newState: FavoritesState

  switch (action.type) {
    case 'ADD_TO_FAVORITES':
  
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state 
      }
      
      newState = {
        items: [...state.items, action.payload]
      }
      break

    case 'REMOVE_FROM_FAVORITES':
      newState = {
        items: state.items.filter(item => item.id !== action.payload)
      }
      break

    case 'CLEAR_FAVORITES':
      newState = {
        items: []
      }
      break

    case 'LOAD_FAVORITES':
      newState = {
        items: action.payload
      }
      break

    default:
      return state
  }

  saveFavoritesToStorage(newState.items)
  return newState
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] })

  useEffect(() => {
    const savedFavorites = loadFavoritesFromStorage()
    dispatch({ type: 'LOAD_FAVORITES', payload: savedFavorites })
  }, [])

  const addToFavorites = (product: Product) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: product })
  }

  const removeFromFavorites = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId })
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  const isInFavorites = (productId: string): boolean => {
    return state.items.some(item => item.id === productId)
  }

  const getTotalFavorites = (): number => {
    return state.items.length
  }

  const syncFavoritesWithProducts = (currentProducts: Product[]) => {
    const updatedItems = state.items.map(favItem => {
      const currentProduct = currentProducts.find(p => p.id === favItem.id)
      return currentProduct || favItem 
    }).filter(item => item !== null) as Product[]

    if (JSON.stringify(updatedItems) !== JSON.stringify(state.items)) {
      dispatch({ type: 'LOAD_FAVORITES', payload: updatedItems })
    }
  }

  return (
    <FavoritesContext.Provider value={{
      state,
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
      isInFavorites,
      getTotalFavorites,
      syncFavoritesWithProducts
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
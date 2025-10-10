import React from 'react'
import { useFavorites } from '../context/FavoritesContext'
import type { Product } from '../types'

interface LikeButtonProps {
  product: Product
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  product, 
  size = 'md', 
  showText = false 
}) => {
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()

  const isLiked = isInFavorites(product.id)

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiked) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',  
    lg: 'w-10 h-10' 
  }

  return (
    <button
      onClick={handleToggleLike}
      className="flex items-center justify-center bg-transparent hover:scale-110 outline-none hover:outline-none focus:outline-none border-0 transition-all duration-200 group"
      aria-label={isLiked ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg 
        className={`${iconSizes[size]} transition-colors duration-200 ${
          isLiked 
            ? 'text-error drop-shadow-neon' 
            : 'text-gray-dark hover:text-error group-hover:drop-shadow-neon'
        }`}
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path 
          d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"
        />
      </svg>
      
      {showText && (
        <span className={`ml-2 text-sm font-medium transition-colors duration-200 ${
          isLiked ? 'text-error' : 'text-gray-dark group-hover:text-error'
        }`}>
          {isLiked ? 'В избранном' : 'В избранное'}
        </span>
      )}
    </button>
  )
}

export default LikeButton
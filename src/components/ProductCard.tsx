import React from 'react'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'
import LikeButton from './LikeButton'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, state } = useCart()
  
  const cartItems = state.items
  const cartItem = cartItems.find(item => item.product.id === product.id)
  const itemCount = cartItem?.quantity || 0
  const isInCart = itemCount > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  let buttonVariant: 'primary' | 'secondary' | 'ghost' = 'primary'
  let buttonText = ''

  if (product.stock === 0) {
    buttonVariant = 'ghost'
    buttonText = 'Нет в наличии'
  } else if (isInCart) {
    buttonVariant = 'secondary'
    buttonText = `Добавлено (${itemCount})`
  } else {
    buttonVariant = 'primary'
    buttonText = 'Добавить в корзину'
  }

  return (
    <Card hover>
      <div className="relative flex-1">
        <div className="absolute top-2 right-2 z-10">
          <LikeButton product={product} size="sm" />
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="inline-block bg-gray-light text-dark text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-dark mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-dark text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-dark">
            {product.price} ₽
          </span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant={buttonVariant}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard
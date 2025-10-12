import React from 'react'
import { Link } from 'react-router-dom'
import { useRecommendations } from '../hooks/useRecommendations'

interface ProductRecommendationsProps {
  productId?: string
  title?: string
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  productId, 
  title = "Рекомендуемые товары" 
}) => {
  const { recommendations, loading } = useRecommendations(productId)

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 text-dark">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-light rounded-lg shadow-card p-4 animate-pulse">
              <div className="bg-gray-medium h-48 rounded mb-4"></div>
              <div className="bg-gray-medium h-4 rounded mb-2"></div>
              <div className="bg-gray-medium h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-6 text-dark">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(product => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-gray-light rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-medium hover:border-main"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-medium text-dark mb-2 line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-dark">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <span className="text-warning">★</span>
                    <span className="text-sm text-gray-dark">{product.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductRecommendations
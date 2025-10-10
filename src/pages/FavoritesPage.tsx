import React from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import ProductCard from '../components/ProductCard'
import Button from '../ui/Button'
import Card from '../ui/Card'

const FavoritesPage: React.FC = () => {
  const { state, clearFavorites, getTotalFavorites } = useFavorites()

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center p-8">
          <div className="text-gray-dark mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-4">
            В избранном пока пусто
          </h1>
          <p className="text-gray-dark mb-6">
            Добавляйте товары в избранное, чтобы не потерять их
          </p>
          <Link to="/products">
            <Button variant="primary">
              Перейти к товарам
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">
          Избранные товары
        </h1>
        <Link 
          to="/" 
          className="text-main hover:text-accent transition-colors duration-200"
        >
          ← На главную
        </Link>
      </div>

      {/* Статистика и управление */}
      <Card className="p-4 mb-6 border-main">
        <div className="flex justify-between items-center">
          <p className="text-dark">
            Товаров в избранном: <strong>{getTotalFavorites()}</strong>
          </p>
          <button
            onClick={clearFavorites}
            className="text-main hover:text-accent font-medium transition-colors duration-200"
          >
            Очистить избранное
          </button>
        </div>
      </Card>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.items.map(product => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className="block hover:no-underline" 
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
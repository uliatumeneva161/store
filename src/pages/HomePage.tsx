import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import Button from '../ui/Button'
const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-dark=">
      <section className="text-center mb-12">
         <p className="text-xl text-dark mb-8 max-w-2xl mx-auto">
           Магазин техники для тех, кто
        </p>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600  to-blue-500 bg-clip-text text-transparent mb-4">
          сам решает
        </h1>
        
        
        <Link to="/products" className="inline-block">
  <Button variant="primary" className="px-8 py-3">
    Смотреть все товары
  </Button>
</Link>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-main bg-clip-text mb-6">
          Категории
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Object.entries({ 
    'Телефоны': 'https://i.pinimg.com/736x/0e/f3/01/0ef301e5a6993f668bb723859c08ed96.jpg', 
    'Ноутбуки': 'https://i.pinimg.com/1200x/09/51/ee/0951ee936783e1d82dcdc6a452b7088a.jpg', 
    'Мониторы': 'https://i.pinimg.com/1200x/c8/93/ef/c893efb3660f21ed3f1a5a472b945570.jpg', 
    'Карты памяти': 'https://i.pinimg.com/1200x/1a/b7/7f/1ab77fde2b568850512745a8873b35cd.jpg', 
    'Аксессуары': 'https://i.pinimg.com/1200x/37/15/73/371573cf82304303a55bc56695fe005e.jpg', 
    'Наушники': 'https://i.pinimg.com/1200x/68/30/84/683084dae1575d55c8482d83456616dc.jpg'
  }).map(([category, img]) => (
    <Link
      key={category}
      to={`/products?category=${encodeURIComponent(category)}`}
      className="text-center shadow-neon hover:shadow-neon-hover hover:scale-105 transition-all duration-300 bg-white rounded-lg overflow-hidden flex flex-col h-48" 
    >
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={img} 
          alt={category}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="font-semibold text-white text-sm px-2 py-1 bg-black bg-opacity-50 rounded">
            {category}
          </h3>
        </div>
      </div>
    </Link>
  ))}
</div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-main bg-clip-text">
            Популярные товары
          </h2>
          <Link 
            to="/products" 
            className="text-main hover:text-dark font-medium transition-colors"
          >
            Все товары →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-neon p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="block hover:no-underline transition-transform hover:scale-105"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
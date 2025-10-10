import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import SearchWithAutocomplete from '../components/SearchWithAutocomplete'
import Card from '../ui/Card'
import Button from '../ui/Button'

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm)
    }
  }, [searchTerm])

  const performSearch = async (term: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`)
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    const newParams = new URLSearchParams()
    if (term.trim()) {
      newParams.set('search', term.trim())
    }
    window.location.href = `/products?${newParams.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchWithAutocomplete 
          onSearch={handleSearch} 
          searchTerm={searchTerm}
        />
      </div>

      {searchTerm && (
        <Card className="text-center p-6 mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">
            Результаты поиска для "{searchTerm}"
          </h1>
          <p className="text-gray-dark">
            Найдено товаров: {products.length}
          </p>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-lg text-dark">Поиск...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="block hover:no-underline"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <div className="text-gray-dark mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          <p className="text-gray-dark text-lg mb-2">По вашему запросу ничего не найдено</p>
          <p className="text-gray-dark mb-4">Попробуйте изменить поисковый запрос</p>
          <Link to="/">
            <Button variant="primary">
              Вернуться в магазин
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

export default SearchPage
import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import SearchWithAutocomplete from '../components/SearchWithAutocomplete'
import CategoryFilters from '../components/CategoryFilters'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const searchTerm = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const [sortBy, setSortBy] = useState('name')
  const [categoryFilters, setCategoryFilters] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, category, sortBy, categoryFilters])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

const applyCategoryFilters = (product: Product) => {
  if (Object.keys(categoryFilters).length === 0) return true

  // Фильтр по цене
  if (categoryFilters.minPrice && product.price < categoryFilters.minPrice) return false
  if (categoryFilters.maxPrice && product.price > categoryFilters.maxPrice) return false

  // Фильтр по наличию
  if (categoryFilters.inStock && product.stock <= 0) return false

  // Фильтр по брендам (множественный выбор)
  if (categoryFilters.brands && categoryFilters.brands.length > 0) {
    if (!categoryFilters.brands.includes(product.brand)) return false
  }

  // Остальные фильтры
  for (const [key, value] of Object.entries(categoryFilters)) {
    if (!value || value === '' || key === 'minPrice' || key === 'maxPrice' || key === 'inStock' || key === 'brands') continue
    
    const productValue = product[key as keyof Product]
    if (productValue?.toString().toLowerCase() !== value.toString().toLowerCase()) {
      return false
    }
  }
  
  return true
  }
  
  const filterAndSortProducts = () => {

    let filtered = [...products]

    // Фильтр по поиску
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term)
      )
    }

    // Фильтр по категории
    if (category) {
      filtered = filtered.filter(product => product.category === category)
    }

    // Применяем расширенные фильтры для категории
    filtered = filtered.filter(applyCategoryFilters)

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleSearch = (term: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (term.trim()) {
      newParams.set('search', term.trim())
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }

  const handleClearFilters = () => {
    setSearchParams({})
    setSortBy('name')
    setCategoryFilters({})
    setShowFilters(false)
  }

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-dark">Загрузка товаров...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark">
          {searchTerm ? `Поиск: "${searchTerm}"` : 
           category ? `Категория: ${category}` : 'Все товары'}
        </h1>
        <Link 
          to="/" 
          className="text-main hover:text-accent transition-colors duration-200"
        >
          ← На главную
        </Link>
      </div>

      <Card className="p-4 mb-6 border-main">
        <p className="text-dark">
          Всего товаров: <strong>{products.length}</strong>
          {filteredProducts.length !== products.length && (
            <> | Показано: <strong>{filteredProducts.length}</strong></>
          )}
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <SearchWithAutocomplete 
              onSearch={handleSearch} 
              searchTerm={searchTerm}
            />
          </div>
          
          <select
            value={category}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams)
              if (e.target.value) {
                newParams.set('category', e.target.value)
                setShowFilters(true)
              } else {
                newParams.delete('category')
                setShowFilters(false)
              }
              setSearchParams(newParams)
              setCategoryFilters({})
            }}
            className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark"
          >
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark"
          >
            <option value="name">По названию</option>
            <option value="price_asc">По цене (возр.)</option>
            <option value="price_desc">По цене (убыв.)</option>
          </select>
        </div>

        {category && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-main hover:text-accent font-medium transition-colors duration-200"
            >
              {showFilters ? 'Скрыть фильтры' : 'Расширенные фильтры'}
            </button>
            
            <div className="flex items-center space-x-4">
              {(searchTerm || category || Object.keys(categoryFilters).some(key => categoryFilters[key])) && (
                <button
                  onClick={handleClearFilters}
                  className="text-main hover:text-accent transition-colors duration-200"
                >
                  Сбросить все
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      {showFilters && category && (
        <div className="mb-6">
          <CategoryFilters
            category={category}
            filters={categoryFilters}
            onFiltersChange={setCategoryFilters}
            products={products.filter(p => p.category === category)}
          />
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className="block hover:no-underline" 
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-dark text-lg mb-4">Товары не найдены</p>
          <Button
            onClick={handleClearFilters}
            variant="primary"
          >
            Показать все товары
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
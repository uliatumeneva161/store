import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'

interface SearchWithAutocompleteProps {
  onSearch: (term: string) => void
  searchTerm: string
}

const SearchWithAutocomplete: React.FC<SearchWithAutocompleteProps> = ({ 
  onSearch, 
  searchTerm: externalSearchTerm 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(externalSearchTerm || '')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Синхронизация с внешним searchTerm
  useEffect(() => {
    setLocalSearchTerm(externalSearchTerm || '')
  }, [externalSearchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      const searchTerm = localSearchTerm || ''
      if (searchTerm.trim().length === 0) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(5)

        if (error) throw error
        setSuggestions(data || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(timeoutId)
  }, [localSearchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    onSearch(value)
  }

  const handleSuggestionClick = (product: Product) => {
    setLocalSearchTerm(product.name)
    setShowSuggestions(false)
    onSearch(product.name)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false)
      if (localSearchTerm?.trim()) {
        navigate(`/products?search=${encodeURIComponent(localSearchTerm)}`)
      }
    }
  }

  const handleClearSearch = () => {
    setLocalSearchTerm('')
    onSearch('')
    setShowSuggestions(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={localSearchTerm || ''}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {localSearchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-dark hover:text-dark transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && localSearchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-gray-light border border-gray-medium rounded-md shadow-card max-h-60 overflow-auto">
          {loading ? (
            <div className="px-4 py-2 text-gray-dark flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 mr-2 text-main" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Поиск...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="px-4 py-3 hover:bg-gray-medium cursor-pointer border-b border-gray-medium last:border-b-0 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-medium"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-dark">{product.name}</p>
                      <p className="text-sm text-gray-dark">{product.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link
                to={`/products?search=${encodeURIComponent(localSearchTerm)}`}
                className="block px-4 py-2 text-sm text-main hover:bg-gray-medium border-t border-gray-medium text-center font-medium transition-colors duration-200"
                onClick={() => setShowSuggestions(false)}
              >
                Все результаты для "{localSearchTerm}"
              </Link>
            </>
          ) : (
            <div className="px-4 py-2 text-gray-dark text-center">
              Товары не найдены
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchWithAutocomplete
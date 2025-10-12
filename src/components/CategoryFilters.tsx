import React, { useState, useEffect } from 'react'
import type { Product } from '../types'
import Card from '../ui/Card'

interface CategoryFiltersProps {
  category: string
  filters: any
  onFiltersChange: (filters: any) => void
  products: Product[]
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  category,
  filters,
  onFiltersChange,
  products
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price).filter(price => price > 0)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      setPriceRange([minPrice, maxPrice])
    }
  }, [products])

  const getUniqueValues = (field: keyof Product) => {
    const values = products
      .map(p => p[field])
      .filter(value => value != null && value !== '')
      .map(value => value?.toString())
    
    return [...new Set(values)].sort()
  }


  const getFilterCount = (field: keyof Product, value: any) => {
    return products.filter(product => {
     
      const tempFilters = { ...filters }
      delete tempFilters[field]
      delete tempFilters.brands
      delete tempFilters.minPrice
      delete tempFilters.maxPrice
      delete tempFilters.inStock
      
      return applyFilters(product, tempFilters) && 
             product[field]?.toString() === value?.toString()
    }).length
  }

  const applyFilters = (product: Product, filterObj: any) => {
    if (Object.keys(filterObj).length === 0) return true

    if (filterObj.minPrice && product.price < filterObj.minPrice) return false
    if (filterObj.maxPrice && product.price > filterObj.maxPrice) return false

    if (filterObj.inStock && product.stock <= 0) return false

    if (filterObj.brands && filterObj.brands.length > 0) {
      if (!filterObj.brands.includes(product.brand)) return false
    }

    for (const [key, value] of Object.entries(filterObj)) {
      if (!value || value === '' || key === 'minPrice' || key === 'maxPrice' || key === 'inStock' || key === 'brands') continue
      
      const productValue = product[key as keyof Product]
      if (productValue?.toString().toLowerCase() !== value.toString().toLowerCase()) {
        return false
      }
    }
    
    return true
  }

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const renderPriceFilter = () => {
    const [minPrice, maxPrice] = priceRange
    const currentMin = filters.minPrice || ''
    const currentMax = filters.maxPrice || ''

    return (
      <Card className="space-y-3 p-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-dark">
            Цена, ₽
          </label>
          {(filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() => {
                clearFilter('minPrice')
                clearFilter('maxPrice')
              }}
              className="text-xs text-error hover:text-red-700 transition-colors duration-200"
            >
              очистить
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder={minPrice.toString()}
              value={currentMin}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-medium rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
              min={minPrice}
              max={maxPrice}
              step={1000}
            />
          </div>
          <span className="text-gray-dark text-sm">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder={maxPrice.toString()}
              value={currentMax}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-medium rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
              min={minPrice}
              max={maxPrice}
            />
          </div>
        </div>
        
        
      </Card>
    )
  }

  const renderBrandFilter = () => {
    const brands = getUniqueValues('brand')
    const selectedBrands = filters.brands || []

    return (
      <Card className="space-y-3 p-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-dark">
            Бренд
          </label>
          {selectedBrands.length > 0 && (
            <button
              onClick={() => clearFilter('brands')}
              className="text-xs text-error hover:text-red-700 transition-colors duration-200"
            >
              очистить
            </button>
          )}
        </div>
        
        <div className="max-h-48 overflow-y-auto space-y-2">
          {brands.map(brand => {
            const count = getFilterCount('brand', brand)
            if (count === 0) return null
            
            return (
              <label key={brand} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...selectedBrands, brand]
                        : selectedBrands.filter((b: string) => b !== brand)
                      handleFilterChange('brands', newBrands.length > 0 ? newBrands : '')
                    }}
                    className="rounded border-gray-medium text-main focus:ring-main w-4 h-4"
                  />
                  <span className="text-sm text-dark group-hover:text-main transition-colors duration-200">{brand}</span>
                </div>
                <span className="text-xs text-gray-dark bg-gray-medium px-2 py-1 rounded">
                  {count}
                </span>
              </label>
            )
          })}
        </div>
      </Card>
    )
  }

  const renderSelectFilter = (field: keyof Product, label: string, placeholder: string) => {
    const values = getUniqueValues(field)
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-dark">
            {label}
          </label>
          {filters[field] && (
            <button
              onClick={() => clearFilter(field)}
              className="text-xs text-error hover:text-red-700 transition-colors duration-200"
            >
              очистить
            </button>
          )}
        </div>
        <select
          value={filters[field] || ''}
          onChange={(e) => handleFilterChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark text-sm"
        >
          <option value="">{placeholder}</option>
          {values.map(value => {
            const count = getFilterCount(field, value)
            if (count === 0) return null
            
            return (
              <option key={value} value={value}>
                {value} ({count})
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  // для ноутбуков
  const renderLaptopFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('memory', 'Оперативная память', 'Любая память')}
        {renderSelectFilter('storage', 'Накопитель', 'Любой накопитель')}
        {renderSelectFilter('processor', 'Процессор', 'Любой процессор')}
        {renderSelectFilter('cores', 'Количество ядер', 'Любое количество')}
      </Card>
    </div>
  )

  // для телефонов
  const renderPhoneFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('storage', 'Память', 'Любая память')}
        {renderSelectFilter('memory', 'Оперативная память', 'Любая ОЗУ')}
        {renderSelectFilter('color', 'Цвет', 'Любой цвет')}
      </Card>
    </div>
  )

  //для наушников
  const renderHeadsetFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('color', 'Цвет', 'Любой цвет')}
      </Card>
    </div>
  )

  // для системных блоков
  const renderSystemUnitFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('memory', 'Оперативная память', 'Любая память')}
        {renderSelectFilter('storage', 'Накопитель', 'Любой накопитель')}
        {renderSelectFilter('processor', 'Процессор', 'Любой процессор')}
        {renderSelectFilter('cores', 'Количество ядер', 'Любое количество')}
      </Card>
    </div>
  )

  // для мониторов
  const renderMonitorFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('screen_size', 'Диагональ', 'Любая диагональ')}
        {renderSelectFilter('resolution', 'Разрешение', 'Любое разрешение')}
      </Card>
    </div>
  )

  //для аксессуаров
  const renderAccessoriesFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('color', 'Цвет', 'Любой цвет')}
      </Card>
    </div>
  )

  //для карт памяти
  const renderMemoryCardFilters = () => (
    <div className="space-y-4">
      {renderPriceFilter()}
      {renderBrandFilter()}
      
      <Card className="p-4 space-y-4">
        {renderSelectFilter('speed_class', 'Скорость', 'Любой класс')}
        {renderSelectFilter('form_factor', 'Форм-фактор', 'Любой размер')}
        {renderSelectFilter('storage', 'Объем', 'Любой объем')}
      </Card>
    </div>
  )

  const renderFilters = () => {
    switch (category) {
      case 'Ноутбуки':
        return renderLaptopFilters()
      case 'Телефоны':
        return renderPhoneFilters()
      case 'Наушники':
        return renderHeadsetFilters()
      case 'Системные блоки':
        return renderSystemUnitFilters()
      case 'Мониторы':
        return renderMonitorFilters()
      case 'Аксессуары':
        return renderAccessoriesFilters()
      case 'Карты памяти':
        return renderMemoryCardFilters()
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-dark">Выберите категорию для фильтрации</p>
          </div>
        )
    }
  }

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key]
      return value !== '' && value !== null && value !== undefined && 
             !(Array.isArray(value) && value.length === 0)
    }).length
  }

  if (!category) return null

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className="border border-gray-medium">
      <div className="flex justify-between items-center p-4 border-b border-gray-medium">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-lg text-dark">Фильтры</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-main text-dark text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => onFiltersChange({})}
            className="text-sm text-error hover:text-red-700 font-medium transition-colors duration-200"
          >
            Очистить все
          </button>
        )}
      </div>
      
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {renderFilters()}
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t border-gray-medium bg-gray-light">
          <p className="text-sm font-medium text-dark mb-3">Активные фильтры:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || 
                  (Array.isArray(value) && value.length === 0) || 
                  value === '') return null
              
              let displayValue = value
              let displayKey = key
              
              if (key === 'minPrice' && filters.maxPrice) {
                return (
                  <span
                    key="price"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-main text-dark"
                  >
                    Цена: {filters.minPrice}₽ – {filters.maxPrice}₽
                    <button
                      onClick={() => {
                        clearFilter('minPrice')
                        clearFilter('maxPrice')
                      }}
                      className="ml-2 hover:text-accent text-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                )
              } else if (key === 'minPrice' && !filters.maxPrice) {
                displayKey = 'Цена от'
                displayValue = `${value}₽`
              } else if (key === 'maxPrice' && !filters.minPrice) {
                displayKey = 'Цена до'
                displayValue = `${value}₽`
              } else if (key === 'inStock') {
                displayKey = 'Наличие'
                displayValue = 'В наличии'
              } else if (key === 'brands') {
                return (value as string[]).map(brand => (
                  <span
                    key={brand}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-main text-dark"
                  >
                    {brand}
                    <button
                      onClick={() => {
                        const newBrands = (value as string[]).filter(b => b !== brand)
                        handleFilterChange('brands', newBrands.length > 0 ? newBrands : '')
                      }}
                      className="ml-2 hover:text-accent text-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </span>
                ))
              }
              
              if (key === 'minPrice' && filters.maxPrice) return null
              if (key === 'maxPrice' && filters.minPrice) return null
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-main text-dark"
                >
                  {String(displayKey)}: {String(displayValue)}
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-2 hover:text-accent text-lg transition-colors duration-200"
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

export default CategoryFilters
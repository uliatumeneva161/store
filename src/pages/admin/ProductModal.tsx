import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null 
  onSuccess: () => void
}

const CATEGORIES = [
  'Телефоны',
  'Ноутбуки', 
  'Системные блоки',
  'Мониторы',
  'Наушники',
  'Аксессуары',
  'Карты памяти'
]

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // ✅ Состояние формы - все поля из базы данных
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
    brand: '',
    specifications: '',
    color: '',
    storage: '',
    memory: '',
    processor: '',
    cores: '',
    frequency: '',
    cache: '',
    speed_class: '',
    form_factor: '',
    screen_size: '',
    resolution: ''
  })

useEffect(() => {
  if (product) {
    if (!product.name && !product.price) {
      console.error('Product data', product)
      return
    }
    
    setFormData({
      name: product.name || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      image: product.image || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      brand: product.brand || '',
      specifications: typeof product.specifications === 'string' 
        ? product.specifications 
        : JSON.stringify(product.specifications, null, 2) || '',
      color: product.color || '',
      storage: product.storage || '',
      memory: product.memory || '',
      processor: product.processor || '',
      cores: product.cores || '',
      frequency: product.frequency || '',
      cache: product.cache || '',
      speed_class: product.speed_class || '',
      form_factor: product.form_factor || '',
      screen_size: product.screen_size || '',
      resolution: product.resolution || ''
    })
  } else {
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: '',
      brand: '',
      specifications: '',
      color: '',
      storage: '',
      memory: '',
      processor: '',
      cores: '',
      frequency: '',
      cache: '',
      speed_class: '',
      form_factor: '',
      screen_size: '',
      resolution: ''
    })
  }
  setError('')
}, [product, isOpen])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Заполните обязательные поля: название, цена и категория')
        }
        
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) ? parseFloat(formData.price) : 0,
        description: formData.description,
        image: formData.image || null,
        category: formData.category,
        stock: parseInt(formData.stock) ? parseInt(formData.stock) : 0,
        brand: formData.brand,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : null,
        color: formData.color,
        storage: formData.storage,
        memory: formData.memory,
        processor: formData.processor,
        cores: formData.cores ? parseInt(formData.cores) : null,
        frequency: formData.frequency,
        cache: formData.cache,
        speed_class: formData.speed_class,
        form_factor: formData.form_factor,
        screen_size: formData.screen_size,
        resolution: formData.resolution
      }

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (error) throw error
      } else {

        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error saving product:', err)
      setError(err.message || 'Произошла ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div 
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {product ? 'Редактирование товара' : 'Добавление товара'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена (₽) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ссылка на изображение
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите категорию</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество на складе
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Бренд
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цвет
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Хранилище
                  </label>
                  <input
                    type="text"
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Память
                  </label>
                  <input
                    type="text"
                    name="memory"
                    value={formData.memory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Характеристики (JSON)
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder='{"key": "value"}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Введите характеристики в формате JSON
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Сохранение...' : (product ? 'Обновить' : 'Добавить')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
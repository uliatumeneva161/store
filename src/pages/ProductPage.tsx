import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { Product } from '../types'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import ProductReviews from '../components/ProductReviews'
import ProductRecommendations from '../components/ProductRecommendations'
import LikeButton from '../components/LikeButton'
import { Button, Card } from '../ui'

interface ColorOption {
  name: string;
  image?: string;
  hex: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')

  useEffect(() => {
    if (id) {
      fetchProduct(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        throw error
      }
      
      setProduct(data)
    } catch (err: any) {
      console.error('Error fetching product:', err)
      setError(err.code === 'PGRST116' ? 'Товар не найден' : 'Произошла ошибка при загрузке товара')
    } finally {
      setLoading(false)
    }
  }

  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'Белый': '#FFFFFF',
      'Синий': '#007BFF', 
      'Серый': '#6C757D',
      'Черный': '#000000',
      'Фиолетовый': '#6F42C1',
      'Серебристый': '#C0C0C0',
      'Зеленый': '#28A745',
      'Красный': '#DC3545',
      'Розовый': '#E83E8C',
      'Прозрачный': 'linear-gradient( #8b4682ff, #ffff)',
      'Титановый синий': '#4682B4',
      'Нежно-бежевый': '#F5F5DC',
      'Розовое золото': '#E6BFB5',
      'Оранжевый': '#FFA500',
      'Коричневый': '#8B4513',
      'Платиновый': '#E5E4E2',
      'Черный с RGB': '#000000',
      'Серый космос': '#2F4F4F'
    }
    return colorMap[colorName] || '#CCCCCC'
  }

  const getAvailableColors = (): ColorOption[] => {
    if (!product?.color) return []
    
    const colorImages = product.specifications?.color_images || {}
    const colorNames = product.color.includes(',') 
      ? product.color.split(',').map(c => c.trim()).filter(c => c)
      : [product.color]
    
    return colorNames.map(colorName => ({
      name: colorName,
      image: colorImages[colorName],
      hex: getColorValue(colorName)
    }))
  }

  const getAllImages = (): string[] => {
    if (!product) return []
    
    const allImages: string[] = []
    
    if (product.image) {
      allImages.push(product.image)
    }
    
    const colors = getAvailableColors()
    colors.forEach(color => {
      if (color.image && color.image !== product.image && !allImages.includes(color.image)) {
        allImages.push(color.image)
      }
    })
    
    if (product.images?.length) {
      product.images.forEach(img => {
        if (img && !allImages.includes(img)) {
          allImages.push(img)
        }
      })
    }
    
    return allImages.length > 0 ? allImages : [product.image || '']
  }

  const getCurrentImage = (): string => {
    const images = getAllImages()
    return images[selectedImageIndex] || product?.image || ''
  }

  const handleColorSelect = (colorName: string) => {
    if (selectedColor === colorName) {
      setSelectedColor('')
      const images = getAllImages()
      const mainImageIndex = images.findIndex(img => img === product?.image)
      setSelectedImageIndex(mainImageIndex >= 0 ? mainImageIndex : 0)
    } else {
      setSelectedColor(colorName)
      const colors = getAvailableColors()
      const selectedColorData = colors.find(color => color.name === colorName)
      if (selectedColorData?.image) {
        const images = getAllImages()
        const colorImageIndex = images.findIndex(img => img === selectedColorData.image)
        if (colorImageIndex >= 0) {
          setSelectedImageIndex(colorImageIndex)
        }
      }
    }
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
    
    const images = getAllImages()
    const selectedImage = images[index]
    const colors = getAvailableColors()
    const colorForImage = colors.find(color => color.image === selectedImage)
    
    if (colorForImage) {
      setSelectedColor(colorForImage.name)
    } else {
      setSelectedColor('')
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      navigate('/checkout')
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Товар не найден'}
          </h1>
          <Button to="/products" variant="primary">
            Вернуться к товарам
          </Button>
        </div>
      </div>
    )
  }

  const images = getAllImages()
  const availableColors = getAvailableColors()
  const currentImage = getCurrentImage()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-gray-900">Главная</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-gray-900">Товары</Link>
        {product.category && (
          <>
            <span>›</span>
            <Link 
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-gray-900"
            >
              {product.category}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Галерея изображений */}
          <div>
            <Card className="p-4 mb-4">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </Card>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => {
                  const isActive = selectedImageIndex === index
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                        isActive ? 'border-main' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-gray-light text-dark text-sm px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-dark mb-4">
                {product.name}
              </h1>
              
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                  {product.review_count && (
                    <span className="text-gray-dark">({product.review_count} отзывов)</span>
                  )}
                </div>
              )}
            </div>

            <div className="text-4xl font-bold text-dark">
              {product.price} ₽
            </div>

            <div className={`text-lg ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
              {product.stock > 0 ? `✓ В наличии: ${product.stock} шт.` : '✗ Нет в наличии'}
            </div>

            <p className="text-gray-dark leading-relaxed">
              {product.description}
            </p>

            {/* Выбор цвета */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <span className="text-dark font-medium">Цвет:</span>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color.name)}
                      className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                        selectedColor === color.name 
                          ? 'border-main bg-main bg-opacity-10' 
                          : 'border-gray-medium hover:border-gray-dark'
                      }`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg border border-gray-300 mb-1"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-gray-dark max-w-16 text-center leading-tight">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-dark">
                    Выбран: <span className="font-medium">{selectedColor}</span>
                  </p>
                )}
              </div>
            )}

            {/* Выбор количества и кнопки действий */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-dark">Количество:</span>
                  <div className="flex items-center border border-gray-medium rounded-md">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-dark hover:text-dark disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-medium min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-dark hover:text-dark disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    className="flex-1"
                  >
                    Добавить в корзину
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="secondary"
                    className="flex-1"
                  >
                    Купить сейчас
                  </Button>
                </div>

                <div className="flex justify-center">
                  <LikeButton 
                    product={product} 
                    size="lg" 
                    showText={true} 
                  />
                </div>
              </div>
            )}

            {/* Характеристики */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-dark">Характеристики</h3>
              <div className="space-y-3">
                {product.brand && (
                  <div className="flex border-b border-gray-light pb-2">
                    <span className="flex-1 text-gray-dark">Бренд:</span>
                    <span className="flex-1 font-medium text-dark">{product.brand}</span>
                  </div>
                )}
                
                {product.color && (
                  <div className="flex border-b border-gray-light pb-2">
                    <span className="flex-1 text-gray-dark">Цвет:</span>
                    <span className="flex-1 font-medium text-dark">{product.color}</span>
                  </div>
                )}

                <div className="flex border-b border-gray-light pb-2">
                  <span className="flex-1 text-gray-dark">Наличие на складе:</span>
                  <span className={`flex-1 font-medium ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                    {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Отзывы и рекомендации */}
        <ProductReviews productId={product.id} />
        <ProductRecommendations productId={product.id} />
      </div>
    </div>
  )
}

export default ProductPage
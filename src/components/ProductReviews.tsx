import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Review } from '../types'
import { supabase } from '../lib/supabase'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ProductReviewsProps {
  productId: string
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
        // Если таблицы нет, показываем сообщение
        if (error.code === '42P01') {
          setError('Система отзывов временно недоступна')
        }
        return
      }
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Ошибка при загрузке отзывов')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Для добавления отзыва необходимо войти в систему')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            user_id: user.id,
            user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Пользователь',
            rating: newReview.rating,
            comment: newReview.comment.trim()
          }
        ])
        .select()

      if (error) {
        console.error('Error submitting review:', error)
        
        if (error.code === '42501') {
          setError('Недостаточно прав для добавления отзыва')
        } else if (error.code === '23505') {
          setError('Вы уже оставляли отзыв на этот товар')
        } else if (error.code === '42P01') {
          setError('Система отзывов временно недоступна')
        } else {
          setError('Ошибка при добавлении отзыва: ' + error.message)
        }
        return
      }
      setNewReview({ rating: 5, comment: '' })
      setShowReviewForm(false)
      
      if (data && data.length > 0) {
        setReviews(prev => [data[0], ...prev])
      }
      
    } catch (error) {
      console.error('Error submitting review:', error)
      setError('Произошла непредвиденная ошибка')
    } finally {
      setLoading(false)
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const userHasReviewed = user && reviews.some(review => review.user_id === user.id)

  if (reviewsLoading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 text-dark">Отзывы</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-b border-gray-medium pb-4">
              <div className="flex justify-between mb-2">
                <div className="bg-gray-medium h-4 w-24 rounded"></div>
                <div className="bg-gray-medium h-4 w-16 rounded"></div>
              </div>
              <div className="bg-gray-medium h-3 w-full rounded mb-1"></div>
              <div className="bg-gray-medium h-3 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-dark">Отзывы</h3>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-dark">{averageRating.toFixed(1)}</div>
            <div className="text-warning">
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </div>
          </div>
          <p className="text-sm text-gray-dark">{reviews.length} отзывов</p>
        </div>
      </div>

      {error && (
        <Card className="mb-4 p-4 border-error">
          <p className="text-error text-sm">{error}</p>
        </Card>
      )}

      {user && !showReviewForm && !userHasReviewed && (
        <div className="mb-6">
          <Button
            onClick={() => setShowReviewForm(true)}
            variant="primary"
          >
            Написать отзыв
          </Button>
        </div>
      )}

      {userHasReviewed && (
        <Card className="mb-6 p-4 border-success">
          <p className="text-success text-sm flex items-center">
            <span className="mr-2">✓</span>
            Вы уже оставили отзыв на этот товар
          </p>
        </Card>
      )}

      {!user && (
        <Card className="mb-6 p-4 border-main">
          <p className="text-main text-sm">
            Войдите в систему, чтобы оставить отзыв
          </p>
        </Card>
      )}

      {showReviewForm && (
        <Card className="p-6 mb-6">
          <h4 className="font-semibold text-lg mb-4 text-dark">Оставить отзыв</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-dark mb-3">
              Ваша оценка:
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className={`text-3xl focus:outline-none transition-transform hover:scale-110 ${
                    star <= newReview.rating ? 'text-warning' : 'text-gray-medium'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-dark mt-2">
              {newReview.rating} из 5 звезд
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-dark mb-2">
              Ваш комментарий *
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
              placeholder="Поделитесь вашим мнением о товаре. Что вам понравилось или не понравилось? (минимум 10 символов)..."
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-dark">
                Минимум 10 символов
              </p>
              <p className="text-xs text-gray-dark">
                {newReview.comment.length}/1000 символов
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loading || newReview.comment.trim().length < 10}
              variant={loading || newReview.comment.trim().length < 10 ? "ghost" : "primary"}
              onClick={handleSubmitReview}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </span>
              ) : (
                'Опубликовать отзыв'
              )}
            </Button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false)
                setError('')
                setNewReview({ rating: 5, comment: '' })
              }}
              className="border border-gray-medium text-gray-dark px-6 py-2 rounded-md hover:bg-gray-medium transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {reviews.map(review => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-dark text-lg">{review.user_name}</p>
                <p className="text-sm text-gray-dark">
                  {new Date(review.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-warning text-xl">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="text-gray-dark leading-relaxed text-base">{review.comment}</p>
          </Card>
        ))}

        {reviews.length === 0 && !error && (
          <Card className="text-center py-12">
            <div className="text-gray-dark mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-dark text-lg mb-2">Пока нет отзывов</p>
            <p className="text-gray-dark mb-4">Будьте первым, кто оставит отзыв об этом товаре!</p>
            {user && !userHasReviewed && (
              <Button
                onClick={() => setShowReviewForm(true)}
                variant="primary"
              >
                Написать первый отзыв
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
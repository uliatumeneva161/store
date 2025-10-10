import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useUserProfile } from '../hooks/useUserProfile'
import Button from '../ui/Button'
import Card from '../ui/Card'

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { state, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const { profile } = useUserProfile()

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      }))
    }
  }, [profile, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    
    if (numbers.length <= 1) return `+${numbers}`
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} (${numbers.slice(1)}`
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`
    if (numbers.length <= 9) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`
    
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value)
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }))
  }

  // Валидация формы
  const validateForm = () => {
    const shouldValidateAddress = !profile?.address
    const shouldValidatePhone = !profile?.phone

    if (shouldValidateAddress && !formData.address.trim()) {
      alert('Пожалуйста, заполните адрес доставки')
      return false
    }
    if (shouldValidatePhone && !formData.phone.trim()) {
      alert('Пожалуйста, заполните телефон')
      return false
    }
    if (!formData.email.trim()) {
      alert('Пожалуйста, заполните email')
      return false
    }
    return true
  }

  // Создание заказа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const orderItems = state.items.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      }))
      const finalAddress = profile?.address || formData.address
      const finalPhone = profile?.phone || formData.phone

      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id,
          items: orderItems,
          total: getTotalPrice(),
          address: finalAddress,
          payment_method: formData.paymentMethod,
          email: formData.email,
          phone: finalPhone
        }])
        .select()
        .single()

      if (error) throw error

      if ((!profile?.phone && formData.phone) || (!profile?.address && formData.address)) {
        await supabase.auth.updateUser({
          data: {
            phone: formData.phone || profile?.phone,
            address: formData.address || profile?.address
          }
        })
      }

      clearCart()
      navigate(`/order-success/${order.order_id}`)

    } catch (error: any) {
      console.error('Error creating order:', error)
      alert(`Ошибка при оформлении заказа: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-dark">Корзина пуста</h2>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
          >
            Вернуться к покупкам
          </Button>
        </Card>
      </div>
    )
  }

  const isAddressRequired = !profile?.address
  const isPhoneRequired = !profile?.phone

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-dark">Оформление заказа</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Левая колонка - форма */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Контактная информация */}
            <Card shadow="card" hover={false} className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-dark">Контактная информация</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Телефон {isPhoneRequired && '*'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required={isPhoneRequired}
                  className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  placeholder="+7 (999) 999-99-99"
                />
              </div>
            </Card>

            {/* Адрес доставки */}
            <Card shadow="card" hover={false} className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-dark">Адрес доставки</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Адрес доставки {isAddressRequired && '*'}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required={isAddressRequired}
                  className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  placeholder="Город, улица, дом, квартира"
                />
              </div>
            </Card>

            {/* Способ оплаты */}
            <Card shadow="card" hover={false} className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-dark">Способ оплаты</h2>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark"
              >
                <option value="card">Банковская карта</option>
                <option value="cash">Наличные при получении</option>
                <option value="online">Онлайн платеж</option>
              </select>
            </Card>

            {/* Кнопка оформления заказа */}
            <Button
              type="submit"
              disabled={loading}
              variant={loading ? "ghost" : "primary"}
              className="w-full py-4 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Оформление заказа...
                </div>
              ) : (
                `Оформить заказ за ${getTotalPrice().toLocaleString('ru-RU')} ₽`
              )}
            </Button>
          </form>
        </div>

        {/* Правая колонка - информация о заказе */}
        <div className="lg:sticky lg:top-8">
          <Card shadow="card" hover={false} className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-dark">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-medium"
                    />
                    <div>
                      <p className="font-medium text-dark">{item.product.name}</p>
                      <p className="text-gray-dark text-sm">Количество: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-dark">{(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-medium pt-4">
              <div className="flex justify-between text-lg font-semibold text-dark">
                <span>Итого:</span>
                <span>{getTotalPrice().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Order, UserProfile } from '../types'
import { supabase } from '../lib/supabase'
import { useUserProfile } from '../hooks/useUserProfile'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  
  const { profile, loading: profileLoading, updateProfile } = useUserProfile()
  
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    email: '',
    name: '',
    phone: '',
    address: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  // Сохранение изменений профиля
  const saveChanges = async () => {
    try {
      setSaving(true)
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      })
      alert('Изменения успешно сохранены!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Произошла ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  // Загрузка заказов пользователя
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  // Обработчик изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Цвет статуса заказа
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-dark'
      case 'shipped': return 'bg-accent text-dark'
      case 'confirmed': return 'bg-warning text-dark'
      case 'cancelled': return 'bg-error text-dark'
      default: return 'bg-gray-medium text-dark'
    }
  }

  // Текст статуса заказа
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'В обработке'
      case 'confirmed': return 'Подтвержден'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      case 'cancelled': return 'Отменен'
      default: return status
    }
  }

  const loading = ordersLoading || profileLoading

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-light">
        <div className="text-lg text-dark">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-dark mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Боковая панель */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-main bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-main font-semibold text-lg">
                  {user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-dark">{user?.user_metadata?.name || 'Пользователь'}</p>
                <p className="text-sm text-gray-dark">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'orders' 
                    ? 'bg-main text-dark shadow-card' 
                    : 'text-gray-dark hover:bg-gray-medium hover:text-dark'
                }`}
              >
                Мои заказы
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-main text-dark shadow-card' 
                    : 'text-gray-dark hover:bg-gray-medium hover:text-dark'
                }`}
              >
                Профиль
              </button>
            </nav>
          </Card>
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <Card>
              <div className="p-6 border-b border-gray-medium">
                <h2 className="text-xl font-semibold text-dark">История заказов</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-medium rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-dark mb-4">У вас еще нет заказов</p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="primary"
                  >
                    Начать покупки
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-medium">
                  {orders.map(order => (
                    <div key={order.order_id} className="p-6 hover:bg-gray-medium transition-colors duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-dark">Заказ #{order.order_id?.slice(-8) || 'N/A'}</p>
                          <p className="text-sm text-gray-dark">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg text-main">
                            {order.total ? order.total.toLocaleString('ru-RU') : '0'} ₽
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                            {getStatusText(order.status || 'pending')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-dark">
                              {item.name || 'Неизвестный товар'} × {item.quantity || 0}
                            </span>
                            <span className="font-medium text-main">
                              {((item.price || 0) * (item.quantity || 0)).toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-dark">
                          Адрес доставки: {order.address || 'Не указан'}
                        </span>
                        <button
                          onClick={() => navigate(`/order-success/${order.order_id}`)}
                          className="text-main hover:text-accent font-medium transition-colors duration-200"
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-dark mb-6">Настройки профиля</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-medium rounded-lg bg-gray-light text-gray-dark"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={saveChanges}
                  disabled={saving}
                  variant={saving ? "ghost" : "primary"}
                >
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
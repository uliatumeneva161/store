import React, { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import type { Product, Order } from '../../types'
import { supabase } from '../../lib/supabase'
import ProductModal from './ProductModal'
import Card from '../../ui/Card'
import Button from '../../ui/Button'

const AdminPage: React.FC = () => {
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    fetchData()
  }, [isAdmin, navigate, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'products') {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setProducts(data || [])
      } else if (activeTab === 'orders') {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        
        const ordersWithStatus = (data || []).map(order => ({
          ...order,
          status: order.status || 'pending',
          id: order.order_id || order.id
        }))
        
        setOrders(ordersWithStatus)
      } 
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    if (!product || !product.id) {
      return
    }
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleProductSaved = () => {
    fetchData() 
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!orderId) {
      console.error('Order ID is undefined')
      return
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('order_id', orderId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-dark">Админ-панель</h1>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        onSuccess={handleProductSaved}
      />

      <Card className="border border-gray-medium">
        <div className="border-b border-gray-medium">
          <nav className="flex space-x-8 px-6">
            {['products', 'orders', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-main text-main'
                    : 'border-transparent text-gray-dark hover:text-dark'
                }`}
              >
                {tab === 'products' && 'Товары'}
                {tab === 'orders' && 'Заказы'}
                {tab === 'analytics' && 'Аналитика'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-dark">Управление товарами</h2>
                <Button onClick={handleAddProduct} variant="primary">
                  Добавить товар
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-dark">Загрузка...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-medium">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-dark uppercase tracking-wider">
                          Товар
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-dark uppercase tracking-wider">
                          Цена
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-dark uppercase tracking-wider">
                          Категория
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-dark uppercase tracking-wider">
                          Остаток
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-dark uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-light divide-y divide-gray-medium">
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover mr-3 border border-gray-medium"
                              />
                              <div>
                                <div className="text-sm font-medium text-dark">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                            {product.price?.toLocaleString('ru-RU') || '0'} ₽
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                            {product.category || 'Не указана'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                            {product.stock || 0} шт.
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)} 
                              className="text-main hover:text-accent transition-colors duration-200"
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-error hover:text-red-800 transition-colors duration-200"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-dark">Управление заказами</h2>

              {loading ? (
                <div className="text-center py-8 text-dark">Загрузка...</div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id} className="p-4 border border-gray-medium">
                      {/* Мобильная версия */}
                      <div className="block lg:hidden space-y-4">
                        <div className="space-y-2">
                          <p className="font-semibold text-dark text-lg">
                            Заказ #{order?.id ? order.id.slice(-8) : 'N/A'}
                          </p>
                          <p className="text-base text-gray-dark">
                            {order?.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-base text-dark">
                            <span className="font-medium">Клиент:</span> {order?.email || 'Не указан'}
                          </p>
                          <p className="text-base text-dark">
                            <span className="font-medium">Телефон:</span> {order?.phone || 'Не указан'}
                          </p>
                          <p className="text-base text-dark">
                            <span className="font-medium">Адрес:</span> {order?.address || 'Не указан'}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-xl text-dark">
                            {order?.total ? order.total.toLocaleString('ru-RU') : '0'} ₽
                          </p>
                          <select
                            value={order?.status || 'pending'}
                            onChange={(e) => order?.id && updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="text-base px-3 py-2 border border-gray-medium focus:outline-none focus:ring-main focus:border-main bg-gray-light text-dark rounded-md min-w-0"
                          >
                            <option value="pending">Обработка</option>
                            <option value="confirmed">Подтвержден</option>
                            <option value="shipped">Отправлен</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменен</option>
                          </select>
                        </div>

                        <div className="border-t border-gray-medium pt-3">
                          <p className="font-medium mb-3 text-dark text-lg">Товары:</p>
                          <div className="space-y-2">
                            {order?.items?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-base">
                                <div className="flex-1">
                                  <p className="font-medium text-dark">{item?.name || 'Неизвестный товар'}</p>
                                  <p className="text-gray-dark">× {item?.quantity || 0}</p>
                                </div>
                                <span className="font-semibold text-dark whitespace-nowrap ml-4">
                                  {((item?.price || 0) * (item?.quantity || 0)).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            )) || <p className="text-gray-dark text-base">Товары не указаны</p>}
                          </div>
                        </div>
                      </div>

                      {/* Десктопная версия */}
                      <div className="hidden lg:block">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <p className="font-semibold text-dark text-lg">
                              Заказ #{order?.id ? order.id.slice(-8) : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-dark">
                              {order?.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                            </p>
                            <div className="grid grid-cols-2 gap-x-8 mt-2">
                              <div>
                                <p className="text-sm text-dark">
                                  <span className="font-medium">Клиент:</span> {order?.email || 'Не указан'}
                                </p>
                                <p className="text-sm text-dark">
                                  <span className="font-medium">Телефон:</span> {order?.phone || 'Не указан'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-dark">
                                  <span className="font-medium">Адрес:</span> {order?.address || 'Не указан'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-8">
                            <p className="font-semibold text-xl text-dark mb-3">
                              {order?.total ? order.total.toLocaleString('ru-RU') : '0'} ₽
                            </p>
                            <select
                              value={order?.status || 'pending'}
                              onChange={(e) => order?.id && updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="w-full px-4 py-2 text-base border-gray-medium focus:outline-none focus:ring-main focus:border-main bg-gray-light text-dark rounded-md"
                            >
                              <option value="pending">В обработке</option>
                              <option value="confirmed">Подтвержден</option>
                              <option value="shipped">Отправлен</option>
                              <option value="delivered">Доставлен</option>
                              <option value="cancelled">Отменен</option>
                            </select>
                          </div>
                        </div>

                        <div className="border-t border-gray-medium pt-4">
                          <p className="font-medium mb-3 text-dark">Товары:</p>
                          <div className="space-y-2">
                            {order?.items?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3 flex-1">
                                  <span className="text-dark">{item?.name || 'Неизвестный товар'}</span>
                                  <span className="text-gray-dark text-sm">× {item?.quantity || 0}</span>
                                </div>
                                <span className="font-semibold text-dark whitespace-nowrap">
                                  {((item?.price || 0) * (item?.quantity || 0)).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            )) || <p className="text-gray-dark">Товары не указаны</p>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-dark">Аналитика</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-main">
                  <p className="text-sm text-main font-medium">Всего заказов</p>
                  <p className="text-3xl font-bold text-dark">{orders.length}</p>
                </Card>
                <Card className="p-6 border-success">
                  <p className="text-sm text-success font-medium">Общий доход</p>
                  <p className="text-3xl font-bold text-dark">
                    {orders.reduce((sum, order) => sum + (order?.total || 0), 0).toLocaleString('ru-RU')} ₽
                  </p>
                </Card>
                <Card className="p-6 border-accent">
                  <p className="text-sm text-accent font-medium">Всего товаров</p>
                  <p className="text-3xl font-bold text-dark">{products.length}</p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AdminPage
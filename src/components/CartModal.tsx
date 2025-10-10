import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useDiscount } from '../hooks/useDiscount'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { state, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { validateDiscount, applyDiscount, markDiscountAsUsed, loading, error, setError } = useDiscount()
  
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const subtotal = getTotalPrice()
  const shipping = subtotal > 5000 ? 0 : 300
  const total = Math.max(0, subtotal - discountAmount + shipping)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setError('Введите промокод')
      return
    }

    const discount = await validateDiscount(discountCode, subtotal)
    if (discount) {
      const amount = applyDiscount(discount, subtotal)
      setDiscountAmount(amount)
      setAppliedDiscount(discount)
      setError('')
    }
  }

  const handleRemoveDiscount = () => {
    setDiscountCode('')
    setAppliedDiscount(null)
    setDiscountAmount(0)
    setError('')
  }

  const handleCheckout = () => {
    if (appliedDiscount) {
      markDiscountAsUsed(appliedDiscount.id)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-light opacity-90"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block align-bottom transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <Card className="overflow-hidden shadow-neon">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-dark">Корзина покупок</h3>
                <button
                  onClick={onClose}
                  className="text-gray-dark hover:text-dark transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {state.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-dark mb-4">Ваша корзина пуста</p>
                  <Link
                    to="/products"
                    onClick={onClose}
                  >
                    <Button variant="primary">
                      Начать покупки
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map(item => (
                    <div key={item.product.id} className="flex items-center space-x-4 border-b border-gray-medium pb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-medium"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-dark">{item.product.name}</h4>
                        <p className="text-gray-dark">{item.product.price.toLocaleString('ru-RU')} ₽ × {item.quantity}</p>
                        <p className="text-lg font-semibold text-dark">
                          {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-medium flex items-center justify-center hover:bg-gray-medium transition-colors duration-200 text-dark"
                        >
                          -
                        </button>
                        
                        <span className="w-8 text-center text-dark">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-medium flex items-center justify-center hover:bg-gray-medium transition-colors duration-200 text-dark"
                        >
                          +
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-error hover:text-red-800 ml-2 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {!appliedDiscount && (
                    <div className="border-t border-gray-medium pt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Промокод"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                        />
                        <Button
                          onClick={handleApplyDiscount}
                          disabled={loading || !discountCode.trim()}
                          variant={loading || !discountCode.trim() ? "ghost" : "secondary"}
                          className="whitespace-nowrap"
                        >
                          {loading ? '...' : 'Применить'}
                        </Button>
                      </div>
                      {error && <p className="text-error text-sm mt-2">{error}</p>}
                    </div>
                  )}

                  <div className="border-t border-gray-medium pt-4 space-y-3">
                    <div className="flex justify-between text-dark">
                      <span>Подытог:</span>
                      <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-success">
                        <span>Скидка ({appliedDiscount.code}):</span>
                        <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}

                    <div className="flex justify-between text-dark">
                      <span>Доставка:</span>
                      <span>{shipping === 0 ? 'Бесплатно' : `${shipping.toLocaleString('ru-RU')} ₽`}</span>
                    </div>

                    <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-medium pt-3 text-dark">
                      <span>Итого:</span>
                      <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>

                    {appliedDiscount && (
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-error hover:text-red-700 text-sm transition-colors duration-200"
                      >
                        Удалить промокод
                      </button>
                    )}
                    
                    <div className="flex space-x-3 mt-4">
                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="flex-1"
                      >
                        Очистить
                      </Button>
                      <Link
                        to="/checkout"
                        onClick={handleCheckout}
                        className="flex-1"
                      >
                        <Button variant="primary" className="w-full">
                          Оформить заказ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartModal
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '', name: '' })
      setError('')
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      
      if (isLogin) {
        await signIn(formData.email, formData.password)
      } else {
        await signUp(formData.email, formData.password, formData.name)
      }
      onClose()
      // Форма очистится автоматически благодаря useEffect
    } catch (err: any) {
      console.error(err)
      setError(err.message)
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
            className="absolute inset-0 bg-light opacity-90"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block text-left align-bottom transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <Card className="overflow-hidden shadow-neon">
            <div className="p-6">
              <div className="flex justify- items-center mb-6">
                <h3 className="text-lg font-medium text-dark">
                  {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-dark hover:text-dark transition-colors duration-200 ml-auto"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <Card className="border-error p-4 mb-4">
                  <p className="text-error text-sm">{error}</p>
                </Card>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-dark mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="Введите ваше имя"
                      className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите email"
                    autoComplete="username" 
                    className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите пароль"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full px-3 py-2 border border-gray-medium rounded-md focus:outline-none focus:ring-2 focus:ring-main bg-gray-light text-dark placeholder-gray-dark"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant={loading ? "ghost" : "primary"}
                  className="w-full"
                >
                  {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setFormData({ email: '', password: '', name: '' })
                  }}
                  className="text-main hover:text-accent font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Создать новый аккаунт' : ' Войти'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
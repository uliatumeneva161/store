import React from 'react'
import { Link, NavLink } from 'react-router-dom'

interface NavigationItem {
  path: string
  label: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: any 
  isAdmin: boolean
  onSignOut: () => void
  totalFavorites: number
  navigationItems: NavigationItem[]
  brandName: string
  onOpenAuth: () => void
  
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  isAdmin, 
  onSignOut, 
  totalFavorites,
  navigationItems,
  brandName,
  onOpenAuth // ← ДОБАВЬТЕ ЭТУ СТРОКУ
}) => {
  
  const handleSignOut = async () => {
    try {
      await onSignOut()
      onClose()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAuthClick = () => {
    onClose()
    onOpenAuth() 
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-light opacity-90" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-gray-light shadow-neon transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-gray-medium">
            <Link 
              to="/" 
              onClick={onClose}
              className="text-xl font-bold bg-gradient-to-r from-main to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
            >
              {brandName}
            </Link>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-dark hover:text-dark rounded-lg hover:bg-gray-medium transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
                    isActive
                      ? 'bg-main text-dark'
                      : 'text-gray-dark hover:text-dark hover:bg-gray-medium'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            <Link
              to="/favorites"
              className="flex items-center justify-between py-3 px-4 rounded-lg text-gray-dark hover:text-dark hover:bg-gray-medium transition-colors duration-200 font-medium"
              onClick={onClose}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Избранное</span>
              </div>
              {totalFavorites > 0 && (
                <span className="bg-error text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-card">
                  {totalFavorites}
                </span>
              )}
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-medium space-y-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="block py-3 px-4 rounded-lg text-gray-dark hover:text-dark hover:bg-gray-medium transition-colors duration-200 font-medium"
                >
                  Личный кабинет
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="block py-3 px-4 rounded-lg text-gray-dark hover:text-dark hover:bg-gray-medium transition-colors duration-200 font-medium"
                  >
                    Админ панель
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left py-3 px-4 rounded-lg text-error hover:bg-error hover:bg-opacity-20 transition-colors duration-200 font-medium"
                >
                  Выйти
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="w-full py-3 px-4 rounded-lg bg-main text-dark text-center hover:shadow-neon-hover transition-all duration-200 font-medium"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import CartModal from './CartModal'
import AuthModal from './AuthModal'
import MobileMenu from './MobileMenu'
import SearchWithAutocomplete from './SearchWithAutocomplete'
import { useFavorites } from '../context/FavoritesContext'
import { NAVIGATION_ITEMS, BRAND_NAME } from '../consts/navigation'

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { getTotalItems } = useCart()
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()
  const { getTotalFavorites } = useFavorites()
  
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <>
      <header className="bg-light shadow-card border-b border-gray-medium sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 lg:mb-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-dark hover:text-dark hover:bg-gray-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-main to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
              >
                {BRAND_NAME}
              </Link>
            </div>

            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchWithAutocomplete onSearch={handleSearch} searchTerm={searchTerm} />
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden lg:flex items-center space-x-6">
                  <Link
                    to="/profile"
                    className="text-gray-dark hover:text-dark font-medium transition-colors duration-200"
                  >
                    Личный кабинет
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-dark hover:text-dark font-medium transition-colors duration-200"
                    >
                      Админ
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-gray-dark hover:text-dark font-medium transition-colors duration-200"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden lg:block text-gray-dark hover:text-dark font-medium transition-colors duration-200"
                >
                  Войти
                </button>
              )}
              
              <Link 
                to="/favorites"
                className="relative p-2 text-gray-dark hover:text-dark transition-colors duration-200 hover:bg-gray-medium rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {getTotalFavorites() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-card">
                    {getTotalFavorites()}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-dark hover:text-dark transition-colors duration-200 hover:bg-gray-medium rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-card">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <SearchWithAutocomplete onSearch={handleSearch} searchTerm={searchTerm} />
          </div>
          <nav className="hidden lg:flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path} 
                className={({ isActive }) => 
                  `py-2 transition-colors duration-200 font-medium ${
                    isActive 
                      ? 'text-main font-bold' 
                      : 'text-gray-dark hover:text-dark'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
        totalFavorites={getTotalFavorites()}
        navigationItems={NAVIGATION_ITEMS}
        brandName={BRAND_NAME}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
    </>
  )
}

export default Header
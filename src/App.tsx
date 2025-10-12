import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/admin/AdminPage'
import FavoritesPage from './pages/FavoritesPage'
import Footer from './components/Footer'
import { FavoritesProvider } from './context/FavoritesContext'
import Categors from './components/Categors'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className='center'>
          <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <div className="min-h-screen bg-light text-dark">
                <Header />
                  <main className="flex-1 flex flex-col">

                  <div className="flex-1 flex flex-col">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/auth" element={<ProfilePage />} />
                      <Route path="/categories" element={<Categors />} />
                        
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>

                </main>
                <Footer/>
              </div>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
    </div>

  )
}

export default App
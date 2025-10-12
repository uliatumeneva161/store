import React from 'react'
import { Link } from 'react-router-dom'

export const FOOTER_CATEGORIES = [
  { name: 'Телефоны', path: '/products?category=Телефоны' },
  { name: 'Наушники', path: '/products?category=Наушники' },
  { name: 'Мониторы', path: '/products?category=Мониторы' },
  { name: 'Карты памяти', path: '/products?category=Карты памяти' },
  { name: 'Ноутбуки', path: '/products?category=Ноутбуки' },
  { name: 'Аксессуары', path: '/products?category=Аксессуары' },
] as const

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-light border-gray-medium border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-dark">SamReshung</h3>
            <p className="text-gray-dark">
              Лучшие товары по доступным ценам
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-dark">Категории</h4>
            <ul className="space-y-2 text-gray-dark">
              {FOOTER_CATEGORIES.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path} 
                    className="hover:text-dark transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-dark">Контакты</h4>
            <div className="text-gray-dark space-y-2">
              <p>+7 (999) 999 99 99</p>
              <p>sam-reshung@shop.ru</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-medium mt-8 pt-8 text-center text-gray-dark">
          <p>&copy; 2025 SamReshung</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
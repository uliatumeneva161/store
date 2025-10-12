import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const NotFoundPage: React.FC = () => {
  return (
    <div className="my-10 bg-light flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-main mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-dark mb-4">Страница не найдена</h2>
        <p className="text-gray-dark mb-8">
          Извините, но страница, которую вы ищете, не существует.
        </p>
        <Link to="/">
          <Button variant="primary">На главную</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
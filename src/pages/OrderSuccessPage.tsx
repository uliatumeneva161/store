import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto text-center p-8">
        <div className="bg-success bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-dark mb-4">Заказ успешно оформлен!</h1>
        
        <p className="text-gray-dark mb-2">
          Номер вашего заказа: <span className="font-semibold text-main">{orderId}</span>
        </p>
        
        <p className="text-gray-dark mb-8">
          Мы отправили подтверждение на вашу электронную почту. 
          Спасибо за покупку!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="sm:flex-1 max-w-xs mx-auto sm:mx-0">
            <Button variant="primary" className="w-full">
              Продолжить покупки
            </Button>
          </Link>
          
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="sm:flex-1 max-w-xs mx-auto sm:mx-0"
          >
            Распечатать подтверждение
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default OrderSuccessPage
import { supabase } from '../lib/supabase'
import type { Order } from '../types'

export const emailService = {
  async sendOrderConfirmation(order: Order, userEmail: string) {
    try {
      // Используем Supabase Edge Functions для отправки email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: `Подтверждение заказа #${order.id.slice(-8)}`,
          template: 'order-confirmation',
          data: {
            orderNumber: order.id.slice(-8),
            orderDate: new Date(order.created_at).toLocaleDateString('ru-RU'),
            customerName: order.customer_info?.firstName || 'Клиент',
            items: order.items,
            subtotal: order.total,
            shipping: order.total > 5000 ? 0 : 300,
            total: order.total,
            shippingAddress: order.shipping_address
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  },

  async sendOrderStatusUpdate(order: Order, userEmail: string) {
    try {
      const statusText = {
        pending: 'в обработке',
        confirmed: 'подтвержден',
        shipped: 'отправлен',
        delivered: 'доставлен',
        cancelled: 'отменен'
      }[order.status]

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: `Статус заказа #${order.id.slice(-8)} обновлен`,
          template: 'order-status-update',
          data: {
            orderNumber: order.id.slice(-8),
            status: statusText,
            trackingUrl: order.status === 'shipped' ? 'https://tracking.example.com' : null
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending status email:', error)
      throw error
    }
  },

  async sendWelcomeEmail(userEmail: string, userName: string) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: 'Добро пожаловать в SamReshung!',
          template: 'welcome',
          data: {
            name: userName,
            discountCode: 'WELCOME10'
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }
  }
}
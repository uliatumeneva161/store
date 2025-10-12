export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  images?: string[]
  specifications?: Record<string, string>
  rating?: number
  review_count?: number
  created_at?: string

  
  brand?: string
  color?: string
  storage?: string
  memory?: string
  processor?: string
  cores?: number
  frequency?: string
  cache?: string
  speed_class?: string
  form_factor?: string
  screen_size?: string
  resolution?: string


  likes_count?: number;
  is_liked_by_user?: boolean;
}

export interface Likes {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface CartItem {
  product: Product
  quantity: number
  name?: string 
  price?: number
}

export interface User {
  id: string
  email: string
  user_metadata?: {
    name?: string
  }
}

export interface Order {
  id: string
  order_id?: string  
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  address?: string      
  email?: string          
  phone?: string  
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export interface UserProfile {
  id?: string
  email?: string
  name?: string
  phone?: string
  address?: string
  created_at?: string
}


export interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order_amount?: number
  max_uses?: number
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  total: number
  discountCode?: string
}
export const __types = true;
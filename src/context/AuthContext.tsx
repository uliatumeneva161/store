import { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthProviderProps {
  children: React.ReactNode  
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  confirmUser: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const confirmUser = async (_email: string) => {
    try {
      const { data: _adminClient } = await supabase.auth.admin.updateUserById(
        user?.id || '',
        { email_confirm: true }
      )
    } catch (error) {
      console.error('Error confirming user:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()

    const { error, data } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    })
    
    if (error) {
      if (error.message.includes('Email не подтвержден')) {
        await signUp(cleanEmail, password, 'AutoConfirmUser')
        return
      }
      
      throw new Error('Неверный логин или пароль')
    }
    
    setUser(data.user)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase()
    
    const { error, data } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          full_name: name.trim(),
        }
      }
    })
    
    if (error) {
      if (error.message.includes('Вы уже зарегистрированы')) {
        await signIn(cleanEmail, password)
        return
      }
      
      throw new Error(`Ошибка регистрации: ${error.message}`)
    }
    
    if (data.user) {
      try {
        await signIn(cleanEmail, password)
      } catch (_loginError) {
        setUser(data.user)
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      confirmUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('ошибка') 
  }
  return context
}
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface AdminContextType {
  isAdmin: boolean
  checkAdminAccess: () => boolean
  adminUsers: string[] 
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({ children }: { children: any }) => {
  const { user } = useAuth()
  
  const [adminUsers] = useState(() => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS;
  
  
  return adminEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.includes('@'));

});

  const checkAdminAccess = (): boolean => {
    if (!user || !user.email) return false
    
    const hasAccess = adminUsers.includes(user.email)
  
    
    return hasAccess
  }

  const isAdmin = checkAdminAccess()

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      checkAdminAccess,
      adminUsers 
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
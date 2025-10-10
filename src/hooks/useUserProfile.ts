import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'

export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user) return
    
    try {
      const profileData: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      }
      
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address
        }
      })

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...profileData } : null)
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  }
}
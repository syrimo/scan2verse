import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout, setting loading to false')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          clearTimeout(loadingTimeout)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
          clearTimeout(loadingTimeout)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Note: Profile creation should only happen in mobile apps
        // Web sign-in should not automatically create profiles
      }
    })

    return () => {
      mounted = false
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          })

        if (error) {
          console.error('Error creating profile:', error)
        }
      } else {
        // Update existing profile with latest info
        const { error } = await supabase
          .from('profiles')
          .update({
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || existingProfile.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || existingProfile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error updating profile:', error)
        }
      }
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

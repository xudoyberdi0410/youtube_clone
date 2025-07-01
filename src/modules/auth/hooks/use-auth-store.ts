'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

interface AuthStore {
  isLoggedIn: boolean
  user: User | null
  loading: boolean
  setIsLoggedIn: (value: boolean) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      loading: true,
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ isLoggedIn: false, user: null, loading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        user: state.user 
      }), // Не сохраняем loading состояние в localStorage
    }
  )
)

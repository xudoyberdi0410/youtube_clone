"use client"

import { useState } from 'react'
import { useAuth as useAuthModule } from '@/modules/auth/hooks/use-auth'

export function useAuth() {
  const { isLoggedIn, user, loading } = useAuthModule()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      setShowAuthDialog(true)
      return
    }
    action()
  }

  return {
    user,
    isLoading: loading,
    isAuthenticated: isLoggedIn,
    requireAuth,
    showAuthDialog,
    setShowAuthDialog
  }
}

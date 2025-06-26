'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { updateProfile, uploadAvatar, deleteAccount } from '@/modules/auth/lib/auth-utils'
import { SettingsFormData } from '../types'

export const useSettings = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState<SettingsFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [cacheBuster, setCacheBuster] = useState('')

  // Cache-busting для аватара
  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`)
  }, [])

  // Заполнение формы данными пользователя
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user])

  // Редирект если не авторизован
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [loading, user, router])

  const updateFormData = (updates: Partial<SettingsFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    clearMessages()
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setSaving(false)
      return
    }

    try {
      const updateData: Record<string, string> = {
        username: formData.username,
        email: formData.email,
      }
      
      if (formData.password) {
        updateData.password = formData.password
      }

      await updateProfile(updateData)
      
      // Обновляем состояние авторизации
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
        setSuccess('Профиль успешно обновлен')
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err: unknown) {
      setError((err as Error).message || 'Ошибка обновления профиля')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {      await uploadAvatar(file)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }
      setSuccess('Аватар успешно загружен')
    } catch (error: unknown) {
      setError((error as Error).message || 'Ошибка загрузки аватара')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      return
    }

    try {      await deleteAccount()
      router.push("/")
    } catch (error: unknown) {
      setError((error as Error).message || 'Ошибка удаления аккаунта')
    }
  }

  return {
    user,
    loading,
    formData,
    saving,
    error,
    success,
    cacheBuster,
    updateFormData,
    clearMessages,
    handleSubmit,
    handleAvatarUpload,
    handleDeleteAccount
  }
}

// src/hooks/use-subscriptions.ts

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/hooks/use-auth'
import type { Subscription, SubscriptionCreate } from '@/types/api'

interface UseSubscriptionsOptions {
  channelId?: string
  immediate?: boolean
}

interface UseSubscriptionsState {
  subscriptions: Subscription[]
  isLoading: boolean
  error: string | null
  isSubscribed: boolean
  isToggling: boolean
}

/**
 * Хук для управления подписками на каналы
 */
export function useSubscriptions(options: UseSubscriptionsOptions = {}) {
  const { channelId, immediate = true } = options
  const { requireAuth, isAuthenticated } = useAuth()
  
  const [state, setState] = useState<UseSubscriptionsState>({
    subscriptions: [],
    isLoading: false,
    error: null,
    isSubscribed: false,
    isToggling: false,
  })

  const loadSubscriptions = useCallback(async () => {
    if (!isAuthenticated) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const apiClient = ApiClient.getInstance()
      const subscriptions = await apiClient.getSubscriptions()
      
      // Проверяем, подписан ли пользователь на текущий канал
      const isSubscribed = channelId 
        ? subscriptions.some(sub => sub.channel_id === parseInt(channelId))
        : false
      
      setState({
        subscriptions,
        isLoading: false,
        error: null,
        isSubscribed,
        isToggling: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load subscriptions'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
    }
  }, [isAuthenticated, channelId])

  const toggleSubscription = async () => {
    if (!channelId) return
    
    requireAuth(async () => {
      setState(prev => ({ ...prev, isToggling: true, error: null }))
      
      try {
        const apiClient = ApiClient.getInstance()
        const channelIdNum = parseInt(channelId)
        
        if (state.isSubscribed) {
          // Находим подписку для отписки
          const subscription = state.subscriptions.find(sub => sub.channel_id === channelIdNum)
          if (subscription) {
            await apiClient.unsubscribe(subscription.id)
            setState(prev => ({
              ...prev,
              isSubscribed: false,
              isToggling: false,
              subscriptions: prev.subscriptions.filter(sub => sub.id !== subscription.id),
            }))
          }
        } else {
          // Создаем новую подписку
          const subscriptionData: SubscriptionCreate = {
            channel_id: channelIdNum
          }
          
          const newSubscription = await apiClient.subscribe(subscriptionData)
          setState(prev => ({
            ...prev,
            isSubscribed: true,
            isToggling: false,
            subscriptions: [...prev.subscriptions, newSubscription],
          }))
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to toggle subscription'
        setState(prev => ({
          ...prev,
          isToggling: false,
          error: errorMessage,
        }))
        throw error
      }
    })
  }

  const subscribe = async () => {
    if (!state.isSubscribed) {
      await toggleSubscription()
    }
  }

  const unsubscribe = async () => {
    if (state.isSubscribed) {
      await toggleSubscription()
    }
  }

  useEffect(() => {
    if (immediate && isAuthenticated) {
      loadSubscriptions()
    }
  }, [immediate, isAuthenticated, channelId, loadSubscriptions])

  return {
    ...state,
    loadSubscriptions,
    toggleSubscription,
    subscribe,
    unsubscribe,
    subscribersCount: state.subscriptions.length, // Можно улучшить, если есть эндпоинт для подсчета
  }
}

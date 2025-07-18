// src/hooks/use-subscriptions.ts

import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiClient } from '@/lib/api-client'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { SubscriptionResponse } from '@/types/api'

interface UseSubscriptionsOptions {
  immediate?: boolean
}

interface UseSubscriptionsState {
  subscriptions: SubscriptionResponse[]
  isLoading: boolean
  error: string | null
}

/**
 * Хук для управления подписками на каналы
 */
export function useSubscriptions(options: UseSubscriptionsOptions = {}) {
  const { immediate = true } = options;
  const { isLoggedIn } = useAuth();
  const isMountedRef = useRef(true)

  const [state, setState] = useState<UseSubscriptionsState>({
    subscriptions: [],
    isLoading: false,
    error: null,
  });

  const loadSubscriptions = useCallback(async () => {
    if (!isLoggedIn || !isMountedRef.current) {
      setState({
        subscriptions: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const apiClient = ApiClient.getInstance();
      const apiResult = (await apiClient.getSubscriptions()) as
        | SubscriptionResponse[]
        | { data: SubscriptionResponse[] };
      // Defensive: ensure subscriptions is always an array
      const subscriptions = Array.isArray(apiResult)
        ? apiResult
        : apiResult?.data && Array.isArray(apiResult.data)
          ? apiResult.data
          : [];

      if (isMountedRef.current) {
        setState({
          subscriptions,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      if (!isMountedRef.current) return
      
      console.error("Failed to load subscriptions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load subscriptions";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (immediate && isLoggedIn) {
      loadSubscriptions();
    }
  }, [immediate, isLoggedIn, loadSubscriptions]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    ...state,
    loadSubscriptions,
    subscribersCount: state.subscriptions.length,
  };
}

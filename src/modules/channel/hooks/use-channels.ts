"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import type { Channel } from "@/types/api";
import { t } from "@/lib/i18n";

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Пока API не поддерживает получение всех каналов
      // Можно попробовать получить мой канал как пример
      try {
        const myChannel = await apiClient.getMyChannel();
        setChannels([myChannel]);
      } catch {
        // Если нет моего канала, оставляем пустой массив
        setChannels([]);
      }
    } catch (err) {
      console.error("Error loading channels:", err);
      setError(err instanceof Error ? err.message : t("channel.failedToLoad"));
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  return {
    channels,
    loading,
    error,
    refetch: loadChannels,
  };
}

// Хук для получения популярных или рекомендуемых каналов (заглушка)
export function usePopularChannels() {
  const [channels] = useState<Channel[]>([]);

  // Пока возвращаем пустой список, так как API не поддерживает эту функцию
  return {
    channels,
    loading: false,
    error: null,
    refetch: () => {},
  };
}

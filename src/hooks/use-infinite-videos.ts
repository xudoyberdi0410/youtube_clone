import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiClient } from '@/lib/api-client'
import { mapApiVideoToVideo } from '@/lib/utils/video-mapper'
import type { Video } from '@/types/video'
import type { VideoCategory } from '@/types/api'

interface UseInfiniteVideosOptions {
  category?: VideoCategory
  ident?: number
  pageSize?: number
}

interface UseInfiniteVideosState {
  videos: Video[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
}

const DEFAULT_PAGE_SIZE = 12

/**
 * Хук для бесконечной прокрутки видео с пагинацией
 */
export function useInfiniteVideos(options: UseInfiniteVideosOptions = {}) {
  const { category, ident, pageSize = DEFAULT_PAGE_SIZE } = options
  
  const [state, setState] = useState<UseInfiniteVideosState>({
    videos: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  })

  const [isHydrated, setIsHydrated] = useState(false)
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  // Эффект для гидратации
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const loadVideos = useCallback(async (
    page: number = 1, 
    categoryParam?: VideoCategory, 
    identParam?: number, 
    isLoadMore: boolean = false
  ) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController()

    const loadingState = isLoadMore ? 'isLoadingMore' : 'isLoading'
    
    setState(prev => ({ 
      ...prev, 
      [loadingState]: true, 
      error: null 
    }))
    
    try {
      const apiClient = ApiClient.getInstance()
      
      // Получаем видео (API возвращает обычный массив)
      const apiVideos = await apiClient.getVideos(identParam || ident, categoryParam || category)
      
      // Преобразуем API данные в формат компонентов
      const newVideos = apiVideos.map(mapApiVideoToVideo)
      
      // Сохраняем все видео для повторного использования
      setAllVideos(newVideos)
      
      // Для симуляции пагинации, берем только часть видео
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedVideos = newVideos.slice(startIndex, endIndex)
      
      setState(prev => ({
        ...prev,
        videos: page === 1 ? paginatedVideos : [...prev.videos, ...paginatedVideos],
        [loadingState]: false,
        hasMore: true, // Всегда есть еще видео (будут повторяться)
        currentPage: page,
        error: null,
      }))
    } catch (error) {
      // Игнорируем ошибки отмены запроса
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load videos'
      setState(prev => ({
        ...prev,
        [loadingState]: false,
        error: errorMessage,
      }))
    }
  }, [ident, category, pageSize])

  const loadMore = useCallback(() => {
    if (state.isLoadingMore) return
    
    const nextPage = state.currentPage + 1
    
    // Если у нас есть сохраненные видео, используем их для повторения
    if (allVideos.length > 0) {
      const startIndex = (nextPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      
      // Вычисляем индексы с учетом циклического повторения
      const actualStartIndex = startIndex % allVideos.length
      const actualEndIndex = endIndex % allVideos.length
      
      let paginatedVideos: Video[]
      
      if (actualEndIndex > actualStartIndex) {
        // Обычный случай
        paginatedVideos = allVideos.slice(actualStartIndex, actualEndIndex)
      } else {
        // Случай когда нужно взять с конца и начала массива
        const firstPart = allVideos.slice(actualStartIndex)
        const secondPart = allVideos.slice(0, actualEndIndex)
        paginatedVideos = [...firstPart, ...secondPart]
      }
      
      // Добавляем уникальные ID для повторяющихся видео
      const videosWithUniqueIds = paginatedVideos.map((video, index) => ({
        ...video,
        id: `${video.id}-${nextPage}-${index}` // Уникальный ID для каждого повторения
      }))
      
      setState(prev => ({
        ...prev,
        videos: [...prev.videos, ...videosWithUniqueIds],
        isLoadingMore: false,
        hasMore: true, // Всегда есть еще видео
        currentPage: nextPage,
      }))
    } else {
      // Если нет сохраненных видео, загружаем заново
      loadVideos(nextPage, category, ident, true)
    }
  }, [state.isLoadingMore, state.currentPage, allVideos, pageSize, loadVideos, category, ident])

  const refetch = useCallback(() => {
    setState(prev => ({
      ...prev,
      videos: [],
      hasMore: true,
      currentPage: 1,
    }))
    setAllVideos([])
    loadVideos(1, category, ident, false)
  }, [loadVideos, category, ident])

  const changeCategory = useCallback((newCategory?: VideoCategory) => {
    setState(prev => ({
      ...prev,
      videos: [],
      hasMore: true,
      currentPage: 1,
    }))
    setAllVideos([])
    loadVideos(1, newCategory, ident, false)
  }, [loadVideos, ident])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Начальная загрузка
  useEffect(() => {
    if (isHydrated) {
      loadVideos(1, category, ident, false)
    }
  }, [isHydrated, loadVideos, category, ident])

  return {
    ...state,
    loadMore,
    refetch,
    changeCategory,
  }
} 
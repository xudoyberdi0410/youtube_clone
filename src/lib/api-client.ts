import { buildApiUrl, getAuthHeaders } from './api-config'

// Типы для API ответов
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success?: boolean
}

export class ApiError extends Error {
  status?: number
  details?: any

  constructor(message: string, status?: number, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

// Основной класс для работы с API
export class ApiClient {
  private static instance: ApiClient
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint)
    const headers = getAuthHeaders()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      // Если ответ пустой, возвращаем пустой объект
      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }

  // GET запрос
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST запрос
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT запрос
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE запрос
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // POST запрос с FormData (для загрузки файлов)
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = buildApiUrl(endpoint)
    const token = getAuthHeaders().Authorization

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = token
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API FormData Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }

  // POST запрос с form-urlencoded (для логина)
  async postFormUrlencoded<T>(endpoint: string, data: Record<string, string>): Promise<T> {
    const url = buildApiUrl(endpoint)
    
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        )
      }

      const text = await response.text()
      if (!text) return {} as T
      
      return JSON.parse(text)
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API FormUrlencoded Request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error'
      )
    }
  }
}

// Экспортируем синглтон
export const apiClient = ApiClient.getInstance()

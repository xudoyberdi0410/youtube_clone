'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileVideo, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { validateFileUpload } from '@/lib/utils/validation'
import type { VideoCategory } from '@/types/api'

const VIDEO_CATEGORIES: { value: VideoCategory; label: string }[] = [
  { value: 'Musiqa', label: 'Музыка' },
  { value: "Ta'lim", label: 'Образование' },
  { value: 'Texnologiya', label: 'Технологии' },
  { value: "O'yinlar", label: 'Игры' },
  { value: 'Yangiliklar', label: 'Новости' },
  { value: "Ko'ngilochar", label: 'Развлечения' },
  { value: 'Sport', label: 'Спорт' },
  { value: 'Ilm-fan va Tabiat', label: 'Наука и природа' },
  { value: 'Sayohat', label: 'Путешествия' },
  { value: 'Oshxona va Pazandachilik', label: 'Кулинария' },
]

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
  videoType: 'video' | 'shorts' | null
}

export function UploadVideoForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<VideoCategory>('Musiqa')
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    videoType: null
  })

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateFileUpload(file, 'video')
    if (!validation.isValid) {
      setUploadState(prev => ({ ...prev, error: validation.error || 'Неверный файл' }))
      return
    }

    setSelectedFile(file)
    setUploadState(prev => ({ ...prev, error: null }))

    // Detect video orientation
    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    
    video.onloadedmetadata = () => {
      const isVertical = video.videoHeight > video.videoWidth
      setUploadState(prev => ({ 
        ...prev, 
        videoType: isVertical ? 'shorts' : 'video' 
      }))
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      setUploadState(prev => ({ ...prev, error: 'Не удалось определить ориентацию видео' }))
      URL.revokeObjectURL(video.src)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadState(prev => ({ ...prev, videoType: null, error: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      setUploadState(prev => ({ ...prev, error: 'Заполните все обязательные поля' }))
      return
    }

    setUploadState(prev => ({ 
      ...prev, 
      isUploading: true, 
      progress: 0, 
      error: null 
    }))

    try {
      const uploadData = {
        title: title.trim(),
        description: description.trim(),
        category
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90)
        }))
      }, 500)

      if (uploadState.videoType === 'shorts') {
        await apiClient.uploadShorts(selectedFile, uploadData)
      } else {
        await apiClient.uploadVideo(selectedFile, uploadData)
      }

      clearInterval(progressInterval)
      setUploadState(prev => ({ 
        ...prev, 
        progress: 100, 
        success: true, 
        isUploading: false 
      }))

      // Redirect after successful upload
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error instanceof Error ? error.message : 'Ошибка загрузки видео' 
      }))
    }
  }

  const reset = () => {
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setCategory('Musiqa')
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      videoType: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка видео</CardTitle>
        <CardDescription>
          Выберите видеофайл и заполните информацию о нём
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label htmlFor="video-upload">Видеофайл *</Label>
          <div
            className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <FileVideo className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {uploadState.videoType && (
                  <Badge variant={uploadState.videoType === 'shorts' ? 'secondary' : 'default'}>
                    {uploadState.videoType === 'shorts' ? 'Shorts (Вертикальное)' : 'Видео (Горизонтальное)'}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    Перетащите видеофайл сюда или нажмите для выбора
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Поддерживаются форматы: MP4, WebM, MOV, AVI
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              Выбрать файл
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название видео"
              maxLength={100}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/100 символов
            </p>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите ваше видео (необязательно)"
              maxLength={5000}
              className="mt-1 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/5000 символов
            </p>
          </div>

          <div>
            <Label htmlFor="category">Категория</Label>
            <Select value={category} onValueChange={(value: VideoCategory) => setCategory(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadState.isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Загрузка видео</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(uploadState.progress)}%
              </span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {uploadState.success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Видео успешно загружено! Перенаправление на главную...
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title.trim() || uploadState.isUploading}
            className="flex-1"
          >
            {uploadState.isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Загрузить видео
              </>
            )}
          </Button>

          {(selectedFile || uploadState.success) && (
            <Button variant="outline" onClick={reset}>
              Очистить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
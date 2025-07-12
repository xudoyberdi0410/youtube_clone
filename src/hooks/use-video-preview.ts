"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseVideoPreviewOptions {
  videoUrl?: string
  previewDelay?: number
  autoPlay?: boolean
}

export function useVideoPreview({
  videoUrl,
  previewDelay = 500,
  autoPlay = true
}: UseVideoPreviewOptions = {}) {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringRef = useRef(false)

  const startPreview = useCallback(() => {
    if (!videoUrl || !videoRef.current) return

    isHoveringRef.current = true
    
    // Задержка перед началом предварительного воспроизведения
    previewTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) return
      
      const video = videoRef.current
      if (!video) return

      video.src = videoUrl
      video.muted = isMuted
      video.loop = true
      video.playsInline = true
      video.preload = 'metadata'
      
      if (autoPlay) {
        video.play().then(() => {
          setIsPreviewing(true)
        }).catch(() => {
          // Игнорируем ошибки автовоспроизведения
        })
      }
    }, previewDelay)
  }, [videoUrl, previewDelay, autoPlay, isMuted])

  const stopPreview = useCallback(() => {
    isHoveringRef.current = false
    
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
      previewTimeoutRef.current = null
    }

    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
      video.pause()
      video.currentTime = 0
      video.src = ''
    }
    
    setIsPreviewing(false)
    setIsLoaded(false)
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback((value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev
      if (videoRef.current) {
        videoRef.current.muted = newMuted
      }
      return newMuted
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    startPreview()
  }, [startPreview])

  const handleMouseLeave = useCallback(() => {
    stopPreview()
  }, [stopPreview])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current)
      }
    }
  }, [])

  return {
    videoRef,
    isPreviewing,
    isLoaded,
    currentTime,
    duration,
    isMuted,
    handleMouseEnter,
    handleMouseLeave,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
    toggleMute,
    startPreview,
    stopPreview
  }
} 
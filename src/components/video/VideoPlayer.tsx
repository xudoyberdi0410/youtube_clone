"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  SkipBack,
  SkipForward
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from '@/lib/api-client'

interface VideoPlayerProps {
  videoId?: string
  src?: string
  poster?: string
  title?: string
  autoPlay?: boolean
  className?: string
  fallbackSrc?: string
  startTime?: number
}

export function VideoPlayer({ 
  videoId = "demo",
  src,
  // poster = "/previews/previews1.png",
  // title = "Video",
  autoPlay = false,
  className = "",
  fallbackSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  startTime = 0
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(autoPlay)
  const hasAddedToHistory = useRef(false)
  const instantPlayRef = useRef<{ videoId: string; videoUrl: string; currentTime: number } | null>(null)

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)
  
  const resetHideControlsTimer = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
      hideControlsTimeout.current = null
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  useEffect(() => {
    resetHideControlsTimer()
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
        hideControlsTimeout.current = null
      }
    }
  }, [resetHideControlsTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [isPlaying])

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      videoRef.current.muted = newMuted
      if (newMuted) {
        videoRef.current.volume = 0
      } else {
        videoRef.current.volume = volume
      }
    }
  }, [isMuted, volume])

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }, [duration, currentTime])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  // Проверяем мгновенное воспроизведение при загрузке
  useEffect(() => {
    try {
      const instantPlayData = sessionStorage.getItem('instantPlay')
      if (instantPlayData) {
        const data = JSON.parse(instantPlayData)
        // Проверяем, что данные не старше 5 секунд и соответствуют текущему видео
        if (Date.now() - data.timestamp < 5000 && data.videoId === videoId) {
          instantPlayRef.current = data
          // Очищаем данные из sessionStorage
          sessionStorage.removeItem('instantPlay')
                  // Устанавливаем автовоспроизведение
        setShouldAutoPlay(true)
        }
      }
    } catch (error) {
      console.error('Error parsing instant play data:', error)
    }
  }, [videoId])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
      setHasError(false)
      
      // Если есть данные мгновенного воспроизведения, устанавливаем время
      if (instantPlayRef.current) {
        const { currentTime: instantTime } = instantPlayRef.current
        if (instantTime > 0 && instantTime < videoRef.current.duration) {
          videoRef.current.currentTime = instantTime
          setCurrentTime(instantTime)
        }
        // Автоматически начинаем воспроизведение
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          // Игнорируем ошибки автовоспроизведения
        })
        instantPlayRef.current = null
      } else if (shouldAutoPlay) {
        // Обычное автовоспроизведение
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {
          // Игнорируем ошибки автовоспроизведения
        })
      }
      // Если задан startTime, устанавливаем его
      if (startTime > 0 && startTime < videoRef.current.duration) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setIsBuffering(false)
    if (!hasAddedToHistory.current && videoId && videoId !== 'demo') {
      hasAddedToHistory.current = true
      apiClient.addToHistory({ video_id: Number(videoId) }).catch(() => {})
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleWaiting = () => {
    setIsBuffering(true)
  }

  const handleCanPlay = () => {
    setIsBuffering(false)
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    setIsBuffering(false)
    if (videoRef.current && videoRef.current.src !== fallbackSrc) {
      console.log('Primary video failed, trying fallback...')
      videoRef.current.src = fallbackSrc
      setHasError(false)
      setIsLoading(true)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skipTime(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          skipTime(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          handleVolumeChange([Math.min(1, volume + 0.1)])
          break
        case 'ArrowDown':
          e.preventDefault()
          handleVolumeChange([Math.max(0, volume - 0.1)])
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [volume, isPlaying, currentTime, duration, togglePlay, skipTime, handleVolumeChange, toggleMute, toggleFullscreen])

  const getVideoSrc = () => {
    if (src) return src;
    switch (videoId) {
      case 'demo':
        return '/sample-video.mp4';
      case 'big-buck-bunny':
        return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      case 'elephant-dream':
        return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
      default:
        return '/sample-video.mp4';
    }
  };
  
  const videoSrc = getVideoSrc();

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-video bg-background rounded-lg overflow-hidden group ${className}`}
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        autoPlay={shouldAutoPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onClick={togglePlay}
        data-testid="video-player"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="text-foreground text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('video.loading')}</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-center p-8">
            <div className="mb-4">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-lg mb-2">{t('video.unableToLoad')}</p>
            <p className="text-sm text-gray-400 mb-4">
              {t('video.addSampleFile')} <code className="bg-gray-800 px-2 py-1 rounded">sample-video.mp4</code> {t('video.toPublicFolder')}
            </p>
            <p className="text-xs text-gray-500">
              {t('video.temporarilyUnavailable')}
            </p>
          </div>
        </div>
      )}
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Speed indicator */}
      {playbackRate !== 1 && (
        <div className="absolute top-4 right-4 bg-background/80 text-foreground px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm border border-border/20">
          {playbackRate}x
        </div>
      )}
      
      <div 
        ref={controlsRef}
        className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-foreground hover:bg-primary/20 p-4 rounded-full pointer-events-auto"
            >
              <Play className="w-12 h-12" />
            </Button>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-auto">
          <div className="relative group/progress">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="
                w-full cursor-pointer
                [&_[data-part=track]]:bg-white/20
                [&_[data-part=range]]:bg-red-600
                [&_[data-part=thumb]]:bg-red-600
                [&_[data-part=thumb]]:w-3
                [&_[data-part=thumb]]:h-3
                [&_[data-part=thumb]]:opacity-0
                group-hover/progress:[&_[data-part=thumb]]:opacity-100
                [&_[data-part=track]]:h-1
                group-hover/progress:[&_[data-part=track]]:h-2
                transition-all
              "
            />
          </div>
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="text-white hover:bg-white/20 p-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(-10);
                }}
                className="text-white hover:bg-white/20 p-2"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(10);
                }}
                className="text-white hover:bg-white/20 p-2"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                
                <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="
                      [&_[data-part=track]]:bg-white/30
                      [&_[data-part=range]]:bg-white
                      [&_[data-part=thumb]]:bg-white
                      [&_[data-part=thumb]]:w-3
                      [&_[data-part=thumb]]:h-3
                    "
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {playbackRate !== 1 && (
                  <span className="text-xs bg-primary/20 px-2 py-1 rounded backdrop-blur-sm">
                {playbackRate === 1 ? t('video.speedNormal') : `${playbackRate}x`}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black text-white border-gray-700">
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                    {t('video.speed')}: 0.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.75)}>
                    {t('video.speed')}: 0.75x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1)}>
                    {t('video.speed')}: {t('video.speedNormal')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.25)}>
                    {t('video.speed')}: 1.25x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                    {t('video.speed')}: 1.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(2)}>
                    {t('video.speed')}: 2x
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="text-white hover:bg-white/20 p-2"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
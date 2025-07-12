"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { VideoDescription } from '@/components/video/VideoDescription'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { VideoCommentsWrapper } from '@/components/video/VideoCommentsWrapper'
import { useAuth } from '@/hooks/use-auth'
import { useVideoStats } from '@/hooks/use-video-stats'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal,
  Bookmark,
  Bell,
  Copy,
  Share2
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { t } from '@/lib/i18n';
import { Telegram, X, Instagram, Whatsapp } from '@/components/youtube-icons'

interface PrimaryColumnProps {
  videoId?: string
  title?: string
  channelName?: string
  channelAvatar?: string
  channelId?: string
  subscriberCount?: string
  viewCount?: string
  publishDate?: string
  description?: string
  videoUrl?: string
  likes?: number
  dislikes?: number
  isSubscribed?: boolean
  category?: string
  startTime?: number
}

export function PrimaryColumn({ 
  videoId,
  title,
  channelName,
  channelAvatar,
  channelId,
  subscriberCount,
  viewCount,
  publishDate,
  description,
  videoUrl,
  category,
  startTime = 0
}: PrimaryColumnProps) {
  const { requireAuth, showAuthDialog, setShowAuthDialog } = useAuth()
  const [saved, setSaved] = useState(false)
  const [shareOpen, setShareOpen] = useState(false);
  
  // Используем объединенный хук для получения актуальной статистики и методов действий
  const { 
    views,
    likesCount, 
    dislikesCount,
    isLiked, 
    isDisliked, 
    isSubscribed: subscribed,
    isLoadingLikes,
    isLoadingSubscription,
    handleLike,
    handleDislike,
    handleToggleSubscription
  } = useVideoStats({ videoId, channelId })

  const handleSubscribe = async () => {
    await handleToggleSubscription()
  }

  const handleSave = () => {
    requireAuth(() => {
      setSaved(!saved)
    })
  }

  const handleSeek = (seconds: number) => {
    // TODO: Implement video seeking functionality
    console.log(`Seeking to ${seconds} seconds`)
  }

  return (
    <div id="primary" className="w-full">
      <div id="primary-inner" className="space-y-4">
        {/* Video Player */}
        <VideoPlayer
          videoId={videoId}
          title={title}
          src={videoUrl}
          autoPlay={true}
          fallbackSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          startTime={startTime}
        />

        {/* Video Title */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground leading-tight">
            {title}
          </h1>
        </div>

        {/* Channel Info and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Channel Avatar and Info */}
            <a
              href={channelName ? `/channel?name=${encodeURIComponent(channelName)}` : '#'}
              className="flex items-center space-x-3 group hover:bg-muted rounded-lg px-2 py-1 transition-colors cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={channelAvatar} alt={channelName} />
                <AvatarFallback>{channelName?.[0] || 'C'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{channelName}</span>
                <span className="text-sm text-muted-foreground">{subscriberCount} {t('channel.subscribers')}</span>
              </div>
            </a>

            {/* Subscribe Button */}
            <Button
              onClick={handleSubscribe}
              disabled={isLoadingSubscription}
              variant="ghost"
              className={`ml-4 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                subscribed 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200" 
                  : "bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
              }`}
            >
              {isLoadingSubscription ? (
                "Loading..."
              ) : subscribed ? (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  {t('channel.subscribed')}
                </>
              ) : (
                t('channel.subscribe')
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Like/Dislike */}
            <div className="flex items-center bg-secondary rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLoadingLikes}
                className={`rounded-l-full ${isLiked ? "text-blue-500" : "text-foreground"} hover:bg-secondary/80`}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {isLoadingLikes ? '...' : likesCount.toLocaleString()}
              </Button>
              <Separator orientation="vertical" className="h-6 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDislike}
                disabled={isLoadingLikes}
                className={`rounded-r-full ${isDisliked ? "text-red-500" : "text-foreground"} hover:bg-secondary/80`}
              >
                <ThumbsDown className="w-4 h-4" />
                {isLoadingLikes ? '...' : (dislikesCount > 0 ? dislikesCount.toLocaleString() : '')}
              </Button>
            </div>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              className="bg-secondary text-foreground hover:bg-secondary/80 rounded-full"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t('video.share')}
            </Button>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`bg-secondary hover:bg-secondary/80 rounded-full ${saved ? "text-blue-500" : "text-foreground"}`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              {t('video.save')}
            </Button>

            {/* More Options */}
            <Button variant="ghost" size="sm" className="bg-secondary text-foreground hover:bg-secondary/80 rounded-full">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Description */}
        <VideoDescription
          description={description || ''}
          viewCount={views?.toLocaleString() || viewCount}
          publishDate={publishDate}
          category={category}
          onSeek={handleSeek}
          maxPreviewLength={150}
        />

        {/* Comments Section */}
        {videoId && <VideoCommentsWrapper videoId={videoId} className="mt-6" />}

        {/* Auth Required Dialog */}
        <AuthRequiredDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </div>
      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        videoId={videoId}
        title={title}
      />
    </div>
  )
}

// Новый компонент ShareDialog с чекбоксом и временем
function ShareDialog({ open, onOpenChange, videoId, title }: { open: boolean, onOpenChange: (v: boolean) => void, videoId?: string, title?: string }) {
  const [withTime, setWithTime] = useState(false);
  const [mmss, setMmss] = useState('00:00');
  const inputRef = useRef<HTMLInputElement>(null);

  // Преобразование mm:ss <-> секунды
  const mmssToSeconds = (str: string) => {
    const [mm, ss] = str.split(':').map(Number);
    return (isNaN(mm) ? 0 : mm) * 60 + (isNaN(ss) ? 0 : ss);
  };
  const secondsToMmss = (sec: number) => {
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  // При открытии попапа — подставить текущее время видео
  React.useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const video = document.querySelector('video');
      if (video) setMmss(secondsToMmss(Math.floor(video.currentTime)));
    }
  }, [open]);

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch?v=${videoId}` : '';
  const shareUrl = withTime ? `${baseUrl}&t=${mmssToSeconds(mmss)}` : baseUrl;

  const handleCopy = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
    if (inputRef.current) inputRef.current.select();
  };

  // Обработка изменения mm:ss
  const handleMmssChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9:]/g, '');
    // Автоматически форматировать в mm:ss
    if (value.length === 2 && !value.includes(':')) value += ':';
    if (value.length > 5) value = value.slice(0, 5);
    setMmss(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{t('video.share')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {/* Соцсети */}
          <div className="flex flex-row gap-3 justify-center mb-1 mt-2">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 transition"
              title={t('video.shareToTelegram')}
            >
              <Telegram className="w-5 h-5" />
            </a>
            <a
              href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 transition"
              title={t('video.shareToX')}
            >
              <X className="w-5 h-5" />
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 transition"
              title={t('video.shareToInstagram')}
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 transition"
              title={t('video.shareToWhatsapp')}
            >
              <Whatsapp className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title || '',
                    url: shareUrl,
                  })
                }
              }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 transition"
              title={t('video.shareToSystem')}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><path d="M13 5.828V16a1 1 0 1 1-2 0V5.828l-3.293 3.293a1 1 0 0 1-1.414-1.414l5-5a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.414L13 5.828Z" fill="currentColor"/><path d="M5 13a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>
              </span>
            </button>
          </div>
          {/* Ссылка и Copy */}
          <div className="flex items-center gap-2 bg-muted rounded px-2 py-1 mt-1">
            <input
              ref={inputRef}
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent outline-none text-xs"
              onFocus={e => e.target.select()}
            />
            <button onClick={handleCopy} className="p-1 hover:bg-primary/10 rounded transition" title={t('video.copyLink') || 'Copy link'}>
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {/* Чекбокс с временем */}
          <div className="border-t border-border my-1" />
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-1">
            <input
              type="checkbox"
              checked={withTime}
              onChange={e => setWithTime(e.target.checked)}
              className="accent-primary"
            />
            <span>Start at</span>
            <input
              type="text"
              value={mmss}
              onChange={handleMmssChange}
              disabled={!withTime}
              className="w-14 px-1 py-0.5 rounded border text-xs bg-muted-foreground/10 text-muted-foreground disabled:opacity-60 text-center"
              placeholder="mm:ss"
              maxLength={5}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
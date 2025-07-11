"use client"

import React, { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast';
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
  category
}: PrimaryColumnProps) {
  const { requireAuth, showAuthDialog, setShowAuthDialog } = useAuth()
  const [saved, setSaved] = useState(false)
  const [shareOpen, setShareOpen] = useState(false);
  const videoUrlFull = typeof window !== 'undefined' ? window.location.href : '';
  const { toast } = useToast();
  const handleCopy = () => {
    if (navigator.clipboard && videoUrlFull) {
      navigator.clipboard.writeText(videoUrlFull);
      toast({ title: t('video.linkCopied') });
    }
  };
  
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
          autoPlay={false}
          fallbackSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t('video.share')}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-muted rounded px-2 py-1">
              <input
                type="text"
                value={videoUrlFull}
                readOnly
                className="flex-1 bg-transparent outline-none text-xs"
                onFocus={e => e.target.select()}
              />
              <button onClick={handleCopy} className="p-1 hover:bg-primary/10 rounded transition" title={t('video.copyLink') || 'Copy link'}>
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(videoUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted text-foreground hover:bg-primary/10 text-sm font-medium"
                title={t('video.shareToTelegram')}
              >
                <Telegram className="w-5 h-5" />
                {t('video.shareToTelegram')}
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(videoUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted text-foreground hover:bg-primary/10 text-sm font-medium"
                title={t('video.shareToX')}
              >
                <X className="w-5 h-5" />
                {t('video.shareToX')}
              </a>
              <a
                href={`https://www.instagram.com/?url=${encodeURIComponent(videoUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted text-foreground hover:bg-primary/10 text-sm font-medium"
                title={t('video.shareToInstagram')}
              >
                <Instagram className="w-5 h-5" />
                {t('video.shareToInstagram')}
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(videoUrlFull)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted text-foreground hover:bg-primary/10 text-sm font-medium"
                title={t('video.shareToWhatsapp')}
              >
                <Whatsapp className="w-5 h-5" />
                {t('video.shareToWhatsapp')}
              </a>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: title || '',
                      url: videoUrlFull,
                    })
                  } else {
                    toast({ title: t('video.systemShareNotSupported') })
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-muted hover:bg-primary/10 transition text-sm font-medium text-foreground"
                title={t('video.shareToSystem')}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><path d="M13 5.828V16a1 1 0 1 1-2 0V5.828l-3.293 3.293a1 1 0 0 1-1.414-1.414l5-5a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.414L13 5.828Z" fill="currentColor"/><path d="M5 13a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>
                </span>
                Еще
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
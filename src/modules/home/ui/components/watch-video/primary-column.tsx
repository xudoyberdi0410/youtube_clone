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
  Share, 
  MoreHorizontal,
  Bookmark,
  Bell,
  Copy,
  Share2
} from 'lucide-react'
import { VerifiedIcon } from '@/components/youtube-icons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

  // SVG-иконки соцсетей (официальные)
  const TelegramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9.036 15.956l-.396 4.012c.568 0 .814-.244 1.112-.537l2.664-2.522 5.522 4.033c1.012.557 1.736.264 1.99-.94l3.606-16.84c.33-1.527-.553-2.127-1.54-1.792L1.36 9.49c-1.49.522-1.472 1.27-.254 1.61l4.372 1.366 10.164-6.41c.48-.312.92-.138.56.174" fill="#229ED9"/></svg>
  );
  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17.53 6.47a.75.75 0 0 0-1.06 0L12 10.94 7.53 6.47a.75.75 0 0 0-1.06 1.06L10.94 12l-4.47 4.47a.75.75 0 1 0 1.06 1.06L12 13.06l4.47 4.47a.75.75 0 0 0 1.06-1.06L13.06 12l4.47-4.47a.75.75 0 0 0 0-1.06z" fill="#000"/></svg>
  );
  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><radialGradient id="ig" cx="50%" cy="50%" r="80%"><stop offset="0%" stopColor="#f9ce34"/><stop offset="30%" stopColor="#ee2a7b"/><stop offset="60%" stopColor="#6228d7"/></radialGradient><rect width="24" height="24" rx="5" fill="url(#ig)"/><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8A4.8 4.8 0 1 0 12 7.2Z" stroke="#fff" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/></svg>
  );
  const WhatsappIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.711.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/></svg>
  );
  const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#ececec"/><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" fill="#888"/></svg>
  );

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
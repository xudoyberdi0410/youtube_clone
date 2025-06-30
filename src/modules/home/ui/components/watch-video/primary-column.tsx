"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Comments } from './comments'
import { VideoDescription } from '@/components/video/VideoDescription'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { useAuth } from '@/hooks/use-auth'
import { useVideoStats } from '@/hooks/use-video-stats'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
import { ErrorDisplay } from '@/components/ui/error-display'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  MoreHorizontal,
  Bookmark,
  Bell
} from 'lucide-react'
import { VerifiedIcon } from '@/components/youtube-icons'

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
  commentsCount?: number
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
  commentsCount = 0
}: PrimaryColumnProps) {
  const { requireAuth, showAuthDialog, setShowAuthDialog } = useAuth()
  const [saved, setSaved] = useState(false)
  
  // Используем объединенный хук для получения актуальной статистики и методов действий
  const { 
    views,
    likesCount, 
    dislikesCount,
    commentsCount: realCommentsCount,
    isLiked, 
    isDisliked, 
    isSubscribed: subscribed,
    isLoadingLikes,
    isLoadingSubscription,
    error,
    refreshStats,
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
            <Avatar className="w-10 h-10">
              <AvatarImage src={channelAvatar} alt={channelName} />
              <AvatarFallback>{channelName?.[0] || 'C'}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{channelName}</span>
                <VerifiedIcon className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">{subscriberCount} subscribers</span>
            </div>

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
                  Subscribed
                </>
              ) : (
                "Subscribe"
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
            <Button variant="ghost" size="sm" className="bg-secondary text-foreground hover:bg-secondary/80 rounded-full">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`bg-secondary hover:bg-secondary/80 rounded-full ${saved ? "text-blue-500" : "text-foreground"}`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
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
          onSeek={handleSeek}
          maxPreviewLength={150}
        />

        {/* Error displays */}
        {error && (
          <ErrorDisplay 
            error={error} 
            onRetry={refreshStats}
            onDismiss={() => {/* TODO: implement error dismissal */}}
          />
        )}

        {/* Comments Section */}
        <Comments videoId={videoId} commentsCount={realCommentsCount || commentsCount} />

        {/* Auth Required Dialog */}
        <AuthRequiredDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </div>
    </div>
  )
}
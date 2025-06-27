"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Comments } from './comments'
import { VideoDescription } from '@/components/video/VideoDescription'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { useAuth } from '@/hooks/use-auth'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
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
  subscriberCount?: string
  viewCount?: string
  publishDate?: string
  description?: string
  isSubscribed?: boolean
}

export function PrimaryColumn({ 
  videoId = "big-buck-bunny",
  title = "Building a YouTube Clone",
  channelName = "TsodingDaily",
  channelAvatar = "/avatars/channel_photo1.png",
  subscriberCount = "162K",
  viewCount = "45,892",
  publishDate = "2 days ago",
  description = `🔥 Building a Complete YouTube Clone with Next.js & React

00:00 Introduction and Project Overview
02:15 Setting up Next.js and TypeScript
05:30 Creating the Layout Components
12:45 Implementing the Video Player
18:20 Building the Comments System
25:10 Adding User Authentication
32:40 State Management with Zustand

🔗 Useful Resources:
→ GitHub Repository: https://github.com/tsoding/youtube-clone
→ Live Demo: https://youtube-clone-demo.vercel.app
→ Figma Design: https://figma.com/youtube-design

In this comprehensive tutorial, we'll build a fully functional YouTube clone using modern web technologies. We'll cover everything from the basic layout to advanced features like video streaming and real-time comments.

📚 What you'll learn:
• Next.js 14 with App Router
• TypeScript for type safety
• Tailwind CSS for styling
• shadcn/ui component library
• Video player integration
• Comment system with replies
• Responsive design principles

💻 Prerequisites:
• Basic knowledge of React
• Understanding of JavaScript/TypeScript
• Familiarity with CSS

🎯 Perfect for developers looking to build modern video platforms!

#nextjs #react #typescript #webdev #tutorial`,
  isSubscribed = false
}: PrimaryColumnProps) {
  const { requireAuth, isAuthenticated, showAuthDialog, setShowAuthDialog } = useAuth()
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(isSubscribed)

  const handleLike = () => {
    requireAuth(() => {
      setLiked(!liked)
      if (disliked) setDisliked(false)
    })
  }

  const handleDislike = () => {
    requireAuth(() => {
      setDisliked(!disliked)
      if (liked) setLiked(false)
    })
  }

  const handleSubscribe = () => {
    requireAuth(() => {
      setSubscribed(!subscribed)
    })
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
          autoPlay={false}
          poster="/previews/previews1.png"
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
              <AvatarFallback>{channelName[0]}</AvatarFallback>
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
              variant="ghost"
              className={`ml-4 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                subscribed 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200" 
                  : "bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
              }`}
            >
              {subscribed ? (
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
                className={`rounded-l-full ${liked ? "text-blue-500" : "text-foreground"} hover:bg-secondary/80`}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                125K
              </Button>
              <Separator orientation="vertical" className="h-6 bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDislike}
                className={`rounded-r-full ${disliked ? "text-red-500" : "text-foreground"} hover:bg-secondary/80`}
              >
                <ThumbsDown className="w-4 h-4" />
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
          description={description}
          viewCount={viewCount}
          publishDate={publishDate}
          onSeek={handleSeek}
          maxPreviewLength={150}
        />

        {/* Comments Section */}
        <Comments videoId={videoId} commentsCount={1247} />

        {/* Auth Required Dialog */}
        <AuthRequiredDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
        />
      </div>
    </div>
  )
}
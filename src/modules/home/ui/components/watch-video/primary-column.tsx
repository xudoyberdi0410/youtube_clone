"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Comments } from './comments'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share, 
  Download, 
  MoreHorizontal,
  Bookmark,
  Scissors,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

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
  videoId = "-AFAY2IV4bk",
  title = "Building a YouTube Clone",
  channelName = "TsodingDaily",
  channelAvatar = "/avatars/channel_photo1.png",
  subscriberCount = "162K",
  viewCount = "45,892",
  publishDate = "2 days ago",
  description = "Streamed Live on Twitch: https://twitch.tv/tsoding\nEnable Subtitles for Twitch Chat\n\nIn this stream we continue building our YouTube clone using React and Next.js...",
  isSubscribed = false
}: PrimaryColumnProps) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(isSubscribed)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
  }

  const handleSubscribe = () => {
    setSubscribed(!subscribed)
  }

  const truncatedDescription = description.length > 200 
    ? description.substring(0, 200) + "..."
    : description

  return (
    <div id="primary" className="w-full">
      <div id="primary-inner" className="space-y-4">
        {/* Video Player Placeholder */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
            Video Player Placeholder
          </div>
          {/* Video overlays */}
          <div id="overlays" className="absolute inset-0 pointer-events-none"></div>
          <div id="mouseover-overlay" className="absolute inset-0 pointer-events-none"></div>
          <div id="hover-overlays" className="absolute inset-0 pointer-events-none"></div>
        </div>

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
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{subscriberCount} subscribers</span>
            </div>

            {/* Subscribe Button */}
            <Button
              onClick={handleSubscribe}
              variant={subscribed ? "secondary" : "default"}
              className={`ml-4 ${
                subscribed 
                  ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
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

            {/* Download */}
            <Button variant="ghost" size="sm" className="bg-secondary text-foreground hover:bg-secondary/80 rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            {/* Clip */}
            <Button variant="ghost" size="sm" className="bg-secondary text-foreground hover:bg-secondary/80 rounded-full">
              <Scissors className="w-4 h-4 mr-2" />
              Clip
            </Button>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSaved(!saved)}
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
        <div className="bg-secondary/50 rounded-xl border-0 p-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-muted-foreground space-x-2">
              <span>{viewCount} views</span>
              <span>•</span>
              <span>{publishDate}</span>
            </div>
            
            <div className="text-foreground">
              <div className="text-sm leading-relaxed">
                {showFullDescription ? (
                  <div className="space-y-2">
                    {description.split('\n').map((line, index) => {
                      // Handle links
                      if (line.includes('http')) {
                        return (
                          <p key={index} className="text-blue-500 hover:underline cursor-pointer">
                            {line}
                          </p>
                        )
                      }
                      // Handle section headers (lines starting with emoji or special chars)
                      if (line.match(/^[🔗⏰#]/)) {
                        return (
                          <p key={index} className="font-semibold text-foreground mt-3 first:mt-0">
                            {line}
                          </p>
                        )
                      }
                      // Handle timestamps
                      if (line.match(/^\d{2}:\d{2}/)) {
                        return (
                          <p key={index} className="text-blue-500 hover:underline cursor-pointer pl-2">
                            {line}
                          </p>
                        )
                      }
                      // Regular text
                      return line.trim() ? (
                        <p key={index} className="text-foreground">
                          {line}
                        </p>
                      ) : (
                        <div key={index} className="h-2"></div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-foreground">
                    {truncatedDescription}
                  </p>
                )}
              </div>
              
              {description.length > 200 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-muted-foreground hover:text-foreground p-0 h-auto mt-3 font-medium"
                >
                  {showFullDescription ? (
                    <>
                      Show less <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      ...more <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <Comments videoId={videoId} commentsCount={1247} />
      </div>
    </div>
  )
}
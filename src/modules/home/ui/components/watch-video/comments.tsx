"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal,
  ChevronDown,
  MessageCircle,
  Heart
} from 'lucide-react'

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  isHearted: boolean
  replies?: Comment[]
  isReplying?: boolean
  showReplies?: boolean
}

interface CommentsProps {
  videoId?: string
  commentsCount?: number
}

export function Comments({ videoId, commentsCount = 1247 }: CommentsProps) {
  const { requireAuth, isAuthenticated, showAuthDialog, setShowAuthDialog } = useAuth()
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top')
  const [newComment, setNewComment] = useState('')
  const [replyText, setReplyText] = useState('')
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'CodeMaster_2024',
      avatar: '/avatars/channel_photo1.png',
      content: 'This is exactly what I needed! The explanation of the component structure is so clear. Thank you for making this tutorial!',
      timestamp: '2 hours ago',
      likes: 42,
      isLiked: false,
      isHearted: true,
      showReplies: true,
      replies: [
        {
          id: '1-1',
          author: 'TsodingDaily',
          avatar: '/avatars/channel_photo2.png',
          content: 'Glad it helped! More tutorials coming soon 🚀',
          timestamp: '1 hour ago',
          likes: 15,
          isLiked: false,
          isHearted: false,
        }
      ]
    },
    {
      id: '2',
      author: 'ReactNewbie',
      avatar: '/avatars/channel_photo1.png',
      content: 'Quick question: How would you handle state management for a larger application? Would you recommend Redux or Zustand?',
      timestamp: '4 hours ago',
      likes: 28,
      isLiked: true,
      isHearted: false,
    },
    {
      id: '3',
      author: 'FullStackDev',
      avatar: '/avatars/channel_photo2.png',
      content: 'The TypeScript integration is perfect. I love how you structured the interfaces. One suggestion: maybe add error boundaries for better error handling?',
      timestamp: '6 hours ago',
      likes: 67,
      isLiked: false,
      isHearted: false,
    }
  ])

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    requireAuth(() => {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (!isReply && comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          }
          if (isReply && comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                    }
                  : reply
              )
            }
          }
          return comment
        })
      )
    })
  }

  const toggleReplies = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    )
  }

  const toggleReply = (commentId: string) => {
    requireAuth(() => {
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, isReplying: !comment.isReplying }
            : { ...comment, isReplying: false } // Close other reply inputs
        )
      )
      setReplyText('')
    })
  }

  const handleAddReply = (parentId: string) => {
    requireAuth(() => {
      if (replyText.trim()) {
        const reply: Comment = {
          id: `${parentId}-${Date.now()}`,
          author: 'You',
          avatar: '/avatars/channel_photo2.png',
          content: replyText,
          timestamp: 'just now',
          likes: 0,
          isLiked: false,
          isHearted: false,
        }

        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: comment.replies ? [...comment.replies, reply] : [reply],
                  isReplying: false,
                  showReplies: true
                }
              : comment
          )
        )
        setReplyText('')
      }
    })
  }

  const handleAddComment = () => {
    requireAuth(() => {
      if (newComment.trim()) {
        const comment: Comment = {
          id: Date.now().toString(),
          author: 'You',
          avatar: '/avatars/channel_photo2.png',
          content: newComment,
          timestamp: 'just now',
          likes: 0,
          isLiked: false,
          isHearted: false,
        }
        setComments([comment, ...comments])
        setNewComment('')
      }
    })
  }

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment, isReply?: boolean, parentId?: string }) => (
    <div className={`flex items-start space-x-3 ${isReply ? 'ml-12' : ''}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={comment.avatar} alt={comment.author} />
        <AvatarFallback>{comment.author[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground text-sm">{comment.author}</span>
          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          {comment.isHearted && (
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          )}
        </div>
        
        <p className="text-foreground text-sm leading-relaxed">
          {comment.content}
        </p>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLikeComment(comment.id, isReply, parentId)}
            className={`h-8 px-2 ${comment.isLiked ? 'text-blue-500' : 'text-muted-foreground'} hover:text-foreground`}
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            {comment.likes > 0 && comment.likes}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
          
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReply(comment.id)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              Reply
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-1 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Reply Input */}
        {!isReply && comment.isReplying && (
          <div className="flex items-start space-x-3 mt-3">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarImage src="/avatars/channel_photo2.png" alt="Your avatar" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent border-b border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none pb-2 transition-colors text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                autoFocus
              />
              {replyText.trim() && (
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleReply(comment.id)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyText.trim()}
                    className="text-xs"
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleReplies(comment.id)}
              className="text-blue-500 hover:text-blue-600 p-0 h-auto font-medium mb-3"
            >
              {comment.showReplies ? (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1 rotate-[-90deg]" />
                  Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </Button>
            
            {comment.showReplies && (
              <div className="space-y-3">
                {comment.replies.map(reply => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    isReply={true} 
                    parentId={comment.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div id="comments" className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            {commentsCount.toLocaleString()} Comments
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSortBy(sortBy === 'top' ? 'newest' : 'top')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Sort by {sortBy === 'top' ? 'Top comments' : 'Newest first'}
          </Button>
        </div>
      </div>

      {/* Add Comment */}
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/avatars/channel_photo2.png" alt="Your avatar" />
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated}
            className={`w-full bg-transparent border-b border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none pb-2 transition-colors ${
              !isAuthenticated ? 'cursor-not-allowed opacity-60' : ''
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            onClick={() => !isAuthenticated && requireAuth(() => {})}
          />
          {newComment.trim() && isAuthenticated && (
            <div className="flex items-center justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setNewComment('')}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Load More Comments */}
      <div className="flex justify-center">
        <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
          <MessageCircle className="w-4 h-4 mr-2" />
          Show more comments
        </Button>
      </div>

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  )
}

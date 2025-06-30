"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { useComments } from '@/hooks/use-comments'
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle
} from 'lucide-react'

interface CommentsProps {
  videoId?: string
  commentsCount?: number
}

export function Comments({ videoId, commentsCount = 0 }: CommentsProps) {
  const { isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState('')
  
  const { 
    comments, 
    isLoading, 
    isPosting, 
    addComment, 
    error,
    commentsCount: realCommentsCount 
  } = useComments({ videoId })

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await addComment(newComment)
        setNewComment('')
      } catch (error) {
        // Ошибка уже обработана в хуке
        console.error('Failed to add comment:', error)
      }
    }
  }

  const displayCommentsCount = realCommentsCount || commentsCount

  return (
    <div className="mt-6">
      <div className="flex items-center gap-8 mb-6">
        <span className="text-xl font-semibold">{displayCommentsCount.toLocaleString()} Comments</span>
      </div>

      {/* Add Comment Section */}
      {isAuthenticated && (
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                У
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={isPosting}
                className="w-full min-h-[60px] px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50"
              />
              {newComment.trim() && (
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setNewComment('')}
                    disabled={isPosting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAddComment}
                    disabled={isPosting || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPosting ? 'Posting...' : 'Comment'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={comment.user?.avatar_url} alt={comment.user?.username} />
                <AvatarFallback className="bg-gray-300 text-gray-600">
                  {comment.user?.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user?.username || 'Anonymous'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-900 mb-2">{comment.comment}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-gray-900">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-gray-900">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-gray-900">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
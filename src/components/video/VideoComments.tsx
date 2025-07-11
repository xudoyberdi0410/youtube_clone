// src/components/video/VideoComments.tsx

import { memo, useState } from 'react'
import { t } from '@/lib/i18n'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { VideoCommentComponent } from './VideoComment'
import { useVideoComments } from '@/hooks/use-video-comments'
import { useAuth } from '@/hooks/use-auth'

interface VideoCommentsProps {
  videoId: string
  className?: string
}

export const VideoComments = memo(({ videoId, className }: VideoCommentsProps) => {
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const { isAuthenticated, requireAuth } = useAuth()
  
  const {
    comments,
    isLoading,
    error,
    commentsCount,
    refreshComments,
    addComment,
    isClient
  } = useVideoComments({ videoId, immediate: true })

  // Не рендерим ничего до гидрации на клиенте
  if (!isClient) {
    return null
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    
    requireAuth(async () => {
      setIsPosting(true)
      try {
        await addComment(newComment)
        setNewComment('')
        // Комментарии автоматически обновятся в addComment
      } catch (error) {
        console.error('Failed to post comment:', error)
        // Можно добавить уведомление об ошибке пользователю
      } finally {
        setIsPosting(false)
      }
    })
  }

  const handleCancel = () => {
    setNewComment('')
  }

  if (isLoading) {
    return (
      <div className={`bg-background ${className || ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="h-6 w-6 text-primary" />
            <span className="ml-2 text-muted-foreground">{t('comments.loading')}</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-background ${className || ''}`}>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t('comments.loadError')}</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={refreshComments}
              variant="outline"
              size="sm"
            >
              {t('comments.retry')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-background ${className || ''}`}>
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-8">
          <h3 className="text-xl font-semibold text-foreground">
            {commentsCount === 0 
              ? t('comments.title')
              : `${commentsCount.toLocaleString()} ${t('comments.count')}`
            }
          </h3>
          {/* TODO: Add sort options */}
        </div>
      </div>
      
      {/* Comment Input - только для авторизованных пользователей */}
      {isAuthenticated && (
        <div className="px-6 pb-6">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-muted text-muted-foreground">
                👤
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder={t('comments.addPlaceholder')}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[40px] resize-none border-0 border-b-2 border-muted rounded-none p-0 pb-2 focus:border-primary focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                onFocus={(e) => {
                  e.target.style.minHeight = '80px'
                }}
                onBlur={(e) => {
                  if (!newComment.trim()) {
                    e.target.style.minHeight = '40px'
                  }
                }}
              />
              
              {newComment.trim() && (
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isPosting}
                  >
                    {t('comments.cancel')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isPosting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPosting ? t('comments.sending') : t('comments.submit')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Separator className="bg-muted" />
      
      {/* Comments List */}
      <div className="px-6 py-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-4xl mb-4">💬</div>
            <p className="text-muted-foreground text-lg mb-2">
              {t('comments.empty')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('comments.beFirst')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <VideoCommentComponent 
                key={comment.comment_id} 
                comment={comment} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

VideoComments.displayName = 'VideoComments'

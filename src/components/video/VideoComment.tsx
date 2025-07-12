// src/components/video/VideoComment.tsx

import { memo } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { VideoComment } from '@/types/common'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { t } from '@/lib/i18n'

interface VideoCommentProps {
  comment: VideoComment
}

export const VideoCommentComponent = memo(({ comment }: VideoCommentProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: enUS 
      })
    } catch {
      return t('comments.recent')
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="py-4">
      <div className="flex gap-4">
        {/* Аватар автора */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
            {getInitials(comment.channel_name || 'Unknown')}
          </AvatarFallback>
        </Avatar>
        
        {/* Содержимое комментария */}
        <div className="flex-1 min-w-0">
          {/* Имя автора и время */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-foreground">
              {comment.channel_name || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
          </div>
          
          {/* Текст комментария */}
          <p className="text-sm text-foreground leading-relaxed break-words whitespace-pre-wrap">
            {comment.comment || 'No comment text'}
          </p>
        </div>
      </div>
    </div>
  )
})

VideoCommentComponent.displayName = 'VideoComment'

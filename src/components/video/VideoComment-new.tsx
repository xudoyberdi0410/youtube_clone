// src/components/video/VideoComment.tsx

import { memo } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { VideoComment } from '@/types/common'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface VideoCommentProps {
  comment: VideoComment
}

export const VideoCommentComponent = memo(({ comment }: VideoCommentProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ru 
      })
    } catch {
      return 'недавно'
    }
  }

  const getInitials = (name: string) => {
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
          <AvatarFallback className="bg-gray-300 text-gray-700 text-sm font-medium">
            {getInitials(comment.channel_name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Содержимое комментария */}
        <div className="flex-1 min-w-0">
          {/* Имя автора и время */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {comment.channel_name}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.created_at)}
            </span>
          </div>
          
          {/* Текст комментария */}
          <p className="text-sm text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
            {comment.comment}
          </p>
        </div>
      </div>
    </div>
  )
})

VideoCommentComponent.displayName = 'VideoComment'

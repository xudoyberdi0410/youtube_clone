'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { ChannelCard } from './channel-card'
import { useChannels } from '../../hooks/use-channels'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Channel } from '@/types/api'

interface ChannelsSidebarProps {
  className?: string
}

export function ChannelsSidebar({ className }: ChannelsSidebarProps) {
  const { channels, loading, error } = useChannels()

  if (loading) {
    return (
      <div className={`p-4 ${className || ''}`}>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || channels.length === 0) {
    return (
      <div className={`p-4 ${className || ''}`}>
        <h3 className="font-semibold text-sm mb-3">Подписки</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          {error || 'Нет подписок'}
        </p>
      </div>
    )
  }

  return (
    <div className={`p-4 ${className || ''}`}>
      <h3 className="font-semibold text-sm mb-3">Подписки</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {channels.map((channel: Channel) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              size="small"
              showSubscribersCount={false}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

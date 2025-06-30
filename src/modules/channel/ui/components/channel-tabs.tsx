'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChannelTabsProps {
  activeTab: 'home' | 'videos' | 'shorts' | 'playlists' | 'about'
  onTabChange: (tab: 'home' | 'videos' | 'shorts' | 'playlists' | 'about') => void
}

const tabs = [
  { id: 'home' as const, label: 'Главная' },
  { id: 'videos' as const, label: 'Видео' },
  { id: 'shorts' as const, label: 'Shorts' },
  { id: 'playlists' as const, label: 'Плейлисты' },
  { id: 'about' as const, label: 'О канале' },
]

export function ChannelTabs({ activeTab, onTabChange }: ChannelTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-none border-b-2 border-transparent hover:bg-transparent",
            activeTab === tab.id
              ? "text-primary border-b-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { buildImageUrl } from "@/lib/api-config"
import type { Channel } from "@/types/api"
import { t } from '@/lib/i18n'

interface ChannelHeaderProps {
  channel: Channel
  showEditButton?: boolean
}

export function ChannelHeader({ channel, showEditButton }: ChannelHeaderProps) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-xl bg-card shadow-sm">
      <Avatar className="w-20 h-20">
        <AvatarImage src={buildImageUrl(channel.profile_image || "")} alt={channel.channel_name} />
        <AvatarFallback>{channel.channel_name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold truncate">{channel.channel_name}</h1>
          {channel.is_verified && <span className="text-blue-500" title={t('channel.verified')}>✔️</span>}
        </div>
        <div className="text-muted-foreground text-sm truncate mb-2">{channel.description}</div>
        <div className="flex gap-2">
          <Link href={`/channel?name=${channel.channel_name}`}>
            <Button size="sm" variant="outline">{t('channel.goToChannel')}</Button>
          </Link>
          {showEditButton && (
            <Link href="/settings">
              <Button size="sm" variant="secondary">{t('channel.editChannel')}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

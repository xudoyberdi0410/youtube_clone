"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildImageUrl } from "@/lib/api-config";
import { getChannelUrl } from "@/lib/channel-utils";
import { formatShortNumber } from "@/lib/utils/format";
import type { Channel } from "@/types/api";
import { t } from "@/lib/i18n";

interface ChannelCardProps {
  channel: Channel;
  showSubscribersCount?: boolean;
  size?: "small" | "medium" | "large";
}

export function ChannelCard({
  channel,
  showSubscribersCount = true,
  size = "medium",
}: ChannelCardProps) {
  // Используем утилиту для генерации URL канала
  const channelUrl = getChannelUrl(channel.channel_name);

  const avatarSizes = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <Link
      href={channelUrl}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
    >
      <Avatar className={avatarSizes[size]}>
        <AvatarImage
          src={buildImageUrl(channel.profile_image_url || "")}
          alt={channel.channel_name}
        />
        <AvatarFallback>
          {channel.channel_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${textSizes[size]}`}>
          {channel.channel_name}
        </p>
        {showSubscribersCount && (
          <p className="text-xs text-muted-foreground">
            {formatShortNumber(channel.subscribers_count || 0)}{" "}
            {t("channel.subscribers")}
          </p>
        )}
      </div>
    </Link>
  );
}

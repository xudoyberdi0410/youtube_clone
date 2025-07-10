"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buildImageUrl } from "@/lib/api-config";
import { useAuth } from "@/hooks/use-auth";
import { useState, useMemo } from "react";
import type { Channel } from "@/types/api";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { ApiClient } from "@/lib/api-client";
import { useSubscriptions } from "@/hooks/use-subscriptions";

interface ChannelHeaderProps {
  channel: Channel;
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const { user } = useAuth();
  const [subscribersCount, setSubscribersCount] = useState(
    channel.subscribers_count || 0,
  );
  const [loading, setLoading] = useState(false);

  const isOwnChannel = user?.id === channel.user_id;

  // Используем хук подписок для получения списка подписок пользователя
  const { subscriptions, loadSubscriptions } = useSubscriptions();

  // Проверяем, подписан ли пользователь на этот канал
  const subscription = useMemo(
    () =>
      subscriptions.find(
        (sub) =>
          String(sub.channel_name) === String(channel.channel_name) ||
          Number(sub.id) === Number(channel.id),
      ),
    [subscriptions, channel],
  );
  const isSubscribed = !!subscription;

  if (!channel || !channel.channel_name) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        {t("channel.notFound")}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Баннер канала */}
      {channel.banner_image_url && (
        <div className="h-32 md:h-48 lg:h-64 overflow-hidden">
          <Image
            src={buildImageUrl(channel.banner_image_url)}
            alt={`${channel.channel_name} banner`}
            className="w-full h-full object-cover"
            fill
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Информация о канале */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Аватар канала */}
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 md:w-32 md:h-32">
              <AvatarImage
                src={buildImageUrl(channel.profile_image_url || "")}
                alt={channel.channel_name}
              />
              <AvatarFallback className="text-2xl md:text-4xl">
                {channel.channel_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Информация о канале */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold truncate">
                  {channel.channel_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>@{channel.channel_name}</span>
                  <span>•</span>
                  <span>
                    {subscribersCount} {t("channel.subscribers")}
                  </span>
                </div>
                {channel.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {channel.description}
                  </p>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-2">
                {isOwnChannel ? (
                  <Button variant="outline" className="min-w-[120px]">
                    {t("channel.editChannel")}
                  </Button>
                ) : (
                  user && (
                    <Button
                      variant={isSubscribed ? "secondary" : "default"}
                      className="min-w-[120px]"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const apiClient = ApiClient.getInstance();
                          if (isSubscribed && subscription) {
                            await apiClient.unsubscribe(subscription.id);
                            setSubscribersCount((prev) => prev - 1);
                          } else {
                            await apiClient.subscribe({
                              channel_id: Number(channel.id),
                            });
                            setSubscribersCount((prev) => prev + 1);
                          }
                          await loadSubscriptions();
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      {isSubscribed
                        ? t("channel.unsubscribe")
                        : t("channel.subscribe")}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";

import { ChannelHeader } from "@/modules/channel/ui/components/channel-header";
import { ChannelTabs } from "@/modules/channel/ui/components/channel-tabs";
import { VideoGrid } from "@/components/video/video-grid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { t } from "@/lib/i18n";
import { useChannelPageData } from "@/modules/channel/hooks/use-channel-page-data";
import { formatFullDateIntl } from '@/lib/utils/format';
import { getCurrentLanguage } from '@/lib/i18n';

export default function ChannelPageWrapper() {
  return (
    <Suspense>
      <ChannelPage />
    </Suspense>
  );
}

function ChannelPage() {
  const [activeTab, setActiveTab] = useState<
    "home" | "videos" | "shorts" | "playlists" | "about"
  >("home");
  const {
    channelName,
    channel,
    channelLoading,
    channelError,
    videos,
    loading,
    error,
  } = useChannelPageData();

  if (!channelName) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{t("channel.nameNotProvided")}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loading || channelLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || channelError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || channelError}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!channel) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChannelHeader channel={channel} />
      <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "home" && channel && (
          <VideoGrid videos={videos} currentChannelId={channel.id} />
        )}
        {activeTab === "videos" && channel && (
          <VideoGrid videos={videos} currentChannelId={channel.id} />
        )}
        {activeTab === "shorts" && (
          <div>{t("channel.shortsInDevelopment")}</div>
        )}
        {activeTab === "playlists" && (
          <div>{t("channel.playlistsInDevelopment")}</div>
        )}
        {activeTab === "about" && (
          <div className="prose max-w-none">
            <h2>{t("channel.about")}</h2>
            <p>{channel.description || t("channel.noDescription")}</p>
            <p>
              {t("channel.created")}: {formatFullDateIntl(channel.created_at, getCurrentLanguage())}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

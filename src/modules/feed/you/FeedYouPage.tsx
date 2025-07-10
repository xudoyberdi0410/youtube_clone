"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ChannelHeader } from "@/components/layouts/ChannelHeader";
import { VideoRowList } from "@/components/video/VideoRowList";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { Button } from "@/components/ui/button";
import type { Video, Channel, Playlist, Like } from "@/types/api";
import { t } from "@/lib/i18n";
export default function FeedYouPage() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [history, setHistory] = useState<Video[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [channel, historyRaw, likes, playlists] = await Promise.all([
          apiClient.getMyChannel(),
          apiClient.getHistory(),
          apiClient.getLikes(),
          apiClient.getMyPlaylists(),
        ]);

        setChannel(channel);

        // Map History[] to Video[] for VideoRowList
        const historyVideos: Video[] = historyRaw.map((h) => ({
          id: h.id,
          channel_name: h.channel_name,
          profile_image: "",
          video_title: h.title,
          video_description: "",
          file_path: h.file_path,
          thumbnail_path: h.thumbnail_path,
          category: "Musiqa",
          video_views: h.views,
          created_at: h.watched_at,
          like_amount: 0,
        }));

        setHistory(historyVideos);
        // Likes are Like[], need to map to Video[] for VideoRowList
        const likedVideos: Video[] = likes.map((like) => ({
          id: like.video_id,
          channel_name: "",
          profile_image: "",
          video_title: "",
          video_description: "",
          file_path: "",
          thumbnail_path: "",
          category: "Musiqa",
          video_views: 0,
          created_at: like.created_at,
          like_amount: 0,
        }));
        setLikes(likedVideos as unknown as Like[]);
        setPlaylists(playlists);
      } catch {
        // handle error if needed
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-[96rem] mx-auto px-4 sm:px-6 py-8 space-y-10 bg-background min-h-screen">
      {channel && <ChannelHeader channel={channel} showEditButton />}

      {/* История */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {t("feedYou.historyTitle")}
          </h2>
          <Link href="/feed/history">
            <Button variant="link" className="text-sm">
              {t("feedYou.seeAll")}
            </Button>
          </Link>
        </div>
        <VideoRowList videos={history} skeletonCount={8} />
      </section>

      {/* Лайки */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {t("feedYou.likedTitle")}
          </h2>
          <Link href="/feed/liked">
            <Button variant="link" className="text-sm">
              {t("feedYou.seeAll")}
            </Button>
          </Link>
        </div>
        <VideoRowList videos={likes as unknown as Video[]} skeletonCount={8} />
      </section>

      {/* Плейлисты */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {t("feedYou.playlistsTitle")}
          </h2>
          <Link href="/feed/playlists">
            <Button variant="link" className="text-sm">
              {t("feedYou.seeAll")}
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {playlists.length
            ? playlists.map((pl) => <PlaylistCard key={pl.id} playlist={pl} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-56 h-32 bg-muted rounded-lg animate-pulse"
                />
              ))}
        </div>
      </section>
    </div>
  );
}

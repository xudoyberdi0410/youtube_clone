// src/app/playlist/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Play,
  MoreVertical,
  Share,
  Edit,
  Trash2,
  Lock,
  Globe,
  Calendar,
  User,
  ArrowLeft,
  PlaySquare,
} from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { usePlaylist } from "@/hooks/use-playlist";
import { formatDistanceToNow } from "date-fns";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params?.id as string | undefined;
  const { isLoggedIn, user } = useAuth();

  const numericPlaylistId = playlistId ? parseInt(playlistId) : null;
  const {
    playlist,
    playlistVideos,
    isLoading,
    error,
    removeVideoFromPlaylist,
  } = usePlaylist(numericPlaylistId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="flex gap-6">
            <div className="w-80 h-48 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">Error loading playlist</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/feed/playlists">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <div className="text-gray-500 mb-4">Playlist not found</div>
          <Link href="/feed/playlists">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isLoggedIn && user?.id === playlist.user_id;
  const canEdit = isOwner;
  const videoCount = playlistVideos.length || playlist.videos_count || 0;

  const handleRemoveVideo = async (playlistVideoId: number) => {
    if (window.confirm("Remove this video from the playlist?")) {
      try {
        await removeVideoFromPlaylist(playlistVideoId);
      } catch (error) {
        console.error("Failed to remove video from playlist:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/feed/playlists">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playlists
          </Button>
        </Link>
      </div>

      {/* Playlist Info */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Thumbnail */}
        <div className="w-full lg:w-80">
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden relative flex items-center justify-center">
            <PlaySquare className="w-20 h-20 text-white/80" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/70 rounded-full p-4">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
              {videoCount} videos
            </div>
          </div>
        </div>

        {/* Playlist Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {playlist.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              {playlist.is_public && !playlist.is_personal ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>By You</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(playlist.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="gap-2">
              <Play className="w-4 h-4" />
              Play all
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Videos ({videoCount})</h2>

        {videoCount === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-2">No videos in this playlist</div>
            <p className="text-gray-500 text-sm">
              Add videos to start building your playlist
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlistVideos.map((playlistVideo, index) => (
              <Card
                key={`playlist-video-${playlistVideo.id}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 font-mono text-sm w-6">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Video #{playlistVideo.video_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Added to playlist
                      </div>
                    </div>
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemoveVideo(playlistVideo.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove from playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/playlist/PlaylistCard.tsx

"use client"

import { useState } from "react"
import { t } from "@/lib/i18n"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Play, Edit, Trash2, Lock, PlaySquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Playlist } from "@/types/api"

interface PlaylistCardProps {
  playlist: Playlist
  onEdit?: (playlist: Playlist) => void
  onDelete?: (playlistId: number) => void
}

export function PlaylistCard({ playlist, onEdit, onDelete }: PlaylistCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (window.confirm(t("playlist.deleteConfirm"))) {
      setIsLoading(true)
      try {
        await onDelete?.(playlist.id)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const videoCount = playlist.videos_count || 0

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 bg-card border-none rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Thumbnail */}
          <Link href={`/playlist/${playlist.id}`} className="block">
            <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
              <PlaySquare className="w-16 h-16 text-muted-foreground/60" />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-foreground/80 rounded-full p-3">
                    <Play className="w-6 h-6 text-background" />
                  </div>
                </div>
              </div>
              {/* Video count badge */}
              <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-1 rounded">
                {videoCount} {t(videoCount === 1 ? "playlist.video" : "playlist.videos")}
              </div>
            </div>
          </Link>

          {/* More actions */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full hover:bg-muted transition text-muted-foreground opacity-100 sm:opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(playlist)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t("playlist.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("playlist.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/playlist/${playlist.id}`}> 
            <h3 className="font-semibold text-base md:text-lg line-clamp-2 mb-1 text-foreground hover:text-primary transition-colors">
              {playlist.name}
            </h3>
          </Link>
          {playlist.description && (
            <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
              {playlist.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{videoCount} {t(videoCount === 1 ? "playlist.video" : "playlist.videos")}</span>
            {(playlist.is_personal || !playlist.is_public) && (
              <>
                <span>•</span>
                <Lock className="w-3 h-3" />
                <span>{t("playlist.private")}</span>
              </>
            )}
            {playlist.created_at && (
              <>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

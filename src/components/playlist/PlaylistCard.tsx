// src/components/playlist/PlaylistCard.tsx

"use client"

import { useState } from "react"
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
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setIsLoading(true)
      try {
        await onDelete?.(playlist.id)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Используем lucide иконку вместо SVG
  const thumbnailUrl = null // Будем использовать иконку вместо изображения
  const videoCount = playlist.videos_count || 0

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          {/* Thumbnail */}
          <Link href={`/playlist/${playlist.id}`} className="block">
            <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <PlaySquare className="w-16 h-16 text-white/80" />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/70 rounded-full p-3">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>
              {/* Video count badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {videoCount} videos
              </div>
            </div>
          </Link>

          {/* More actions */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 hover:bg-black/40 text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(playlist)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/playlist/${playlist.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
              {playlist.name}
            </h3>
          </Link>
          
          {playlist.description && (
            <p className="text-gray-600 text-xs line-clamp-2 mb-2">
              {playlist.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{videoCount} video{videoCount !== 1 ? 's' : ''}</span>
            {(playlist.is_personal || !playlist.is_public) && (
              <>
                <span>•</span>
                <Lock className="w-3 h-3" />
                <span>Private</span>
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

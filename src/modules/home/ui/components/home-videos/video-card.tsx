import { Video } from "@/types/video";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VerifiedIcon } from '@/components/youtube-icons'

// Функция для форматирования количества просмотров
function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
}

export function VideoCard({
  id, 
  title, 
  preview, 
  views, 
  channel, 
  duration, 
  uploadedAt,
  isLive
}: Video) {
  // Определяем, является ли это первое видео (LCP)
  const isFirstVideo = id === "1";
  
  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleChannelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Здесь можно добавить навигацию на страницу канала
    // window.location.href = `/channel/${channel.id}`;
  };
  
  return (
    <Link href={`/watch?v=${id}`} className="block">
      <div className="group cursor-pointer animate-in fade-in-0 duration-700">
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video mb-3">
        <div className="relative w-full h-full bg-gray-100 rounded-xl overflow-hidden shadow-sm md:hover:shadow-md transition-shadow duration-300">
          <Image 
            src={preview || "/api/placeholder/320/180"} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-300 md:group-hover:scale-105"
            priority={isFirstVideo}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Duration Badge */}
          {duration && !isLive && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80 text-xs font-medium px-1.5 py-0.5 backdrop-blur-sm"
            >
              {duration}
            </Badge>
          )}
          
          {/* Live Badge */}
          {isLive && (
            <Badge 
              variant="destructive" 
              className="absolute bottom-2 right-2 bg-red-600 text-white hover:bg-red-600 text-xs font-medium px-1.5 py-0.5 animate-pulse"
            >
              🔴 LIVE
            </Badge>
          )}
          
          {/* Hover overlay - only on desktop */}
          <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <Avatar 
          className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 mt-0.5 ring-2 ring-transparent md:hover:ring-gray-200 transition-all duration-200 cursor-pointer"
          onClick={handleChannelClick}
        >
          <AvatarImage 
            src={channel.avatarUrl} 
            alt={channel.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-300 text-gray-600 text-xs md:text-sm">
            {channel.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          {/* Video Title */}
          <h3 className="font-medium text-sm md:text-sm leading-5 text-gray-900 mb-1 line-clamp-2 md:group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          
          {/* Channel Name with Verification */}
          <div className="flex items-center gap-1 mb-1">
            <p 
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors truncate"
              onClick={handleChannelClick}
            >
              {channel.name}
            </p>
            {channel.isVerified && (
              <VerifiedIcon className="w-4 h-4 text-blue-500" />
            )}
          </div>
          
          {/* Views and Upload Time */}
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
            <span>{formatViews(views)}</span>
            <span>•</span>
            <span>{uploadedAt}</span>
          </div>
        </div>

        {/* More Options Menu - hidden on mobile */}
        <div className="hidden md:block" onClick={handleMoreOptionsClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 flex-shrink-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Add to queue</DropdownMenuItem>
              <DropdownMenuItem>Save to Watch later</DropdownMenuItem>
              <DropdownMenuItem>Save to playlist</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Not interested</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Don&apos;t recommend channel</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
    </Link>
  );
}

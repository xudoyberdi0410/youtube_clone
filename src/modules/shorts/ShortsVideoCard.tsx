import React from "react";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { ShortVideo } from "./types";

interface ShortsVideoCardProps {
  short: ShortVideo;
  videoRef: (el: HTMLVideoElement | null) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  autoPlay?: boolean;
}

export const ShortsVideoCard: React.FC<ShortsVideoCardProps> = ({
  short,
  videoRef,
  isPlaying,
  togglePlay,
  autoPlay,
}) => {
  return (
    <div className="w-full h-screen snap-center flex justify-center items-center relative bg-transparent">
      {/* Видео и описание */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "100vh" }}
      >
        <video
          ref={videoRef}
          data-id={short.id}
          src={short.video_url}
          className="h-full max-h-screen aspect-[9/16] max-w-[calc(100vh*9/16)] object-cover rounded-xl shadow-2xl border border-zinc-800 bg-zinc-900"
          loop
          muted
          playsInline
          style={{ background: "#222" }}
          autoPlay={autoPlay}
        />
        {/* Overlay controls */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-[calc(100vh*9/16)] flex justify-between items-end pointer-events-none">
          <div className="space-y-2 bg-black/40 rounded-lg p-3 pointer-events-auto max-w-full truncate">
            <h2 className="text-xl font-bold drop-shadow-lg truncate max-w-full break-words whitespace-pre-line">
              {short.title}
            </h2>
            <p className="text-sm opacity-80 truncate max-w-full break-words whitespace-pre-line">
              {short.channel?.channel_name}
            </p>
          </div>
        </div>
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-0 m-auto w-16 h-16 text-white opacity-90 hover:opacity-100 pointer-events-auto"
          onClick={togglePlay}
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? (
            <PauseCircle className="w-14 h-14" />
          ) : (
            <PlayCircle className="w-14 h-14" />
          )}
        </Button>
      </div>
      {/* Sidebar with actions — сбоку от видео */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-[calc(100vh*9/32+32px)] flex flex-col space-y-5 pointer-events-auto z-10">
        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center"
        >
          <ThumbsUp className="w-7 h-7" />
          <span className="text-xs mt-1">{short.likes_count}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center"
        >
          <MessageSquare className="w-7 h-7" />
          <span className="text-xs mt-1">{0}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center"
        >
          <Share2 className="w-7 h-7" />
          <span className="text-xs mt-1">Share</span>
        </Button>
      </div>
    </div>
  );
};

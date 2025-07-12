"use client"

import { useVideoPreview } from "@/hooks/use-video-preview";
import { useInstantPlay } from "@/hooks/use-instant-play";
import { ReactNode } from "react";

interface VideoPreviewOverlayProps {
  videoId: string;
  videoUrl?: string;
  children: ReactNode;
  className?: string;
}

export function VideoPreviewOverlay({
  videoId,
  videoUrl,
  children,
  className = ""
}: VideoPreviewOverlayProps) {
  const {
    videoRef,
    isPreviewing,
    currentTime,
    handleMouseEnter,
    handleMouseLeave,
    handleTimeUpdate,
  } = useVideoPreview({
    videoUrl,
    previewDelay: 500,
    autoPlay: true
  });

  const { navigateToWatch } = useInstantPlay({
    videoId,
    videoUrl,
    currentTime: currentTime
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToWatch();
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      
      {/* Видео для предварительного воспроизведения */}
      {videoUrl && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isPreviewing ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
} 
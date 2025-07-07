import React, { useRef, useEffect, useState } from 'react';
import { ShortVideo } from './types';
import { ShortsVideoCard } from './ShortsVideoCard';

interface ShortsFeedProps {
  shorts: ShortVideo[];
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({ shorts }) => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(shorts[0]?.id ?? null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const videoId = parseInt(video.dataset.id || '0');
          if (entry.isIntersecting) {
            video.play();
            setPlayingVideo(videoId);
          } else {
            video.pause();
            if (playingVideo === videoId) {
              setPlayingVideo(null);
            }
          }
        });
      },
      { threshold: 0.7 }
    );
    videoRefs.current.forEach((video) => {
      if (video) observerRef.current?.observe(video);
    });
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observerRef.current?.unobserve(video);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = (videoId: number, videoRef: HTMLVideoElement | null) => {
    if (videoRef) {
      if (playingVideo === videoId) {
        videoRef.pause();
        setPlayingVideo(null);
      } else {
        videoRefs.current.forEach((v, i) => {
          if (v && i + 1 !== videoId) {
            v.pause();
          }
        });
        videoRef.play();
        setPlayingVideo(videoId);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-0 flex flex-col items-center justify-center snap-y snap-mandatory h-screen overflow-y-scroll scrollbar-hide bg-black">
      {/* Основной контент */}
      {shorts.map((short, index) => (
        <ShortsVideoCard
          key={short.id}
          short={short}
          videoRef={(el) => (videoRefs.current[index] = el)}
          isPlaying={playingVideo === short.id}
          togglePlay={() => togglePlay(short.id, videoRefs.current[index])}
          autoPlay={true}
        />
      ))}
    </div>
  );
};

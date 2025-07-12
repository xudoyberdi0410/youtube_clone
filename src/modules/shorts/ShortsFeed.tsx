import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { t } from "../../lib/i18n";
import { useShorts } from "./hooks/useShorts";
import { ShortVideo } from "./types";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import "./styles.css";

export const ShortsFeed: React.FC = () => {
  const { shorts, loading, error, refreshShorts } = useShorts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Handle scroll to update current video
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !isMountedRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < shorts.length
    ) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, shorts.length]);

  // Debounced scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedScroll);
      return () => {
        container.removeEventListener("scroll", debouncedScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [currentIndex, shorts.length, handleScroll]);

  // Handle first user interaction
  const handleFirstInteraction = () => {
    if (isMountedRef.current) {
      setUserInteracted(true);
    }
  };

  // Listen for user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted && isMountedRef.current) {
        setUserInteracted(true);
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [userInteracted]);

  // Prevent body scroll
  useEffect(() => {
    document.body.classList.add("shorts-active");
    return () => {
      isMountedRef.current = false;
      document.body.classList.remove("shorts-active");
    };
  }, []);

  if (loading) {
    return (
          <div className="shorts-container">
      <div className="loading">
        <div data-testid="spinner" className="spinner"></div>
        <div>{t("shorts.loading")}</div>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="shorts-container">
        <div className="error">
          <div className="error-title">{t("shorts.somethingWentWrong")}</div>
          <div className="error-message">{error}</div>
          <button className="error-button" onClick={refreshShorts}>
            {t("shorts.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="shorts-container">
        <div className="error">
          <div className="error-title">{t("shorts.noShortsFound")}</div>
          <div className="error-message">{t("shorts.checkBackLater")}</div>
          <button className="error-button" onClick={refreshShorts}>
            {t("shorts.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shorts-container">
      <div ref={containerRef} className="shorts-scroll">
        {shorts.map((video, index) => (
          <VideoItem
            key={video.id}
            video={video}
            isActive={index === currentIndex}
            userInteracted={userInteracted}
          />
        ))}
      </div>

      {/* First interaction overlay */}
      {!userInteracted && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
          onClick={handleFirstInteraction}
        >
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <PlayIcon className="w-8 h-8 ml-1" />
            </div>
            <p className="text-lg font-medium">Tap to start</p>
            <p className="text-sm opacity-75 mt-2">
              Swipe up and down to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual video item component
interface VideoItemProps {
  video: ShortVideo;
  isActive: boolean;
  userInteracted: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isActive,
  userInteracted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    } catch (error) {
      console.warn("Video play failed:", error);
      setShowPlayButton(true);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;

    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  // Auto play/pause based on visibility
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && userInteracted) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setPlaying(true);
            setShowPlayButton(false);
          })
          .catch(() => {
            setShowPlayButton(true);
            setPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [isActive, userInteracted]);

  return (
    <div className="short-item">
      <video
        ref={videoRef}
        data-testid="shorts-video"
        className="short-video"
        src={video.video_url}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={handlePlayPause}
      />

      {/* Video overlay */}
      <div className="video-overlay">
        {/* Controls */}
        <div className="video-controls">
          <button className="control-btn" onClick={handleMuteToggle}>
            {muted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
          </button>
        </div>

        {/* Channel info */}
        <div className="channel-info">
          <div className="channel-details">
            {video.channel?.profile_image_url && (
              <Image
                src={video.channel.profile_image_url}
                alt={video.channel.channel_name}
                className="channel-avatar"
                width={40}
                height={40}
                unoptimized
              />
            )}
            <div>
              <div className="channel-name">
                {video.channel?.channel_name || "Unknown"}
              </div>
              <div className="channel-subs">
                {video.channel?.subscribers_count
                  ? `${video.channel.subscribers_count.toLocaleString()} subscribers`
                  : ""}
              </div>
            </div>
          </div>

          <div className="video-title">{video.title}</div>

          {video.description && (
            <div className="video-description">{video.description}</div>
          )}

          <div className="video-stats">
            {video.views_count.toLocaleString()} views •{" "}
            {video.likes_count.toLocaleString()} likes
          </div>
        </div>
      </div>

      {/* Play button */}
      {(showPlayButton || !playing) && (
        <button
          className={`play-button ${!showPlayButton && playing ? "hidden" : ""}`}
          onClick={handlePlayPause}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      )}
    </div>
  );
};

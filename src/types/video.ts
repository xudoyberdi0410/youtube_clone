// src/types/video.ts

export type Channel = {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified?: boolean;
  subscriberCount?: string;
};

export type Video = {
  id: string;
  title: string;
  views: number;
  channel: Channel;
  preview: string;
  duration: string;
  uploadedAt: string;
  description?: string;
  isLive?: boolean;
};

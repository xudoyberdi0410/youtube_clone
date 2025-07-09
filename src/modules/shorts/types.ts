export interface ShortVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  channel?: {
    id: string;
    channel_name: string;
    profile_image_url?: string;
    subscribers_count?: number;
  };
}

export interface ShortsApiResponse {
  shorts: ShortVideo[];
  loading: boolean;
  error: string | null;
}

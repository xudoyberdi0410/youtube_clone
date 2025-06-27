"use client"

import { PrimaryColumn } from './primary-column'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface WatchVideoProps {
  videoId: string;
}

// Mock data for recommended videos
const recommendedVideos = [
  {
    id: '1',
    title: 'React Server Components: The Future of React?',
    channelName: 'Fireship',
    thumbnail: '/previews/previews1.png',
    viewCount: '1.2M',
    publishDate: '1 week ago',
  },
  {
    id: '2',
    title: 'TypeScript in 100 Seconds',
    channelName: 'Fireship',
    thumbnail: '/previews/previews1.png',
    viewCount: '800K',
    publishDate: '2 weeks ago',
  },
  {
    id: '3',
    title: 'Next.js 14 Crash Course',
    channelName: 'Traversy Media',
    thumbnail: '/previews/previews1.png',
    viewCount: '500K',
    publishDate: '3 days ago',
  },
  {
    id: '4',
    title: 'Building Modern Web Apps with React',
    channelName: 'Code with Antonio',
    thumbnail: '/previews/previews1.png',
    viewCount: '350K',
    publishDate: '5 days ago',
  },
  {
    id: '5',
    title: 'Full Stack Development Roadmap 2024',
    channelName: 'Coding Addict',
    thumbnail: '/previews/previews1.png',
    viewCount: '920K',
    publishDate: '1 month ago',
  },
  {
    id: '6',
    title: 'JavaScript ES2024 New Features',
    channelName: 'JavaScript Mastery',
    thumbnail: '/previews/previews1.png',
    viewCount: '450K',
    publishDate: '4 days ago',
  },
  {
    id: '7',
    title: 'CSS Grid vs Flexbox - When to Use Each',
    channelName: 'Kevin Powell',
    thumbnail: '/previews/previews1.png',
    viewCount: '280K',
    publishDate: '1 week ago',
  },
  {
    id: '8',
    title: 'Database Design Best Practices',
    channelName: 'TechWorld with Nana',
    thumbnail: '/previews/previews1.png',
    viewCount: '670K',
    publishDate: '2 weeks ago',
  },
];

export const WatchVideo = ({ videoId }: WatchVideoProps) => {
    const router = useRouter();

    const onVideoSelect = (id: string) => {
      // Navigate to the selected video
      router.push(`/watch?v=${id}`);
    };

    return (
        <div className="flex gap-6 max-w-[1920px] mx-auto p-4">
            {/* Primary Column - Video and Comments */}
            <div className="flex-1 max-w-5xl">
                <PrimaryColumn 
                    videoId={videoId}
                    title="Building a YouTube Clone with Next.js and React"
                    channelName="TsodingDaily"
                    channelAvatar="/avatars/channel_photo1.png"
                    subscriberCount="162K"
                    viewCount="45,892"
                    publishDate="2 days ago"
                    description="Streamed Live on Twitch: https://twitch.tv/tsoding
Enable Subtitles for Twitch Chat

In this stream we continue building our YouTube clone using React and Next.js. We'll be implementing the video watch page, comments system, and video recommendations.

🔗 Links:
- GitHub Repository: https://github.com/tsoding/youtube-clone
- Twitch Channel: https://twitch.tv/tsoding
- Discord: https://discord.gg/tsoding

⏰ Timestamps:
00:00 - Introduction
02:15 - Setting up the watch page
07:30 - Building the video player
15:45 - Implementing comments
25:30 - Adding recommendations
35:20 - Styling and responsive design
45:15 - Testing and debugging

#programming #react #nextjs #typescript #webdev"
                    isSubscribed={false}
                />
            </div>

            {/* Secondary Column - Recommendations */}
            <div className="w-80 xl:w-96">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Up next</h3>
                    {/* Recommended videos list */}
                    <div className="space-y-3">
                        {recommendedVideos.map((video) => (
                            <div
                                key={video.id}
                                className="flex space-x-2 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                                onClick={() => onVideoSelect(video.id)}
                            >
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    width={160}
                                    height={96}
                                    className="w-40 h-24 object-cover rounded-lg flex-shrink-0 bg-muted"
                                />
                                <div className="flex-1 space-y-1 overflow-hidden">
                                    <div className="font-medium text-sm text-foreground truncate">
                                        {video.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {video.channelName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {video.viewCount} views • {video.publishDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
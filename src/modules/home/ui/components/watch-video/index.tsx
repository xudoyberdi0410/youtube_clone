import { PrimaryColumn } from './primary-column'

interface WatchVideoProps {
  videoId: string;
}

export const WatchVideo = ({ videoId }: WatchVideoProps) => {
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
                    {/* Placeholder for recommended videos */}
                    <div className="space-y-3">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="flex space-x-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
                                <div className="w-40 h-24 bg-muted rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                                    <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
                                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
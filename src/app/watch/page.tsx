import { WatchVideo } from "@/modules/home/ui/components/watch-video";

interface WatchPageProps {
  searchParams: { v?: string };
}

export default function WatchPage({ searchParams }: WatchPageProps) {
  const videoId = searchParams.v;

  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h1>
          <p className="text-gray-600">No video ID provided in the URL.</p>
        </div>
      </div>
    );
  }

  return <WatchVideo videoId={videoId} />;
}
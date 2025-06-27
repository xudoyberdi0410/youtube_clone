import { WatchVideo } from "@/modules/home/ui/components/watch-video";

// Force dynamic rendering for this page since it uses searchParams
export const dynamic = 'force-dynamic';

interface WatchPageProps {
  searchParams: Promise<{ v?: string }>;
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const resolvedSearchParams = await searchParams;
  const videoId = resolvedSearchParams.v || "big-buck-bunny"; // Default video ID

  return <WatchVideo videoId={videoId} />;
}
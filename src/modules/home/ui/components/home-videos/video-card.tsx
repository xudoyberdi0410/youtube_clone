import { Video } from "@/types/video";
import { VideoCardWithPreview } from "@/components/video/VideoCardWithPreview";

export function VideoCard(props: Video) {
  return <VideoCardWithPreview {...props} />;
}

import HomeVideos from "@/modules/home/ui/components/home-videos";

// Импорт для тестирования проксирования (можно удалить в продакшене)
import '@/lib/test-proxy';

export default function Home() {
  return (
    <HomeVideos />
  );
}

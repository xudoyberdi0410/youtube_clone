"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { History, Video } from "@/types/api";
import { VideoGrid } from "@/components/video/video-grid";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HistoryIcon } from "@/components/youtube-icons";

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getHistory()
      .then(setHistory)
      .catch(() => setError("Не удалось загрузить историю просмотров"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (historyId: number) => {
    try {
      await apiClient.deleteFromHistory(historyId);
      setHistory((prev) => prev.filter((h) => h.id !== historyId));
    } catch {
      setError("Не удалось удалить видео из истории");
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return (
    <div className="p-8">
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  if (!history.length) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="mb-6 text-gray-400">
        <HistoryIcon className="w-24 h-24" />
      </span>
      <h2 className="text-xl font-semibold mb-2">В вашей истории пока нет видео</h2>
      <p className="text-muted-foreground mb-4">Здесь будут отображаться видео, которые вы смотрели.</p>
      <Button asChild variant="outline">
        <a href="/">Перейти на главную</a>
      </Button>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">История просмотров</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          item.video ? (
            <div key={item.id} className="relative group border rounded-lg p-2">
              <VideoGrid videos={[item.video as Video]} />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-80 group-hover:opacity-100"
                onClick={() => handleDelete(item.id)}
              >
                Удалить
              </Button>
            </div>
          ) : null
        ))}
      </div>
    </>
  );
}

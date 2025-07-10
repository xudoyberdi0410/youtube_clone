"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { History } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HistoryIcon } from "@/components/youtube-icons";
import { buildImageUrl } from "@/lib/api-config";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { t } from "@/lib/i18n";

function formatApiDateLocal(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd.MM.yyyy HH:mm", { locale: ru });
  } catch (error) {
    console.warn("Failed to parse date:", dateString, error);
    return dateString;
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getHistory()
      .then(setHistory)
      .catch(() => setError(t("history.failedToLoad")))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (historyId: number) => {
    try {
      await apiClient.deleteFromHistory(historyId);
      setHistory((prev) => prev.filter((h) => h.id !== historyId));
    } catch {
      setError(t("history.failedToDelete"));
    }
  };

  if (loading) return <div className="p-8">{t('history.loading')}</div>;
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
      <h2 className="text-xl font-semibold mb-2">{t('history.emptyTitle')}</h2>
      <p className="text-muted-foreground mb-4">{t('history.emptyDescription')}</p>
      <Button asChild variant="outline">
        <Link href="/">{t('history.goHome')}</Link>
      </Button>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t('history.title')}</h1>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow group">
            {/* Превью видео */}
            <div className="relative w-48 h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              {buildImageUrl(item.thumbnail_path) ? (
                <Image
                  src={buildImageUrl(item.thumbnail_path) || "/api/placeholder/320/180"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <Image
                  src="/api/placeholder/320/180"
                  alt="Нет превью"
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              )}
            </div>

            {/* Информация о видео */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg mb-1 line-clamp-2">{item.title}</h3>
              <Link 
                href={`/channel?name=${encodeURIComponent(item.channel_name)}`}
                className="text-sm text-gray-600 mb-1 hover:text-blue-600 cursor-pointer inline-block"
              >
                Канал: {item.channel_name}
              </Link>
              <p className="text-sm text-gray-500 mb-2">{item.views.toLocaleString()} просмотров</p>
              <p className="text-xs text-gray-400">Просмотрено: {formatApiDateLocal(item.watched_at)}</p>
            </div>

            {/* Кнопка удаления */}
            <div className="flex items-start">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(item.id)}
                title="Удалить из истории"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

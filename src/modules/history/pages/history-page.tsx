"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { History } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HistoryIcon } from "@/components/youtube-icons";
import { buildImageUrl } from "@/lib/api-config";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { UniversalVideoCard } from '@/components/video/UniversalVideoCard';

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
      <span className="mb-6 text-muted-foreground">
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
      <h1 className="text-2xl font-bold mb-6 text-foreground">{t('history.title')}</h1>
      <div className="flex flex-col gap-6">
        {history.map((item) => (
          <UniversalVideoCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={t('history.noDescription')}
            views={item.views}
            channel={{ name: item.channel_name, avatarUrl: undefined }}
            preview={buildImageUrl(item.thumbnail_path) || "/api/placeholder/320/180"}
            duration={undefined}
            uploadedAt={item.watched_at}
            showDelete={true}
            onDelete={() => handleDelete(item.id)}
            deleteLabel={t('history.delete')}
          />
        ))}
      </div>
    </>
  );
}

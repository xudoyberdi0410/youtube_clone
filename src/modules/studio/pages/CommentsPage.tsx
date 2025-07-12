"use client";
import { CommentsTable } from "@/components/studio/Comments/CommentsTable";
import { mockComments } from "@/lib/mock/studio-data";
import { t } from "@/lib/i18n";

export function CommentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('studio.comments')}</h1>
        <p className="text-muted-foreground">
          Manage comments on your videos. Review, approve, hide, or delete comments.
        </p>
      </div>

      <CommentsTable comments={mockComments} />
    </div>
  );
} 
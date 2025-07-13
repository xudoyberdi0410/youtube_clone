"use client";
import { useState, useEffect } from "react";
import { VideoMetaForm } from "@/components/studio/Upload/VideoMetaForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

import { Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useVideo } from "@/hooks/use-video";

export function EditVideoPage() {
  const params = useParams();
  const videoId = params?.id as string;

  const { video, isLoading, error } = useVideo({ videoId });

  // Local state for editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [thumbnail, setThumbnail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync video data to local state when loaded
  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description || "");
      setTags(video.tags || []);
      setVisibility('public'); // always public for now
      setThumbnail(video.preview);
    }
  }, [video]);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement real API update call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In a real app, this would save to backend
    console.log('Video updated:', { title, description, tags, visibility });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    // TODO: Implement real API delete call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDeleting(false);
    // In a real app, this would delete from backend
    console.log('Video deleted:', videoId);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">{t('loading')}</div>;
  }

  if (error || !video) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{t('studio.editVideo.videoNotFound')}</h2>
        <p className="text-muted-foreground mb-4">
          {t('studio.editVideo.videoNotFoundDescription')}
        </p>
        <Button asChild>
          <Link href="/studio/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('studio.editVideo.backToVideos')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('studio.editVideo.title')}</h1>
          <p className="text-muted-foreground">
            {t('studio.editVideo.description')}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/studio/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('studio.editVideo.backToVideos')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Video Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('studio.editVideo.videoPreview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={title}
                      width={480}
                      height={270}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      {t('studio.editVideo.noThumbnail')}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {video.views.toLocaleString()} views • {(video.likes ?? 0).toLocaleString()} likes
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      published
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      public
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="space-y-6">
          <VideoMetaForm
            title={title}
            description={description}
            tags={tags}
            visibility={visibility}
            thumbnail={thumbnail}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onTagsChange={setTags}
            onVisibilityChange={setVisibility}
            onThumbnailChange={setThumbnail}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t('studio.editVideo.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('studio.editVideo.saveChanges')}
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving || isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t('studio.editVideo.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('studio.editVideo.deleteVideo')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
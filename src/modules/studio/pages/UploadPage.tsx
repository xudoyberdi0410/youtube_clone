"use client";
import { useState } from "react";
import { UploadDropzone } from "@/components/studio/Upload/UploadDropzone";
import { VideoMetaForm } from "@/components/studio/Upload/VideoMetaForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { t } from "@/lib/i18n";
import { Save, Upload as UploadIcon } from "lucide-react";

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [thumbnail, setThumbnail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In a real app, this would save to backend
    console.log('Draft saved:', { title, description, tags, visibility });
  };

  const handlePublish = async () => {
    if (!selectedFile || !title.trim()) {
      return;
    }
    
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    // In a real app, this would upload to backend
    console.log('Video published:', { selectedFile, title, description, tags, visibility });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('studio.upload')}</h1>
        <p className="text-muted-foreground">
          Upload a video and add details to share with your audience.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Video Upload */}
        <div className="space-y-6">
          <UploadDropzone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
          />
          
          {selectedFile && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Video Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">File name:</span>
                    <p className="font-medium truncate">{selectedFile.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">File size:</span>
                    <p className="font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">File type:</span>
                    <p className="font-medium">{selectedFile.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium text-green-600">Ready to upload</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Video Metadata */}
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
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t('studio.upload.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('studio.upload.saveDraft')}
                </>
              )}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!selectedFile || !title.trim() || isSaving || isPublishing}
              className="flex-1"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t('studio.upload.publishing')}
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  {t('studio.upload.publish')}
                </>
              )}
            </Button>
          </div>

          {(!selectedFile || !title.trim()) && (
            <div className="text-sm text-muted-foreground">
              {!selectedFile && t('studio.upload.pleaseSelectVideo')}
              {selectedFile && !title.trim() && t('studio.upload.pleaseEnterTitle')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
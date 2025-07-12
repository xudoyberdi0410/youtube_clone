"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileVideo, CheckCircle, AlertTriangle, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { validateFileUpload } from "@/lib/utils/validation";
import type { VideoCategory } from "@/types/api";

import { t } from "@/lib/i18n";

const VIDEO_CATEGORIES: { value: VideoCategory; label: string }[] = [
  { value: "Musiqa", label: t("category.music") },
  { value: "Ta'lim", label: t("category.education") },
  { value: "Texnologiya", label: t("category.technology") },
  { value: "O'yinlar", label: t("category.games") },
  { value: "Yangiliklar", label: t("category.news") },
  { value: "Ko'ngilochar", label: t("category.entertainment") },
  { value: "Sport", label: t("category.sport") },
  { value: "Ilm-fan va Tabiat", label: t("category.science") },
  { value: "Sayohat", label: t("category.travel") },
  { value: "Oshxona va Pazandachilik", label: t("category.cooking") },
];

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  videoType: "video" | "shorts" | null;
}

export function UploadVideoForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<VideoCategory>("Musiqa");
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    videoType: null,
  });

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateFileUpload(file, "video");
    if (!validation.isValid) {
      setUploadState((prev) => ({
        ...prev,
        error: validation.error || t("upload.error.invalidFile"),
      }));
      return;
    }

    setSelectedFile(file);
    setUploadState((prev) => ({ ...prev, error: null }));

    // Detect video orientation
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const isVertical = video.videoHeight > video.videoWidth;
      setUploadState((prev) => ({
        ...prev,
        videoType: isVertical ? "shorts" : "video",
      }));
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      setUploadState((prev) => ({
        ...prev,
        error: t("upload.error.orientationDetect"),
      }));
      URL.revokeObjectURL(video.src);
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadState((prev) => ({ ...prev, videoType: null, error: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    // For shorts, only video file is required
    // For regular videos, both file and title are required
    if (!selectedFile) {
      setUploadState((prev) => ({ ...prev, error: t("upload.error.noFile") }));
      return;
    }

    if (uploadState.videoType === "video" && !title.trim()) {
      setUploadState((prev) => ({ ...prev, error: t("upload.error.noTitle") }));
      return;
    }

    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
    }));

    try {
      const uploadData = {
        title: title.trim(),
        description: description.trim(),
        category,
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90),
        }));
      }, 500);

      if (uploadState.videoType === "shorts") {
        await apiClient.uploadShorts(selectedFile);
      } else {
        await apiClient.uploadVideo(selectedFile, uploadData);
      }

      clearInterval(progressInterval);
      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        success: true,
        isUploading: false,
      }));

      // Redirect after successful upload
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        error:
          error instanceof Error
            ? error.message
            : t("upload.error.uploadFailed"),
      }));
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setCategory("Musiqa");
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
      videoType: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("upload.title")}</CardTitle>
        <CardDescription>{t("upload.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div>
          <Label htmlFor="video-upload">{t("upload.fileLabel")}</Label>
          <div
            className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <FileVideo className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {uploadState.videoType && (
                  <Badge
                    data-testid={
                      uploadState.videoType === 'shorts'
                        ? 'shorts-badge'
                        : 'video-badge'
                    }
                    variant={
                      uploadState.videoType === 'shorts'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {uploadState.videoType === 'shorts'
                      ? t('upload.shortsBadge')
                      : t('upload.videoBadge')}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {t("upload.dropOrSelect")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("upload.supportedFormats")}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              {t("upload.selectFile")}
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              {t("upload.titleLabel", {
                required:
                  uploadState.videoType === "video"
                    ? "*"
                    : t("upload.shortsNotUsed"),
              })}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                uploadState.videoType === "shorts"
                  ? t("upload.titleShortsPlaceholder")
                  : t("upload.titlePlaceholder")
              }
              maxLength={100}
              className="mt-1"
              disabled={uploadState.videoType === "shorts"}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {uploadState.videoType === "shorts"
                ? t("upload.shortsOnlyFile")
                : t("upload.titleSymbols", { count: title.length })}
            </p>
          </div>

          <div>
            <Label htmlFor="description">
              {t("upload.descriptionLabel", {
                shorts:
                  uploadState.videoType === "shorts"
                    ? t("upload.shortsNotUsed")
                    : "",
              })}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                uploadState.videoType === "shorts"
                  ? t("upload.descriptionShortsPlaceholder")
                  : t("upload.descriptionPlaceholder")
              }
              maxLength={5000}
              className="mt-1 min-h-[100px]"
              disabled={uploadState.videoType === "shorts"}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {uploadState.videoType === "shorts"
                ? t("upload.shortsOnlyFile")
                : t("upload.descriptionSymbols", { count: description.length })}
            </p>
          </div>

          <div>
            <Label htmlFor="category">
              {t("upload.categoryLabel", {
                shorts:
                  uploadState.videoType === "shorts"
                    ? t("upload.shortsNotUsed")
                    : "",
              })}
            </Label>
            <Select
              value={category}
              onValueChange={(value: VideoCategory) => setCategory(value)}
              disabled={uploadState.videoType === "shorts"}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    uploadState.videoType === "shorts"
                      ? t("upload.categoryShortsPlaceholder")
                      : t("upload.categoryPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadState.isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("upload.title")}</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(uploadState.progress)}%
              </span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        {/* Error Message */}
        {uploadState.error && (
          <Alert variant="destructive" data-testid="upload-error-alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{uploadState.error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {uploadState.success && (
          <Alert data-testid="upload-success-alert">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{t('upload.success')}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleUpload}
            disabled={
              !selectedFile ||
              (uploadState.videoType === "video" && !title.trim()) ||
              uploadState.isUploading
            }
            className="flex-1"
          >
            {uploadState.isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                {t("upload.uploading")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("upload.uploadBtn")}
              </>
            )}
          </Button>

          {(selectedFile || uploadState.success) && (
            <Button variant="outline" onClick={reset}>
              {t("upload.clear")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

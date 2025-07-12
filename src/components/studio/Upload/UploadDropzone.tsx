"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, X } from "lucide-react";
import { t } from "@/lib/i18n";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onRemoveFile: () => void;
}

export function UploadDropzone({ onFileSelect, selectedFile, onRemoveFile }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <Card className="border-2 border-dashed border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <FileVideo className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{selectedFile.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : isDragReject 
            ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      }`}
    >
      <CardContent className="p-8">
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            {t('studio.upload.dropzone')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('studio.upload.supportedFormats')}
          </p>
          <Button variant="outline">
            {t('studio.upload.selectFile')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
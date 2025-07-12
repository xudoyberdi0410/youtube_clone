"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { t } from "@/lib/i18n";
import Image from "next/image";

interface VideoMetaFormProps {
  title: string;
  description: string;
  tags: string[];
  visibility: 'public' | 'unlisted' | 'private';
  thumbnail?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTagsChange: (tags: string[]) => void;
  onVisibilityChange: (visibility: 'public' | 'unlisted' | 'private') => void;
  onThumbnailChange: (thumbnail: string) => void;
}

export function VideoMetaForm({
  title,
  description,
  tags,
  visibility,
  thumbnail,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  onVisibilityChange,
  onThumbnailChange
}: VideoMetaFormProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.upload.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">{t('studio.upload.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t('studio.upload.enterTitle')}
              maxLength={100}
            />
            <p className="text-sm text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.upload.description')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">{t('studio.upload.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={t('studio.upload.describeVideo')}
              rows={4}
              maxLength={5000}
            />
            <p className="text-sm text-muted-foreground">
              {description.length}/5000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.upload.tags')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('studio.upload.addTag')}
                maxLength={20}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 10}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {tags.length}/10 tags
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.upload.thumbnail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {thumbnail ? (
              <div className="relative">
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  width={320}
                  height={180}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => onThumbnailChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t('studio.upload.uploadCustomThumbnail')}
                </p>
                <Button variant="outline" size="sm">
                  {t('studio.channel.uploadImage')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.upload.visibility')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="visibility">{t('studio.upload.visibility')}</Label>
            <Select value={visibility} onValueChange={(value: 'public' | 'unlisted' | 'private') => onVisibilityChange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {t('studio.visibility.public')} - {t('studio.upload.anyoneCanSearch')}
                  </div>
                </SelectItem>
                <SelectItem value="unlisted">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    {t('studio.visibility.unlisted')} - {t('studio.upload.anyoneWithLink')}
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {t('studio.visibility.private')} - {t('studio.upload.onlyYouCanView')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
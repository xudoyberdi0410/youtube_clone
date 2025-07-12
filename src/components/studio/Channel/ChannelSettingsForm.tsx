"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { t } from "@/lib/i18n";
import Image from "next/image";

interface ChannelSettingsFormProps {
  name: string;
  description: string;
  avatar: string;
  banner: string;
  commentSettings: 'all' | 'filtered' | 'disabled';
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onAvatarChange: (avatar: string) => void;
  onBannerChange: (banner: string) => void;
  onCommentSettingsChange: (settings: 'all' | 'filtered' | 'disabled') => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ChannelSettingsForm({
  name,
  description,
  avatar,
  banner,
  commentSettings,
  onNameChange,
  onDescriptionChange,
  onAvatarChange,
  onBannerChange,
  onCommentSettingsChange,
  onSave,
  isSaving
}: ChannelSettingsFormProps) {
  return (
    <div className="space-y-6">
      {/* Channel Name */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.channel.name')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="channelName">{t('studio.channel.name')}</Label>
            <Input
              id="channelName"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t('studio.channel.enterChannelName')}
              maxLength={100}
            />
            <p className="text-sm text-muted-foreground">
              {name.length}/100 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Channel Description */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.channel.description')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="channelDescription">{t('studio.channel.description')}</Label>
            <Textarea
              id="channelDescription"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={t('studio.channel.describeChannel')}
              rows={4}
              maxLength={5000}
            />
            <p className="text-sm text-muted-foreground">
              {description.length}/5000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Channel Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.channel.avatar')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} alt="Channel avatar" />
              <AvatarFallback className="text-lg">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {t('studio.channel.uploadImage')}
              </Button>
              {avatar && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onAvatarChange("")}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('studio.channel.removeImage')}
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {t('studio.channel.fileFormatInfo')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Banner */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.channel.banner')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {banner ? (
              <div className="relative">
                <Image
                  src={banner}
                  alt="Channel banner"
                  width={640}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => onBannerChange("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t('studio.channel.uploadBannerImage')}
                </p>
                <Button variant="outline" size="sm">
                  {t('studio.channel.uploadImage')}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('studio.channel.recommendedSize')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('studio.channel.commentSettings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="commentSettings">{t('studio.channel.commentSettings')}</Label>
            <Select value={commentSettings} onValueChange={(value: 'all' | 'filtered' | 'disabled') => onCommentSettingsChange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('studio.channel.commentSettings.all')}
                </SelectItem>
                <SelectItem value="filtered">
                  {t('studio.channel.commentSettings.filtered')}
                </SelectItem>
                <SelectItem value="disabled">
                  {t('studio.channel.commentSettings.disabled')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              {t('studio.channel.saving')}
            </>
          ) : (
            t('studio.channel.save')
          )}
        </Button>
      </div>
    </div>
  );
} 
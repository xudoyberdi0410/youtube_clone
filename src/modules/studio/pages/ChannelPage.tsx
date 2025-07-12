"use client";
import { useState } from "react";
import { ChannelSettingsForm } from "@/components/studio/Channel/ChannelSettingsForm";
import { mockChannelSettings } from "@/lib/mock/studio-data";
import { t } from "@/lib/i18n";

export function ChannelPage() {
  const [name, setName] = useState(mockChannelSettings.name);
  const [description, setDescription] = useState(mockChannelSettings.description);
  const [avatar, setAvatar] = useState(mockChannelSettings.avatar);
  const [banner, setBanner] = useState(mockChannelSettings.banner);
  const [commentSettings, setCommentSettings] = useState(mockChannelSettings.commentSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In a real app, this would save to backend
    console.log('Channel settings saved:', { name, description, avatar, banner, commentSettings });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('studio.channel')}</h1>
        <p className="text-muted-foreground">
          Manage your channel information, branding, and settings.
        </p>
      </div>

      <ChannelSettingsForm
        name={name}
        description={description}
        avatar={avatar}
        banner={banner}
        commentSettings={commentSettings}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onAvatarChange={setAvatar}
        onBannerChange={setBanner}
        onCommentSettingsChange={setCommentSettings}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
} 
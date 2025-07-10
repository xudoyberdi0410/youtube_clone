'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Upload, Trash2, Users, Calendar, Image as LucideImage } from "lucide-react"
import { useChannels } from '@/modules/settings/hooks/use-channels'
import { ChannelCreate, ChannelUpdate } from '@/types/api'

import { buildImageUrl } from '@/lib/api-config'
import { formatApiDate } from '@/lib/utils/format'
import Image from 'next/image'
import { t } from '@/lib/i18n'

export const ChannelsTab = () => {
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const bannerImageInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    channel_name: '',
    description: ''
  })

  const {
    channels,
    loading,
    saving,
    error,
    success,
    createChannel,
    updateChannel,
    uploadProfileImage,
    uploadBannerImage,
    deleteChannel,
    clearMessages
  } = useChannels()

  // Используем первый (единственный) канал
  const channel = channels[0] || null
  const hasChannel = !!channel

  // Инициализируем форму данными канала
  useEffect(() => {
    if (channel) {
      setFormData({
        channel_name: channel.channel_name || '',
        description: channel.description || ''
      })
    } else {
      setFormData({ channel_name: '', description: '' })
    }
  }, [channel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (!formData.channel_name.trim()) {
      return
    }

    try {
      if (!hasChannel) {
        // Создаем новый канал
        const channelData: ChannelCreate = {
          channel_name: formData.channel_name.trim(),
          description: formData.description.trim()
        }
        await createChannel(channelData)
      } else {
        // Обновляем существующий канал
        const channelData: ChannelUpdate = {
          channel_name: formData.channel_name.trim(),
          description: formData.description.trim()
        }
        await updateChannel(channel.id, channelData)
      }
    } catch {
      // Ошибка уже обработана в хуке
    }
  }

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && channel) {
      uploadProfileImage(channel.id, file)
    }
  }

  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && channel) {
      uploadBannerImage(channel.id, file)
    }
  }

  const handleDeleteChannel = async () => {
    if (!channel) return
    
    try {
      await deleteChannel(channel.id)
      setFormData({ channel_name: '', description: '' })
    } catch {
      // Ошибка уже обработана в хуке
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Сообщения об ошибках и успехе */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {t(error)}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {t(success)}
        </div>
      )}

      {/* Форма канала */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hasChannel ? `${t('settings.channel.titleWithName')}: ${channel.channel_name}` : t('settings.channel.createTitle')}
          </CardTitle>
          <CardDescription>
            {hasChannel 
              ? t('settings.channel.manageDesc')
              : t('settings.channel.createDesc')
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channelName">{t('settings.channel.name')}</Label>
              <Input
                id="channelName"
                value={formData.channel_name}
                onChange={(e) => setFormData(prev => ({ ...prev, channel_name: e.target.value }))}
                placeholder={t('settings.channel.namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelDescription">{t('settings.channel.description')}</Label>
              <Textarea
                id="channelDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('settings.channel.descriptionPlaceholder')}
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full"
            >
              {saving ? t('settings.saving') : (hasChannel ? t('settings.channel.updateBtn') : t('settings.channel.createBtn'))}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Статистика канала (только если канал существует) */}
      {hasChannel && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.channel.statsTitle')}</CardTitle>
            <CardDescription>{t('settings.channel.statsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('settings.channel.subscribers')}</p>
                  <p className="font-medium">{channel.subscribers_count || channel.subscription_amount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('settings.channel.created')}</p>
                  <p className="font-medium">
                    {formatApiDate(channel.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Управление изображениями (только если канал существует) */}
      {hasChannel && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.channel.imagesTitle')}</CardTitle>
            <CardDescription>{t('settings.channel.imagesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Профильное изображение */}
            <div>
              <Label className="text-sm font-medium">{t('settings.channel.profileImage')}</Label>
              <div className="flex items-center gap-4 mt-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={buildImageUrl(channel.profile_image_url || channel.profile_image || '')} 
                    alt={channel.channel_name} 
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {(channel?.channel_name ? channel.channel_name.slice(0, 2).toUpperCase() : '?')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => profileImageInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t('settings.channel.uploadProfileImage')}
                  </Button>
                  <p className="text-xs text-gray-500">{t('settings.channel.profileImageHint')}</p>
                </div>
              </div>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            <Separator />

            {/* Баннер */}
            <div>
              <Label className="text-sm font-medium">{t('settings.channel.bannerImage')}</Label>
              <div className="mt-2">
                {(channel.banner_image_url || channel.banner_image) ? (
                  <div className="relative">
                    <Image 
                      src={buildImageUrl(channel.banner_image_url || channel.banner_image || '')} 
                      alt={t('settings.channel.bannerAlt')}
                      className="w-full h-32 object-cover rounded-lg"
                      fill
                      sizes="100vw"
                      priority
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => bannerImageInputRef.current?.click()}
                      disabled={saving}
                    >
                      <LucideImage className="mr-2 h-4 w-4" />
                      {t('settings.channel.changeBanner')}
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <LucideImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4">{t('settings.channel.noBanner')}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bannerImageInputRef.current?.click()}
                      disabled={saving}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {t('settings.channel.uploadBanner')}
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {t('settings.channel.bannerHint')}
                </p>
              </div>
              <input
                ref={bannerImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Опасная зона (только если канал существует) */}
      {hasChannel && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">{t('settings.channel.dangerZone')}</CardTitle>
            <CardDescription>{t('settings.channel.dangerZoneDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={saving}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('settings.channel.deleteBtn')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.channel.deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`${t('settings.channel.deleteConfirmDesc')} "${channel.channel_name}"`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('settings.channel.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteChannel}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t('settings.channel.deleteBtn')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-gray-500 mt-2">
              {t('settings.channel.deleteWarning')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

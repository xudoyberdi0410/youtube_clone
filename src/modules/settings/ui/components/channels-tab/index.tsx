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
import { Upload, Trash2, Users, Calendar, Image } from "lucide-react"
import { useChannels } from '@/modules/settings/hooks/use-channels'
import { ChannelCreate, ChannelUpdate } from '@/types/api'
import { buildImageUrl } from '@/lib/api-config'

export const ChannelsTab = () => {
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const bannerImageInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
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
        name: channel.name || '',
        description: channel.description || ''
      })
    } else {
      setFormData({ name: '', description: '' })
    }
  }, [channel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()

    if (!formData.name.trim()) {
      return
    }

    try {
      if (!hasChannel) {
        // Создаем новый канал
        const channelData: ChannelCreate = {
          name: formData.name.trim(),
          description: formData.description.trim()
        }
        await createChannel(channelData)
      } else {
        // Обновляем существующий канал
        const channelData: ChannelUpdate = {
          name: formData.name.trim(),
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
      setFormData({ name: '', description: '' })
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
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Форма канала */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hasChannel ? `Channel: ${channel.name}` : 'Create New Channel'}
          </CardTitle>
          <CardDescription>
            {hasChannel 
              ? 'Manage your channel details and settings'
              : 'Create a new YouTube channel to start uploading videos and building your audience'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your channel name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="channelDescription">Description</Label>
              <Textarea
                id="channelDescription"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your channel and what viewers can expect"
                rows={4}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={saving} 
              className="w-full"
            >
              {saving ? 'Saving...' : (hasChannel ? 'Update Channel' : 'Create Channel')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Статистика канала (только если канал существует) */}
      {hasChannel && (
        <Card>
          <CardHeader>
            <CardTitle>Channel Statistics</CardTitle>
            <CardDescription>Overview of your channel performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscribers</p>
                  <p className="font-medium">{channel.subscribers_count || channel.subscription_amount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {/* TODO: Попросить бэкенд возвращать даты в ISO формате (2025-06-27T17:23:43.000Z) вместо "27.06.2025 17:23:43" */}
                    {channel.created_at}
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
            <CardTitle>Channel Images</CardTitle>
            <CardDescription>Upload and manage your channel profile and banner images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Профильное изображение */}
            <div>
              <Label className="text-sm font-medium">Profile Image</Label>
              <div className="flex items-center gap-4 mt-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={buildImageUrl(channel.profile_image_url || channel.profile_image || '')} 
                    alt={channel.name} 
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {channel.name.slice(0, 2).toUpperCase()}
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
                    Upload Profile Image
                  </Button>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
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
              <Label className="text-sm font-medium">Banner Image</Label>
              <div className="mt-2">
                {(channel.banner_image_url || channel.banner_image) ? (
                  <div className="relative">
                    <img 
                      src={buildImageUrl(channel.banner_image_url || channel.banner_image || '')} 
                      alt="Channel banner" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => bannerImageInputRef.current?.click()}
                      disabled={saving}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Change Banner
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4">No banner image uploaded</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bannerImageInputRef.current?.click()}
                      disabled={saving}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Banner
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Recommended size: 2560 x 1440 pixels. JPG, PNG or GIF. Max size 5MB.
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
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={saving}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Channel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your channel
                    &quot;{channel.name}&quot; and all associated data including videos, comments, and subscribers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteChannel}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Channel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-gray-500 mt-2">
              This will permanently delete your channel and all associated data. This action cannot be undone.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

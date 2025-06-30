'use client'

import { useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Trash2 } from "lucide-react"
import { useSettings } from '@/modules/settings/hooks/use-settings'
import { getAvatarUrl } from "@/modules/auth/lib/auth-utils"

export const AccountTab = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    user,
    formData,
    saving,
    error,
    success,
    cacheBuster,
    updateFormData,
    handleSubmit,
    handleAvatarUpload,
    handleDeleteAccount
  } = useSettings()

  if (!user) {
    return null
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  const displayName = user.name || user.username || "User"
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarUrl = getAvatarUrl(user, cacheBuster)

  return (
    <div className="space-y-6">
      {/* Аватар */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Click to upload a new profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload new picture
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Основные настройки */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateFormData({ username: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                required
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="Leave empty to keep current password"
              />
            </div>
            
            {formData.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                  required={!!formData.password}
                />
              </div>
            )}
            
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Опасная зона */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            This will permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// src/components/playlist/EditPlaylistDialog.tsx

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { t } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import type { Playlist, PlaylistUpdate } from "@/types/api"

interface EditPlaylistDialogProps {
  playlist: Playlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlaylistUpdated?: (playlist: Playlist) => void
}

export function EditPlaylistDialog({ 
  playlist, 
  open, 
  onOpenChange, 
  onPlaylistUpdated 
}: EditPlaylistDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PlaylistUpdate & { is_personal: boolean }>({
    name: "",
    description: "",
    is_personal: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name,
        description: playlist.description,
        is_personal: playlist.is_personal || !playlist.is_public,
      })
    }
  }, [playlist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: t("playlist.errorTitle"),
        description: t("playlist.nameRequired"),
        variant: "destructive",
      })
      return
    }

    if (!playlist) return

    setIsLoading(true)
    
    try {
      // Здесь должен быть вызов API для обновления плейлиста
      // Временно имитируем обновление плейлиста
      const updatedPlaylist = {
        ...playlist,
        name: formData.name,
        description: formData.description,
        is_personal: formData.is_personal,
        updated_at: new Date().toISOString(),
      }
      
      onPlaylistUpdated?.(updatedPlaylist)
      
      toast({
        title: t("playlist.successTitle"),
        description: t("playlist.updated"),
      })
      
      onOpenChange(false)
    } catch {
      toast({
        title: t("playlist.errorTitle"),
        description: t("playlist.updateFailed"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!playlist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("playlist.editTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("playlist.name")}</Label>
            <Input
              id="edit-name"
              placeholder={t("playlist.namePlaceholder")}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">{t("playlist.description")}</Label>
            <Textarea
              id="edit-description"
              placeholder={t("playlist.descriptionPlaceholder")}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-personal"
              checked={formData.is_personal}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_personal: checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="edit-personal">{t("playlist.personal")}</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("playlist.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("playlist.saveChanges")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

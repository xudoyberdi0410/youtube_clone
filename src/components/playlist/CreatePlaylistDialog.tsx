// src/components/playlist/CreatePlaylistDialog.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PlaylistCreate } from "@/types/api"

interface CreatePlaylistDialogProps {
  onPlaylistCreated?: (playlistData: PlaylistCreate) => void
  trigger?: React.ReactNode
}

export function CreatePlaylistDialog({ onPlaylistCreated, trigger }: CreatePlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PlaylistCreate>({
    name: "",
    description: "",
    is_personal: false,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Playlist name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Вызываем callback с данными плейлиста
      await onPlaylistCreated?.(formData)
      
      toast({
        title: "Success",
        description: "Playlist created successfully",
      })
      
      setOpen(false)
      setFormData({ name: "", description: "", is_personal: false })
    } catch {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="w-4 h-4" />
      Create Playlist
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter playlist name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter playlist description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_personal"
              checked={formData.is_personal}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_personal: checked }))}
              disabled={isLoading}
            />
            <Label htmlFor="is_personal">Personal playlist (only you can see it)</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

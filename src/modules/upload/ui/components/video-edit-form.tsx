import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import type { VideoCategory } from '@/types/api'

const VIDEO_CATEGORIES: { value: VideoCategory; label: string }[] = [
  { value: 'Musiqa', label: 'Музыка' },
  { value: "Ta'lim", label: 'Образование' },
  { value: 'Texnologiya', label: 'Технологии' },
  { value: "O'yinlar", label: 'Игры' },
  { value: 'Yangiliklar', label: 'Новости' },
  { value: "Ko'ngilochar", label: 'Развлечения' },
  { value: 'Sport', label: 'Спорт' },
  { value: 'Ilm-fan va Tabiat', label: 'Наука и природа' },
  { value: 'Sayohat', label: 'Путешествия' },
  { value: 'Oshxona va Pazandachilik', label: 'Кулинария' },
]

interface VideoEditFormProps {
  initialTitle: string
  initialDescription: string
  initialCategory: VideoCategory
  onSubmit: (data: { title: string; description: string; category: VideoCategory }) => Promise<void>
  loading?: boolean
  error?: string | null
  success?: boolean
}

export function VideoEditForm({
  initialTitle,
  initialDescription,
  initialCategory,
  onSubmit,
  loading,
  error,
  success
}: VideoEditFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [category, setCategory] = useState<VideoCategory>(initialCategory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ title, description, category })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">{title.length}/100 символов</p>
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={5000}
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">{description.length}/5000 символов</p>
      </div>
      <div>
        <Label htmlFor="category">Категория</Label>
        <Select value={category} onValueChange={v => setCategory(v as VideoCategory)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Выберите категорию" />
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
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Изменения сохранены!</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Сохранение...' : 'Сохранить изменения'}
      </Button>
    </form>
  )
}

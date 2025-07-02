import { Metadata } from 'next'
import { UploadVideoForm } from '@/modules/upload/ui/components/upload-video-form'

export const metadata: Metadata = {
  title: 'Загрузить видео | YouTube Clone',
  description: 'Загрузите новое видео или Shorts на YouTube Clone',
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Загрузка видео</h1>
          <p className="text-muted-foreground mt-2">
            Поделитесь своим контентом с миром
          </p>
        </div>
        
        <UploadVideoForm />
      </div>
    </div>
  )
}
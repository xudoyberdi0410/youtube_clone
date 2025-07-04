"use client";

import { UploadVideoForm } from '@/modules/upload/ui/components/upload-video-form'
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const { isLoggedIn, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center py-16">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">
                Войдите, чтобы загрузить видео
              </h2>
              <p className="text-gray-500 mb-6">
                Для загрузки видео необходимо войти в аккаунт
              </p>
              <button 
                onClick={() => setShowAuthDialog(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
        <AuthRequiredDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          title="Войдите, чтобы загрузить видео"
          description="Для загрузки видео необходимо войти в свой аккаунт."
        />
      </>
    );
  }

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
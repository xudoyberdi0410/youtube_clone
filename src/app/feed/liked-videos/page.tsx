"use client";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { LikedVideoCard } from "@/components/video/LikedVideoCard";
import { useLikedVideos } from "@/hooks/use-liked-videos";
import { ThumbsUp, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function LikedVideosPage() {
    const { isLoggedIn, loading: authLoading } = useAuth();
    const { likedVideos, isLoading, error, removeLike } = useLikedVideos();
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    // Показываем загрузку если идет аутентификация или загрузка видео
    if (authLoading || (isLoggedIn && isLoading)) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <>
                <div className="text-center py-16">
                    <ThumbsUp className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Войдите, чтобы просмотреть понравившиеся видео
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Ставьте лайки видео, чтобы сохранить их в этот плейлист
                    </p>
                    <button 
                        onClick={() => setShowAuthDialog(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Войти
                    </button>
                </div>
                <AuthRequiredDialog 
                    open={showAuthDialog} 
                    onOpenChange={setShowAuthDialog}
                    title="Войдите для просмотра понравившихся видео"
                    description="Чтобы просматривать видео, которые вам понравились, необходимо войти в аккаунт."
                />
            </>
        );
    }

    // Показываем ошибку если она есть
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <ThumbsUp className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Понравившиеся видео</h1>
                </div>
                
                <div className="text-center py-16">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Ошибка загрузки
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {error}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <ThumbsUp className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Понравившиеся видео</h1>
            </div>
            
            {likedVideos.length === 0 ? (
                <div className="text-center py-16">
                    <ThumbsUp className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                        У вас пока нет понравившихся видео
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Ставьте лайки видео, чтобы добавить их в этот плейлист
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {likedVideos.map((likedVideo) => (
                        likedVideo.video && (
                            <LikedVideoCard
                                key={likedVideo.id}
                                video={likedVideo.video}
                                likeId={likedVideo.id}
                                onRemoveLike={removeLike}
                            />
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

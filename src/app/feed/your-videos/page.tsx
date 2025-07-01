"use client";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { Play } from "lucide-react";
import { useState } from "react";

export default function YourVideosPage() {
    const { isLoggedIn, loading } = useAuth();
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-video bg-gray-200 rounded-xl"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
                    <Play className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 mb-2">
                        Sign in to view your videos
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Upload and manage your own videos
                    </p>
                    <button 
                        onClick={() => setShowAuthDialog(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Sign in
                    </button>
                </div>
                <AuthRequiredDialog 
                    open={showAuthDialog} 
                    onOpenChange={setShowAuthDialog}
                    title="Sign in to view your videos"
                    description="You need to be signed in to view and manage your uploaded videos."
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Play className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Your videos</h1>
            </div>
            
            <div className="text-center py-16">
                <Play className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                    No videos uploaded yet
                </h2>
                <p className="text-gray-500">
                    Upload your first video to get started
                </p>
            </div>
        </div>
    );
}

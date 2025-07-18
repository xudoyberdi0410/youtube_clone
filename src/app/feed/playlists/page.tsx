"use client";

import { useAuth } from "@/modules/auth/hooks/use-auth";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";
import { EditPlaylistDialog } from "@/components/playlist/EditPlaylistDialog";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { usePlaylists } from "@/hooks/use-playlists";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import type { Playlist, PlaylistUpdate, PlaylistCreate } from "@/types/api";
import { t } from "@/lib/i18n";

export default function PlaylistsPage() {
    const { isLoggedIn, loading: authLoading } = useAuth();
    const { playlists, isLoading, error, createPlaylist, updatePlaylist, deletePlaylist } = usePlaylists();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

    const handlePlaylistCreated = async (playlistData: PlaylistCreate) => {
        try {
            // Приводим к типу Omit<Playlist, 'id' | 'created_at'>
            const playlistDataForApi = {
                ...playlistData,
                user_id: 0, // TODO: заменить на реальный user_id, если есть
                is_public: true, // или false, если по умолчанию приватный
            };
            await createPlaylist(playlistDataForApi);
        } catch (error) {
            console.error('Failed to create playlist:', error);
        }
    };

    const handlePlaylistUpdated = async (updatedPlaylist: Playlist) => {
        try {
            const updateData: PlaylistUpdate = {
                name: updatedPlaylist.name,
                description: updatedPlaylist.description
            }
            
            // Добавляем is_personal если оно есть
            if (updatedPlaylist.is_personal !== undefined) {
                updateData.is_personal = updatedPlaylist.is_personal
            }
            
            await updatePlaylist(updatedPlaylist.id, updateData);
        } catch (error) {
            console.error('Failed to update playlist:', error);
        }
    };

    const handlePlaylistDeleted = async (playlistId: number) => {
        try {
            await deletePlaylist(playlistId);
        } catch (error) {
            console.error('Failed to delete playlist:', error);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={`skeleton-${i}`} className="space-y-3">
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
                    <List className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 mb-2">
                        {t('auth.signInToViewPlaylists')}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {t('auth.createAndManagePlaylists')}
                    </p>
                    <button 
                        onClick={() => setShowAuthDialog(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        {t('auth.signIn')}
                    </button>
                </div>
                <AuthRequiredDialog 
                    open={showAuthDialog} 
                    onOpenChange={setShowAuthDialog}
                    title={t('auth.signInToViewPlaylists')}
                    description={"You need to be signed in to view and manage your playlists."}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <List className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">{t('playlists.title')}</h1>
                </div>
                <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
            </div>
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-2xl shadow-sm">
                    <List className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        {t('playlists.noPlaylists')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {t('playlists.createToOrganize')}
                    </p>
                    <CreatePlaylistDialog 
                        onPlaylistCreated={handlePlaylistCreated}
                        trigger={
                            <button className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                                <Plus className="w-4 h-4" />
                                {t('playlists.createFirst')}
                            </button>
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {playlists.map((playlist) => (
                        <PlaylistCard
                            key={`playlist-${playlist.id}`}
                            playlist={playlist}
                            onEdit={setEditingPlaylist}
                            onDelete={handlePlaylistDeleted}
                        />
                    ))}
                </div>
            )}
            <EditPlaylistDialog
                playlist={editingPlaylist}
                open={!!editingPlaylist}
                onOpenChange={(open) => !open && setEditingPlaylist(null)}
                onPlaylistUpdated={handlePlaylistUpdated}
            />
        </div>
    );
}

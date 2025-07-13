"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon, UserCircleIcon } from "@/components/youtube-icons";
import { List, Play, Clock, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/modules/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { useIsClient } from "@/hooks/use-is-client";

import { t } from "@/lib/i18n";

const items = [
    {
        title: t("sidebar.you"),
        url: "/feed/you",
        icon: UserCircleIcon,
        auth: true
    },
    {
        title: t("sidebar.history"),
        url: "/feed/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: t("sidebar.playlists"),
        url: "/feed/playlists",
        icon: List,
        auth: true
    },
    // Вместо yourVideos — ссылка на Studio
    {
        title: t("sidebar.yourVideos"),
        url: "/studio/videos",
        icon: Play,
        auth: true
    },
    {
        title: t("sidebar.watchLater"),
        url: "/feed/watch-later",
        icon: Clock,
        auth: true
    },
    {
        title: t("sidebar.likedVideos"),
        url: "/feed/liked-videos",
        icon: ThumbsUp,
        auth: true
    },
];

export const PersonalSection = memo(() => {
    const isClient = useIsClient();
    const { isLoggedIn, loading } = useAuthContext();
    const pathname = usePathname();
    if (!isClient || loading) return null;
    // Show loading state only on initial load when we don't know auth status
    if (loading) {
        return (
            <SidebarGroup className="py-0">
                <SidebarGroupContent>
                    <div className="animate-pulse space-y-2">
                        <div className="h-10 bg-muted rounded-lg"></div>
                        <div className="h-10 bg-muted rounded-lg"></div>
                        <div className="h-10 bg-muted rounded-lg"></div>
                        <div className="h-10 bg-muted rounded-lg"></div>
                        <div className="h-10 bg-muted rounded-lg"></div>
                        <div className="h-10 bg-muted rounded-lg"></div>
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    // Show login button if user is not authenticated
    if (!isLoggedIn) {
        return (
            <SidebarGroup className="py-0">
                <SidebarGroupContent>
                    <div className="px-2 py-2 group-data-[state=collapsed]:px-0">
                        <Button
                            variant={"outline"}
                            className="w-full h-10 px-2 text-sm font-medium rounded-full shadow-none flex items-center border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow transition-colors duration-150 group-data-[state=collapsed]:w-10 group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:border-0"
                            asChild
                        >
                            <Link href="/auth/signin" className="flex items-center gap-3 group-data-[state=collapsed]:gap-0 group-data-[state=collapsed]:justify-center w-full h-full">
                                <UserCircleIcon className="w-6 h-6 flex-shrink-0"/>
                                <span className="group-data-[state=collapsed]:hidden">{t("auth.signIn")}</span>
                            </Link>
                        </Button>
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }

    // Show personal section items if user is authenticated
    return (
        <SidebarGroup className="py-0">
            <SidebarGroupContent>
                <SidebarMenu className="space-y-0">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
                                className="h-10 px-2 rounded-lg hover:bg-muted data-[active=true]:bg-muted group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center"
                            >
                                <Link href={item.url} className="flex items-center gap-6 group-data-[state=collapsed]:gap-0">
                                    <item.icon className="w-6 h-6 flex-shrink-0"/>
                                    <span className="text-sm font-normal group-data-[state=collapsed]:hidden">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
})

PersonalSection.displayName = 'PersonalSection'
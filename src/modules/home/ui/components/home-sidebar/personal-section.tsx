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

const items = [
    {
        title: "You",
        url: "/feed/you",
        icon: UserCircleIcon,
        auth: true
    },
    {
        title: "History",
        url: "/feed/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "Playlists",
        url: "/feed/playlists",
        icon: List,
        auth: true
    },
    {
        title: "Your videos",
        url: "/feed/your-videos",
        icon: Play,
        auth: true
    },
    {
        title: "Watch later",
        url: "/feed/watch-later",
        icon: Clock,
        auth: true
    },
    {
        title: "Liked videos",
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
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 bg-gray-200 rounded-lg"></div>
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
                    <div className="px-2 py-2">
                        <Button
                            variant={"outline"}
                            className="w-full justify-start h-10 px-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-lg shadow-none hover:bg-blue-100"
                            asChild
                        >
                            <Link href="/auth/signin" className="flex items-center gap-6 group-data-[state=collapsed]:gap-0 group-data-[state=collapsed]:justify-center">
                                <UserCircleIcon className="w-6 h-6 flex-shrink-0"/>
                                <span className="group-data-[state=collapsed]:hidden">Sign in</span>
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
                                className="h-10 px-2 rounded-lg hover:bg-gray-100 data-[active=true]:bg-gray-100 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center"
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
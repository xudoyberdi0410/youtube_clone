"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { GaminIcon, LearningIcon, LiveIcon, MusicIcon, NewsIcon, SportsIcon, TrendingIcon } from "@/components/youtube-icons";
import Link from "next/link";

const items = [
    {
        title: "Trending",
        url: "/feed/trending",
        icon: TrendingIcon,
    },
    {
        title: "Music",
        url: "/channels/music",
        icon: MusicIcon,
    },
    {
        title: "Live",
        url: "/channels/live",
        icon: LiveIcon,
    },
    {
        title: "Gaming",
        url: "/feed/gaming",
        icon: GaminIcon,
    },
    {
        title: "News",
        url: "/feed/news",
        icon: NewsIcon,
    },
    {
        title: "Sports",
        url: "/feed/sports",
        icon: SportsIcon,
    },
    {
        title: "Learning",
        url: "/feed/learning",
        icon: LearningIcon,
    },


];

export const ExploreSection = () => {
    return (        <SidebarGroup className="py-0">
            <SidebarGroupContent>
                <SidebarGroupLabel className="px-3 py-2 text-sm font-medium text-gray-900 group-data-[state=collapsed]:hidden">Explore</SidebarGroupLabel>
                <SidebarMenu className="space-y-0">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={false} // TODO: Change to look at current pathname
                                className="h-10 px-2 rounded-lg hover:bg-gray-100 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center"
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
}
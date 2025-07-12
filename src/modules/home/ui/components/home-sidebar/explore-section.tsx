"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { GaminIcon, LearningIcon, LiveIcon, MusicIcon, NewsIcon, SportsIcon, TrendingIcon } from "@/components/youtube-icons";
import Link from "next/link";
import { t } from "@/lib/i18n";

const items = [
    {
        title: t("sidebar.trending"),
        url: "/feed/trending",
        icon: TrendingIcon,
    },
    {
        title: t("sidebar.music"),
        url: "/channels/music",
        icon: MusicIcon,
    },
    {
        title: t("sidebar.live"),
        url: "/channels/live",
        icon: LiveIcon,
    },
    {
        title: t("sidebar.gaming"),
        url: "/feed/gaming",
        icon: GaminIcon,
    },
    {
        title: t("sidebar.news"),
        url: "/feed/news",
        icon: NewsIcon,
    },
    {
        title: t("sidebar.sports"),
        url: "/feed/sports",
        icon: SportsIcon,
    },
    {
        title: t("sidebar.learning"),
        url: "/feed/learning",
        icon: LearningIcon,
    },
];


export const ExploreSection = () => {
    return (        <SidebarGroup className="py-0">
            <SidebarGroupContent>
                <SidebarGroupLabel className="px-3 py-2 text-sm font-medium text-foreground group-data-[state=collapsed]:hidden">{t('sidebar.explore')}</SidebarGroupLabel>
                <SidebarMenu className="space-y-0">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={false}
                                className="h-10 px-2 rounded-lg hover:bg-muted group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center"
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
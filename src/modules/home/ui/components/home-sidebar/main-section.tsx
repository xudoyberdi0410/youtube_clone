"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HomeIcon, ShortsIcon, SubscriptionsIcon } from "@/components/youtube-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    {
        title: "Home",
        url: "/",
        icon: HomeIcon
    },
    {
        title: "Shorts",
        url: "/shorts",
        icon: ShortsIcon
    },
    {
        title: "Subscriptions",
        url: "/feed/subscriptions",
        icon: SubscriptionsIcon,
        auth: true, // Only show if user is authenticated
    },
];

export const MainSection = () => {
    const pathname = usePathname();

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
}
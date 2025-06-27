"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon, UserCircleIcon } from "@/components/youtube-icons";
import Link from "next/link";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";

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
];

export const PersonalSection = () => {
    const { isLoggedIn, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <SidebarGroup className="py-0">
                <SidebarGroupContent>
                    <div className="animate-pulse space-y-2">
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
                        <SidebarMenuItem key={item.title}>                            <SidebarMenuButton
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
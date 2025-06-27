"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "../home-sidebar/main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "../home-sidebar/personal-section";
import { ExploreSection } from "../home-sidebar/explore-section";

export const WatchSidebar = () => {
    return (
        <Sidebar 
            className="pt-16 z-40 border-r border-gray-200" 
            collapsible="offcanvas" 
            variant="sidebar"
        >
            <SidebarContent className="bg-white px-1 py-2 overflow-y-auto data-[state=collapsed]:px-2">
                <MainSection />
                <Separator className="my-3 bg-gray-200" />
                <PersonalSection />
                <Separator className="my-3 bg-gray-200" />
                <ExploreSection />
            </SidebarContent>
        </Sidebar>
    );
}

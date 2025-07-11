"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "../home-sidebar/main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "../home-sidebar/personal-section";

export const WatchSidebar = () => {
    return (
        <Sidebar 
            className="pt-16 z-40 border-r border-border" 
            collapsible="offcanvas" 
            variant="sidebar"
        >
            <SidebarContent className="bg-background px-1 py-2 overflow-y-auto data-[state=collapsed]:px-2">
                <MainSection />
                <Separator className="my-3 bg-muted" />
                <PersonalSection />
            </SidebarContent>
        </Sidebar>
    );
}

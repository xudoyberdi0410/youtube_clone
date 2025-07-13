"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "../home-sidebar/main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "../home-sidebar/personal-section";
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export const WatchSidebar = () => {
    return (
        <Sidebar 
            className="pt-16 z-40 border-r border-border" 
            collapsible="offcanvas" 
            variant="sidebar"
        >
            <SidebarContent className="bg-background px-1 py-2 overflow-y-auto data-[state=collapsed]:px-2 flex flex-col h-full">
                <MainSection />
                <Separator className="my-3 bg-muted" />
                <PersonalSection />
                <div className="mt-auto flex flex-col gap-2 p-2">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                </div>
            </SidebarContent>
        </Sidebar>
    );
}

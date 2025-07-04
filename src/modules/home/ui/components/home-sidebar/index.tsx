"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { useEffect, useState } from "react";

export const HomeSidebar = () => {
    const { setOpen, open } = useSidebar();
    const [isManuallyToggled, setIsManuallyToggled] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // Если пользователь вручную не переключал, автоматически управляем состоянием
            if (!isManuallyToggled) {
                const shouldOpen = window.innerWidth >= 1200;
                setOpen(shouldOpen);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, [setOpen, isManuallyToggled]);

    // Слушаем изменения состояния сайдбара (от кнопки бургера)
    useEffect(() => {
        if (open !== undefined) {
            setIsManuallyToggled(true);
            // Сбрасываем флаг через некоторое время, чтобы снова работал авто-режим
            const timer = setTimeout(() => {
                setIsManuallyToggled(false);
            }, 5000); // 5 секунд
            
            return () => clearTimeout(timer);
        }
    }, [open]);return (
        <Sidebar 
            className="pt-16 z-40 border-r border-gray-200 hidden lg:flex" 
            collapsible="icon" 
            variant="sidebar"
        >
            <SidebarContent className="bg-white px-1 py-2 overflow-y-auto data-[state=collapsed]:px-2">
                <MainSection />
                <Separator className="my-3 bg-gray-200" />
                <PersonalSection />
            </SidebarContent>
        </Sidebar>
    );
}
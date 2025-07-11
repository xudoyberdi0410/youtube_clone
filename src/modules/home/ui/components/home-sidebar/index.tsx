"use client";

import { Sidebar, SidebarContent, useSidebar, SidebarFooter } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { useEffect, useState } from "react";
import { Settings, Languages, Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { t } from "@/lib/i18n";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export const HomeSidebar = () => {
    const { setOpen, open, state } = useSidebar();
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
    }, [open]);

    // FIX: Add return statement for JSX
    return (
        <Sidebar 
            className="pt-16 z-40 border-r border-border hidden lg:flex" 
            collapsible="icon" 
            variant="sidebar"
        >
            <SidebarContent className="bg-background px-1 py-2 overflow-y-auto data-[state=collapsed]:px-2">
                <MainSection />
                <Separator className="my-3 bg-gray-200" />
                <PersonalSection />
            </SidebarContent>
            {/* Settings dropdown at the bottom */}
            <SidebarFooter className="bg-background border-t border-border flex justify-center">
                <DropdownMenu>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                          <Settings className="w-5 h-5" />
                          {state !== "collapsed" && (
                            <span className="text-sm font-normal">{t("sidebar.websiteSettings")}</span>
                          )}
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    {state === "collapsed" && (
                      <TooltipContent side="right" align="center">
                        {t("sidebar.websiteSettings")}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* Language Switcher */}
                    <DropdownMenuItem asChild>
                      <div className="flex flex-col w-full">
                        <span className="text-xs font-semibold mb-1 flex items-center gap-2"><Languages className="w-4 h-4" /> {t("sidebar.language")}</span>
                        <SidebarLanguageSwitcher />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Theme Switcher */}
                    <DropdownMenuItem asChild>
                      <div className="flex flex-col w-full">
                        <span className="text-xs font-semibold mb-1 flex items-center gap-2"><Sun className="w-4 h-4" /> {t("sidebar.theme")}</span>
                        <SidebarThemeSwitcher />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

// SidebarLanguageSwitcher component
function SidebarLanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(storedLanguage);
  }, []);
  const languages = [
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
    { code: "ru", name: t("language.russian"), flag: "🇷🇺" },
    { code: "uz", name: t("language.uzbek"), flag: "🇺🇿" },
  ];
  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem("language", code);
    document.documentElement.lang = code;
    window.location.reload();
  };
  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`px-2 py-1 rounded text-xs border ${currentLanguage === lang.code ? 'bg-primary/10 border-primary font-bold' : 'bg-muted border-border'}`}
          onClick={() => handleLanguageChange(lang.code)}
        >
          <span className="mr-1">{lang.flag}</span>{lang.name}
        </button>
      ))}
    </div>
  );
}

// SidebarThemeSwitcher component
function SidebarThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light", label: t("sidebar.themeLight"), icon: Sun },
    { value: "dark", label: t("sidebar.themeDark"), icon: Moon },
    { value: "system", label: t("sidebar.themeSystem"), icon: Monitor },
  ];
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${theme === opt.value ? 'bg-primary/10 border-primary font-bold' : 'bg-muted border-border'}`}
          onClick={() => setTheme(opt.value)}
        >
          <opt.icon className="w-4 h-4" /> {opt.label}
        </button>
      ))}
    </div>
  );
}
"use client";

import { Sidebar, SidebarContent, useSidebar, SidebarFooter } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { useEffect, useState } from "react";
import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { t } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";

export const HomeSidebar = () => {
    const { state } = useSidebar();
    const [showSettings, setShowSettings] = useState(false);

    // Закрытие панели при клике вне её
    useEffect(() => {
        if (!showSettings) return;
        const handleClick = (e: MouseEvent) => {
            const settingsPanel = document.getElementById("sidebar-settings-panel");
            const settingsBtn = document.getElementById("sidebar-settings-btn");
            if (
                settingsPanel &&
                !settingsPanel.contains(e.target as Node) &&
                settingsBtn &&
                !settingsBtn.contains(e.target as Node)
            ) {
                setShowSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showSettings]);

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
            <SidebarFooter className="bg-background border-t border-border flex flex-col items-center relative">
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      id="sidebar-settings-panel"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className={
                        "absolute bottom-14 z-10 pb-2 " +
                        (state === "collapsed"
                          ? "left-12 w-64"
                          : "left-0 w-full px-4")
                      }
                    >
                      <div className="rounded-xl shadow-xl border border-border bg-popover p-4 flex flex-col gap-4 justify-center items-center">
                        <SidebarLanguageSwitcherButton />
                        <SidebarThemeSwitcherButton />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  id="sidebar-settings-btn"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
                  onClick={() => setShowSettings(v => !v)}
                  aria-label={t("sidebar.websiteSettings")}
                >
                  <Settings className="w-5 h-5" />
                  {state !== "collapsed" && (
                    <span className="text-sm font-normal">{t("sidebar.websiteSettings")}</span>
                  )}
                </button>
            </SidebarFooter>
        </Sidebar>
    );
}

// SidebarLanguageSwitcher component
function SidebarLanguageSwitcherButton() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(storedLanguage);
  }, []);
  const languages = [
    { code: "en", icon: "🇺🇸" },
    { code: "ru", icon: "🇷🇺" },
    { code: "uz", icon: "🇺🇿" },
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
          className={`flex items-center justify-center w-10 h-10 rounded-full border text-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            ${currentLanguage === lang.code ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'}`}
          onClick={() => handleLanguageChange(lang.code)}
          aria-label={lang.code}
        >
          <span>{lang.icon}</span>
        </button>
      ))}
    </div>
  );
}

// SidebarThemeSwitcher component
function SidebarThemeSwitcherButton() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light", icon: <Sun className="w-5 h-5" />, label: "" },
    { value: "dark", icon: <Moon className="w-5 h-5" />, label: "" },
    { value: "system", icon: <Monitor className="w-5 h-5" />, label: "" },
  ];
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            ${theme === opt.value ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'}`}
          onClick={() => setTheme(opt.value)}
          aria-label={opt.value}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
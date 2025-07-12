"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Video, 
  Upload, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { t, setLanguage, getCurrentLanguage } from "@/lib/i18n";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: t('studio.dashboard'), href: '/studio/dashboard', icon: BarChart3 },
  { name: t('studio.videos'), href: '/studio/videos', icon: Video },
  { name: t('studio.upload'), href: '/studio/upload', icon: Upload },
  { name: t('studio.comments'), href: '/studio/comments', icon: MessageSquare },
  { name: t('studio.analytics'), href: '/studio/analytics', icon: TrendingUp },
  { name: t('studio.channel'), href: '/studio/channel', icon: Settings },
];

export function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = (language: "en" | "ru" | "uz") => {
    setLanguage(language);
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background border-r">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h1 className="text-lg font-semibold">{t('studio.title')}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile Theme and Language Controls */}
          <div className="p-4 border-t">
            <div className="space-y-3">
              {/* Language Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('studio.language')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Globe className="h-3 w-3 mr-1" />
                      {currentLanguage.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("ru")}>
                      Русский
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("uz")}>
                      O&apos;zbek
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Theme Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('studio.theme')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      {theme === "light" ? (
                        <Sun className="h-3 w-3 mr-1" />
                      ) : theme === "dark" ? (
                        <Moon className="h-3 w-3 mr-1" />
                      ) : (
                        <Monitor className="h-3 w-3 mr-1" />
                      )}
                      {theme === "light" ? t('studio.theme.light') : theme === "dark" ? t('studio.theme.dark') : t('studio.theme.system')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}> 
                      <Sun className="h-3 w-3 mr-2" />
                      {t('studio.theme.light')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}> 
                      <Moon className="h-3 w-3 mr-2" />
                      {t('studio.theme.dark')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}> 
                      <Monitor className="h-3 w-3 mr-2" />
                      {t('studio.theme.system')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-semibold">{t('studio.title')}</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
          
          {/* Desktop Theme and Language Controls */}
          <div className="border-t pt-4">
            <div className="space-y-3">
              {/* Language Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('studio.language')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Globe className="h-3 w-3 mr-1" />
                      {currentLanguage.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("ru")}>
                      Русский
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange("uz")}>
                      O&apos;zbek
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Theme Switcher */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t('studio.theme')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      {theme === "light" ? (
                        <Sun className="h-3 w-3 mr-1" />
                      ) : theme === "dark" ? (
                        <Moon className="h-3 w-3 mr-1" />
                      ) : (
                        <Monitor className="h-3 w-3 mr-1" />
                      )}
                      {theme === "light" ? t('studio.theme.light') : theme === "dark" ? t('studio.theme.dark') : t('studio.theme.system')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}> 
                      <Sun className="h-3 w-3 mr-2" />
                      {t('studio.theme.light')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}> 
                      <Moon className="h-3 w-3 mr-2" />
                      {t('studio.theme.dark')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}> 
                      <Monitor className="h-3 w-3 mr-2" />
                      {t('studio.theme.system')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-6 w-px" />
          <h1 className="text-lg font-semibold">{t('studio.title')}</h1>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
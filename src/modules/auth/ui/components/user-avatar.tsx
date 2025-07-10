"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { logout, getAvatarUrl } from "../../lib/auth-utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@/types/auth";
import { t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

interface UserAvatarProps {
  user?: Partial<User> & { email: string };
}

export function UserAvatar({ user }: UserAvatarProps) {
  const router = useRouter();
  const [cacheBuster, setCacheBuster] = useState("");

  // Добавляем cache-busting только после монтирования компонента
  useEffect(() => {
    setCacheBuster(`?t=${Date.now()}`);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSettings = () => {
    router.push("/settings");
  };
  const displayName = user?.name || user?.username || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Используем helper функцию для получения URL аватара
  const avatarUrl = user ? getAvatarUrl(user, cacheBuster) : undefined;

  console.log(
    "Avatar URL:",
    avatarUrl,
    "Original:",
    user?.avatar,
    "CacheBuster:",
    cacheBuster,
  ); // Отладка

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Информация о пользователе */}
        <div className="flex items-center justify-start gap-2 p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{displayName}</p>
            {user?.email && (
              <p className="w-[180px] truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Настройки */}
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("menu.settings")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Переключатель языка */}
        <div className="px-2 py-1">
          <LanguageSwitcher />
        </div>

        <DropdownMenuSeparator />

        {/* Выход */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("menu.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

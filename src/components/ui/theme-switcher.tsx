"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop2, Check } from "lucide-react";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop2 },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current = themes.find(t => (theme === "system" ? resolvedTheme : theme) === t.value) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2" aria-label="Switch theme">
          {current.icon && <current.icon className="w-4 h-4" />}
          <span className="hidden md:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {t.icon && <t.icon className="w-4 h-4" />}
            <span>{t.label}</span>
            {(theme === t.value || (theme === "system" && resolvedTheme === t.value)) && (
              <Check className="w-4 h-4 text-green-600 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
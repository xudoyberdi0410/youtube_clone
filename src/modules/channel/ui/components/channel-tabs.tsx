"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface ChannelTabsProps {
  activeTab: "home" | "videos" | "shorts" | "playlists" | "about";
  onTabChange: (
    tab: "home" | "videos" | "shorts" | "playlists" | "about",
  ) => void;
}

export function ChannelTabs({ activeTab, onTabChange }: ChannelTabsProps) {
  const tabs = [
    { id: "home" as const, label: t("channel.tabs.home") },
    { id: "videos" as const, label: t("channel.tabs.videos") },
    { id: "shorts" as const, label: t("channel.tabs.shorts") },
    { id: "playlists" as const, label: t("channel.tabs.playlists") },
    { id: "about" as const, label: t("channel.tabs.about") },
  ];
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-none border-b-2 border-transparent hover:bg-transparent",
            activeTab === tab.id
              ? "text-primary border-b-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

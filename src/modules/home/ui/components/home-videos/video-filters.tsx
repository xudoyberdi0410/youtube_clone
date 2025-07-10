"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { VideoCategory } from "@/types/api";

import { t } from "@/lib/i18n";

const filterCategories: Array<{ key: string; label: string; category?: VideoCategory }> = [
  { key: "all", label: t("category.all") },
  { key: "musiqa", label: t("category.music"), category: "Musiqa" },
  { key: "talim", label: t("category.education"), category: "Ta'lim" },
  { key: "texnologiya", label: t("category.technology"), category: "Texnologiya" },
  { key: "oyinlar", label: t("category.games"), category: "O'yinlar" },
  { key: "yangiliklar", label: t("category.news"), category: "Yangiliklar" },
  { key: "kongilochar", label: t("category.entertainment"), category: "Ko'ngilochar" },
  { key: "sport", label: t("category.sport"), category: "Sport" },
  { key: "ilm-fan", label: t("category.science"), category: "Ilm-fan va Tabiat" },
  { key: "sayohat", label: t("category.travel"), category: "Sayohat" },
  { key: "oshxona", label: t("category.cooking"), category: "Oshxona va Pazandachilik" },
  { key: "moda", label: t("category.beauty"), category: "Moda va Go'zallik" },
  { key: "biznes", label: t("category.business"), category: "Biznes" },
];

interface VideoFiltersProps {
  onCategoryChange?: (category?: VideoCategory) => void;
}

export function VideoFilters({ onCategoryChange }: VideoFiltersProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const handleFilterChange = (filterKey: string, category?: VideoCategory) => {
    setActiveFilter(filterKey);
    onCategoryChange?.(category);
  };
  return (
    <div className="w-full  bg-white sticky z-10">
      <div className="max-w-screen-2xl mx-auto px-4 py-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 md:gap-3">
            {filterCategories.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "secondary"}
                size="sm"
                onClick={() => handleFilterChange(filter.key, filter.category)}
                className={`
                  flex-shrink-0 rounded-lg px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all duration-200
                  ${activeFilter === filter.key 
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }
                `}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}

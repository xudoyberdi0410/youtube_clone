"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { VideoCategory } from "@/types/api";

const filterCategories: Array<{ key: string; label: string; category?: VideoCategory }> = [
  { key: "all", label: "All" },
  { key: "musiqa", label: "Музыка", category: "Musiqa" },
  { key: "talim", label: "Образование", category: "Ta'lim" },
  { key: "texnologiya", label: "Технологии", category: "Texnologiya" },
  { key: "oyinlar", label: "Игры", category: "O'yinlar" },
  { key: "yangiliklar", label: "Новости", category: "Yangiliklar" },
  { key: "kongilochar", label: "Развлечения", category: "Ko'ngilochar" },
  { key: "sport", label: "Спорт", category: "Sport" },
  { key: "ilm-fan", label: "Наука", category: "Ilm-fan va Tabiat" },
  { key: "sayohat", label: "Путешествия", category: "Sayohat" },
  { key: "oshxona", label: "Кулинария", category: "Oshxona va Pazandachilik" },
  { key: "moda", label: "Красота", category: "Moda va Go'zallik" },
  { key: "biznes", label: "Бизнес", category: "Biznes" },
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const filterCategories = [
  "All",
  "React",
  "JavaScript", 
  "TypeScript",
  "Next.js",
  "Web Development",
  "Programming",
  "Tutorial",
  "Frontend",
  "Backend",
  "CSS",
  "Node.js",
  "Python",
  "Machine Learning",
  "Data Science",
  "UI/UX",
  "Design",
  "DevOps",
  "Docker",
  "AWS"
];

export function VideoFilters() {
  const [activeFilter, setActiveFilter] = useState("All");
  return (
    <div className="w-full  bg-white sticky z-10">
      <div className="max-w-screen-2xl mx-auto px-4 py-2">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 md:gap-3">
            {filterCategories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveFilter(category)}
                className={`
                  flex-shrink-0 rounded-lg px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium transition-all duration-200
                  ${activeFilter === category 
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}

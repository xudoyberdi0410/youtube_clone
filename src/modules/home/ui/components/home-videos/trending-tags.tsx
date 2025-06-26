"use client";

import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Trophy } from "lucide-react";

const trendingTags = [
  { name: "Trending", icon: TrendingUp, count: "25M+" },
  { name: "New", icon: Clock, count: "5.2M+" },
  { name: "Popular", icon: Trophy, count: "12M+" }
];

export function TrendingTags() {
  return (
    <div className="w-full border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">What's trending</h2>
          <div className="flex gap-3">
            {trendingTags.map(({ name, icon: Icon, count }) => (
              <Badge 
                key={name}
                variant="secondary" 
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Play, Users, Eye, Clock } from "lucide-react";

const stats = [
  { label: "Videos", value: "2M+", icon: Play, color: "text-red-600" },
  { label: "Creators", value: "500K+", icon: Users, color: "text-blue-600" },
  { label: "Views Today", value: "50M+", icon: Eye, color: "text-green-600" },
  { label: "Watch Time", value: "2B hrs", icon: Clock, color: "text-purple-600" }
];

export function PlatformStats() {
  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`p-2 rounded-lg bg-white/10 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{value}</div>
              <div className="text-sm text-gray-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

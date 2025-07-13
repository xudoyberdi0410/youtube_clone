"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SearchPageContent } from "@/modules/home/ui/components/search/SearchPageContent";
import { Suspense } from "react";

const mockResults = [
  {
    id: "1",
    title: "Mock Video 1",
    description: "This is a mock video result.",
    views: 12345,
    channel: {
      id: "c1",
      name: "Mock Channel 1",
      avatarUrl: "/api/placeholder/48/48",
      isVerified: true,
    },
    preview: "/api/placeholder/320/180",
    duration: "12:34",
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Mock Video 2",
    description: "Another mock video result.",
    views: 67890,
    channel: {
      id: "c2",
      name: "Mock Channel 2",
      avatarUrl: "/api/placeholder/48/48",
      isVerified: false,
    },
    preview: "/api/placeholder/320/180",
    duration: "8:20",
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Mock Video 3",
    description: "Yet another mock video result.",
    views: 54321,
    channel: {
      id: "c3",
      name: "Mock Channel 3",
      avatarUrl: "/api/placeholder/48/48",
      isVerified: true,
    },
    preview: "/api/placeholder/320/180",
    duration: "5:10",
    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContentWrapper />
    </Suspense>
  );
}

function SearchPageContentWrapper() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  return <SearchPageContent query={query} videos={mockResults} />;
}
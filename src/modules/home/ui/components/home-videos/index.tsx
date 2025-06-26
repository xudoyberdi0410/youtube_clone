"use client"; // обязательно, чтобы можно было использовать useState/useEffect

import { useState, useEffect } from "react";
import { VideoCardSkelton } from "./video-card-skelton";
import { VideoCard } from "./video-card"; // ты создашь позже
import { VideoFilters } from "./video-filters";
import type { Video } from "@/types/video";



const mockVideos: Video[] = [
    { 
        id: "1",
        title: "Build Your Own Lovable Clone - Full Stack Agentic AI Website Builder with Inngest & Nextjs 15",
        views: 1800,
        duration: "10:34:06",
        uploadedAt: "1 hour ago",
        channel: {
            id: "c1",
            name: "Code With Antonio",
            avatarUrl: "/avatars/channel_photo1.png",
            isVerified: true,
            subscriberCount: "285K"
        },
        preview: "/previews/previews1.png"
    },
    { 
        id: "2", 
        title: "React 19 New Features - Complete Guide for 2024", 
        views: 45200, 
        duration: "28:15",
        uploadedAt: "3 days ago",
        channel: { 
            id: "c2", 
            name: "JavaScript Mastery", 
            avatarUrl: "/avatars/channel_photo2.png",
            isVerified: true,
            subscriberCount: "1.2M"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "3", 
        title: "NextJS 15 Complete Tutorial - Build Modern Web Apps", 
        views: 32800, 
        duration: "1:45:30",
        uploadedAt: "1 week ago",
        channel: { 
            id: "c3", 
            name: "WebDev Simplified", 
            avatarUrl: "/avatars/channel_photo1.png",
            isVerified: false,
            subscriberCount: "890K"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "4", 
        title: "TypeScript Advanced Patterns You Must Know", 
        views: 67500, 
        duration: "42:18",
        uploadedAt: "2 days ago",
        channel: { 
            id: "c4", 
            name: "Matt Pocock", 
            avatarUrl: "/avatars/channel_photo2.png",
            isVerified: true,
            subscriberCount: "567K"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "5", 
        title: "CSS Grid vs Flexbox - When to Use Which?", 
        views: 28400, 
        duration: "15:42",
        uploadedAt: "5 days ago",
        channel: { 
            id: "c5", 
            name: "Kevin Powell", 
            avatarUrl: "/avatars/channel_photo1.png",
            isVerified: true,
            subscriberCount: "743K"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "6", 
        title: "Building a Real-time Chat App with Socket.io", 
        views: 19600, 
        duration: "2:15:30",
        uploadedAt: "4 days ago",
        channel: { 
            id: "c6", 
            name: "Traversy Media", 
            avatarUrl: "/avatars/channel_photo2.png",
            isVerified: true,
            subscriberCount: "2.1M"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "7", 
        title: "Docker Complete Guide - Containerize Your Apps", 
        views: 52300, 
        duration: "3:25:15",
        uploadedAt: "1 week ago",
        channel: { 
            id: "c7", 
            name: "TechWorld with Nana", 
            avatarUrl: "/avatars/channel_photo1.png",
            isVerified: true,
            subscriberCount: "1.8M"
        },
        preview: "/previews/previews1.png" 
    },
    { 
        id: "8", 
        title: "Machine Learning with Python - Beginner to Pro", 
        views: 125000, 
        duration: "4:12:45",
        uploadedAt: "2 weeks ago",
        channel: { 
            id: "c8", 
            name: "Programming with Mosh", 
            avatarUrl: "/avatars/channel_photo2.png",
            isVerified: true,
            subscriberCount: "3.2M"
        },
        preview: "/previews/previews1.png" 
    },
];

export default function HomeVideos() {
    const [isLoading, setIsLoading] = useState(true);
    const [videos, setVideos] = useState<Video[]>([]);    useEffect(() => {
        // имитируем загрузку
        const timeout = setTimeout(() => {
            setVideos(mockVideos);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);    return (
        <div className="w-full">
            <VideoFilters />            <div className="w-full max-w-screen-2xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {
                    isLoading
                        ? Array.from({ length: 12 }).map((_, i) => <VideoCardSkelton key={i} />)
                        : videos.map((video) => (<VideoCard {...video} key={video.id} />))
                    }
                </div>
            </div>
        </div>
    );
}

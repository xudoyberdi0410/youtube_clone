"use client";
import Image from "next/image";
import { t } from "@/lib/i18n";

interface Channel {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified?: boolean;
}

interface SearchResultCardProps {
  id: string;
  title: string;
  description: string;
  views: number;
  channel: Channel;
  preview: string;
  duration: string;
  uploadedAt: string;
}

function formatViews(views: number) {
  if (views > 1_000_000) return (views / 1_000_000).toFixed(1) + 'M';
  if (views > 1_000) return (views / 1_000).toFixed(1) + 'K';
  return views;
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function SearchResultCard(props: SearchResultCardProps) {
  return (
    <a
      href={`/watch?v=${props.id}`}
      className="flex flex-row gap-4 group hover:bg-gray-50 rounded-xl px-2 py-2 transition min-h-[110px]"
    >
      <div className="relative w-48 h-28 sm:w-60 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
        <Image
          src={props.preview}
          alt={props.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
          {props.duration}
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center pr-2">
        <h2 className="text-base font-semibold leading-tight group-hover:text-blue-600 line-clamp-2">{props.title}</h2>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{t('video.views', { count: formatViews(props.views) })}</span>
          <span>•</span>
          <span>{formatDate(props.uploadedAt)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Image
            src={props.channel.avatarUrl}
            alt={props.channel.name}
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <span className="font-medium text-gray-800 text-xs">{props.channel.name}</span>
          {props.channel.isVerified && (
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" /></svg>
          )}
        </div>
        <p className="text-gray-700 text-xs mt-2 line-clamp-2 max-w-full">{props.description}</p>
      </div>
    </a>
  );
} 
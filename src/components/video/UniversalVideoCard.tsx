"use client";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { formatVideoDuration, formatRelativeTimeIntl } from '@/lib/utils/format';
import { getCurrentLanguage } from '@/lib/i18n';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export interface UniversalVideoCardProps {
  id: string | number;
  title: string;
  description?: string;
  views?: number;
  channel?: {
    id?: string | number;
    name: string;
    avatarUrl?: string;
    isVerified?: boolean;
    link?: string;
  };
  preview: string;
  duration?: string;
  uploadedAt?: string;
  showMenu?: boolean;
  menuItems?: Array<{ label: string; onClick?: () => void; href?: string }>;
  onDelete?: () => void;
  showDelete?: boolean;
  deleteLabel?: string;
  className?: string;
}

export function UniversalVideoCard({
  id,
  title,
  description,
  views,
  channel,
  preview,
  duration,
  uploadedAt,
  showMenu = false,
  menuItems = [],
  onDelete,
  showDelete = false,
  deleteLabel,
  className = "",
}: UniversalVideoCardProps) {
  return (
    <div className={`flex flex-col sm:flex-row w-full rounded-2xl bg-card hover:bg-accent transition shadow group overflow-hidden ${className}`}>
      {/* Превью */}
      <Link
        href={typeof id === 'number' ? `/watch?v=${id}` : `/watch?v=${encodeURIComponent(id)}`}
        className="relative w-full aspect-video sm:w-64 sm:h-36 md:w-80 md:h-44 flex-shrink-0 bg-muted block"
        tabIndex={-1}
      >
        <Image
          src={preview}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
        {duration && (
          <span className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded font-semibold">
            {formatVideoDuration(duration)}
          </span>
        )}
      </Link>
      {/* Информация */}
      <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0 relative">
        {/* Меню */}
        {showMenu && menuItems.length > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-muted transition text-muted-foreground">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.map((item, idx) => (
                  <DropdownMenuItem key={idx} asChild={!!item.href} onClick={item.onClick}>
                    {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {/* Кнопка удаления */}
        {showDelete && onDelete && (
          <button
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-destructive/10 text-destructive transition z-10"
            onClick={onDelete}
            title={deleteLabel || t('history.delete')}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
        <Link href={typeof id === 'number' ? `/watch?v=${id}` : `/watch?v=${encodeURIComponent(id)}`} className="block">
          <h3 className="text-lg md:text-xl font-bold leading-tight group-hover:text-primary line-clamp-2 text-foreground mb-2 pr-10 sm:pr-0">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {typeof views === 'number' && <span>{views.toLocaleString()} {t('video.views')}</span>}
          {typeof views === 'number' && uploadedAt && <span>•</span>}
          {uploadedAt && <span>{formatRelativeTimeIntl(uploadedAt, getCurrentLanguage())}</span>}
        </div>
        {channel && (
          <Link href={channel.link || `/channel?name=${encodeURIComponent(channel.name)}`} className="flex items-center gap-2 hover:underline mb-2 w-fit">
            <Avatar className="w-7 h-7">
              {channel.avatarUrl ? (
                <AvatarImage src={channel.avatarUrl} alt={channel.name} />
              ) : (
                <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium text-sm text-foreground">{channel.name}</span>
          </Link>
        )}
        {description && (
          <p className="text-sm line-clamp-2 max-w-full text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 
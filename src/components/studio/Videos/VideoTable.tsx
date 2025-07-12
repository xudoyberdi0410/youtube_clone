"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2, Search } from "lucide-react";
import { t } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: 'draft' | 'published' | 'processing';
  views: number;
  likes: number;
  uploadedAt: string;
  visibility: 'public' | 'unlisted' | 'private';
}

interface VideoTableProps {
  videos: Video[];
}

export function VideoTable({ videos }: VideoTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'unlisted':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'private':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
          <svg
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">{t('studio.noVideos')}</h3>
        <p className="text-muted-foreground mb-4">
          {t('studio.upload.getStartedByUploading')}
        </p>
        <Button asChild>
          <Link href="/studio/upload">{t('studio.addVideo')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('studio.searchVideos')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('studio.filterAll')}</SelectItem>
            <SelectItem value="draft">{t('studio.filterDraft')}</SelectItem>
            <SelectItem value="published">{t('studio.filterPublished')}</SelectItem>
            <SelectItem value="processing">{t('studio.filterProcessing')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video) => (
              <TableRow key={video.id || video.video_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={80}
                        height={48}
                        className="w-20 h-12 object-cover rounded"
                      />
                      {video.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(video.status)}>
                    {t(`studio.videoStatus.${video.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getVisibilityColor(video.visibility)}>
                    {t(`studio.visibility.${video.visibility}`)}
                  </Badge>
                </TableCell>
                <TableCell>{video.views.toLocaleString()}</TableCell>
                <TableCell>{video.likes.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(video.uploadedAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/studio/videos/${video.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {video.status === 'published' && (
                        <DropdownMenuItem asChild>
                          <Link href={`/watch?v=${video.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredVideos.length === 0 && videos.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('studio.upload.noVideosMatchSearch')}
        </div>
      )}
    </div>
  );
} 
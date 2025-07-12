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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Reply, EyeOff, Check, Trash2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  videoTitle: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  status: 'new' | 'hidden' | 'approved';
  createdAt: string;
  likes: number;
  replies: number;
}

interface CommentsTableProps {
  comments: Comment[];
}

export function CommentsTable({ comments }: CommentsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'hidden':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredComments = comments.filter((comment) => {
    return statusFilter === "all" || comment.status === statusFilter;
  });

  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId);
  };

  const handleApprove = (commentId: string) => {
    console.log('Approve comment:', commentId);
  };

  const handleHide = (commentId: string) => {
    console.log('Hide comment:', commentId);
  };

  const handleDelete = (commentId: string) => {
    console.log('Delete comment:', commentId);
  };

  if (comments.length === 0) {
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">{t('studio.noComments')}</h3>
        <p className="text-muted-foreground">
          {t('studio.comments.noCommentsYet')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('studio.comments.allComments')}</SelectItem>
            <SelectItem value="new">{t('studio.comments.new')}</SelectItem>
            <SelectItem value="hidden">{t('studio.comments.hidden')}</SelectItem>
            <SelectItem value="approved">{t('studio.comments.approved')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>
                        {comment.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.likes} likes • {comment.replies} replies
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{comment.text}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {comment.videoTitle}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(comment.status)}>
                    {t(`studio.comments.status.${comment.status}`)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleReply(comment.id)}>
                        <Reply className="h-4 w-4 mr-2" />
                        {t('studio.comments.reply')}
                      </DropdownMenuItem>
                      {comment.status === 'new' && (
                        <DropdownMenuItem onClick={() => handleApprove(comment.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          {t('studio.comments.approve')}
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'hidden' && (
                        <DropdownMenuItem onClick={() => handleHide(comment.id)}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          {t('studio.comments.hide')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('studio.comments.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredComments.length === 0 && comments.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('studio.comments.noCommentsMatchFilter')}
        </div>
      )}
    </div>
  );
} 
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Reply } from "lucide-react";
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
}

interface RecentCommentsProps {
  comments: Comment[];
}

export function RecentComments({ comments }: RecentCommentsProps) {
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

  if (comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('studio.recentComments')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('studio.noComments')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('studio.recentComments')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>
                  {comment.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(comment.status)}
                  >
                    {t(`studio.comments.status.${comment.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                  {comment.videoTitle}
                </p>
                <p className="text-sm mb-2 line-clamp-2">{comment.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Reply className="h-3 w-3 mr-1" />
                    {t('studio.comments.reply')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
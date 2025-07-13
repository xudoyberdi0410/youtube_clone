"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { t } from "@/lib/i18n";

interface AnalyticsCardsProps {
  views: number;
  watchTime: number;
  subscribers: number;
  ctr: number;
}

export function AnalyticsCards({ views, watchTime, subscribers, ctr }: AnalyticsCardsProps) {
  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('studio.stats.views')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{views.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+12%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('studio.stats.watchTime')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatWatchTime(watchTime)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+8%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('studio.stats.subscribers')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscribers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+15%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('studio.stats.ctr')}
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ctr}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">-2%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 
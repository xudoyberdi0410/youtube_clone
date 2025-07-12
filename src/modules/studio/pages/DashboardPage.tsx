"use client";
import { StatsCard } from "@/components/studio/Dashboard/StatsCard";
import { ViewsChart } from "@/components/studio/Dashboard/ViewsChart";
import { RecentComments } from "@/components/studio/Dashboard/RecentComments";
import { RecentUploads } from "@/components/studio/Dashboard/RecentUploads";
import { mockDashboardStats, mockAnalytics, mockComments, mockVideos } from "@/lib/mock/studio-data";
import { t } from "@/lib/i18n";
import { 
  Eye, 
  Heart, 
  Users, 
  Video, 
  Clock, 
  TrendingUp 
} from "lucide-react";

export function DashboardPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your channel performance and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('studio.stats.views')}
          value={mockDashboardStats.totalViews.toLocaleString()}
          change={12}
          changeLabel="last month"
          icon={<Eye className="h-4 w-4" />}
        />
        <StatsCard
          title={t('studio.stats.likes')}
          value={mockDashboardStats.totalLikes.toLocaleString()}
          change={8}
          changeLabel="last month"
          icon={<Heart className="h-4 w-4" />}
        />
        <StatsCard
          title={t('studio.stats.subscribers')}
          value={mockDashboardStats.totalSubscribers.toLocaleString()}
          change={15}
          changeLabel="last month"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title={t('studio.stats.videos')}
          value={mockDashboardStats.totalVideos}
          icon={<Video className="h-4 w-4" />}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title={t('studio.stats.watchTime')}
          value={formatWatchTime(mockAnalytics.watchTime)}
          change={5}
          changeLabel="last month"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title={t('studio.stats.ctr')}
          value={`${mockAnalytics.ctr}%`}
          change={-2}
          changeLabel="last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViewsChart data={mockAnalytics.viewsByDay} />
        <div className="space-y-6">
          <RecentComments comments={mockComments} />
          <RecentUploads videos={mockVideos} />
        </div>
      </div>
    </div>
  );
} 
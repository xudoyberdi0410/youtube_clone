"use client";
import { useState } from "react";
import { AnalyticsCards } from "@/components/studio/Analytics/AnalyticsCards";
import { ViewsChart } from "@/components/studio/Dashboard/ViewsChart";
import { TrafficSources } from "@/components/studio/Analytics/TrafficSources";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnalytics } from "@/lib/mock/studio-data";
import { t } from "@/lib/i18n";

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('studio.analytics')}</h1>
          <p className="text-muted-foreground">
            Track your channel performance and audience insights.
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t('studio.analytics.last7Days')}</SelectItem>
            <SelectItem value="30">{t('studio.analytics.last30Days')}</SelectItem>
            <SelectItem value="90">{t('studio.analytics.last90Days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards
        views={mockAnalytics.views}
        watchTime={mockAnalytics.watchTime}
        subscribers={mockAnalytics.subscribers}
        ctr={mockAnalytics.ctr}
      />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ViewsChart data={mockAnalytics.viewsByDay} />
        <TrafficSources data={mockAnalytics.trafficSources} />
      </div>
    </div>
  );
} 
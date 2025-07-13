"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, changeLabel, icon }: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground">
            {isPositive && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
            {isNegative && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
            <span
              className={cn(
                "font-medium",
                isPositive && "text-green-500",
                isNegative && "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}{change}%
            </span>
            {changeLabel && (
              <span className="ml-1">vs {changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
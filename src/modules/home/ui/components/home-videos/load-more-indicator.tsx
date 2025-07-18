import { Loader2 } from "lucide-react"
import { t } from "@/lib/i18n"

interface LoadMoreIndicatorProps {
  isLoading: boolean
}

export function LoadMoreIndicator({ isLoading }: LoadMoreIndicatorProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t('home.loadingMore')}</span>
        </div>
      </div>
    )
  }

  return null
} 
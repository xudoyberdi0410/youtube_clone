// src/modules/home/ui/components/home-videos/empty-state.tsx

import { Video, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh?: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Video className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Видео не найдены
      </h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-md">
        В данной категории пока нет видео. Попробуйте выбрать другую категорию или обновите страницу.
      </p>
      
      {onRefresh && (
        <Button 
          onClick={onRefresh}
          className="gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          Обновить
        </Button>
      )}
    </div>
  );
}

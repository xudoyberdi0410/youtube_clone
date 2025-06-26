import { PlayCircle } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <PlayCircle className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No videos found
      </h3>
      <p className="text-gray-600 max-w-md">
        Try adjusting your search or browse different categories to discover amazing content.
      </p>
    </div>
  );
}

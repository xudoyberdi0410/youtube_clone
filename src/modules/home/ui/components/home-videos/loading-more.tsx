import { Loader2 } from "lucide-react";

export function LoadingMore() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading more videos...</span>
      </div>
    </div>
  );
}

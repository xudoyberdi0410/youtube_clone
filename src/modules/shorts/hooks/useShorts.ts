import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Shorts } from "@/types/api";
import { ShortVideo } from "../types";

// Utility function to safely extract error message
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  if (typeof err === "object" && err !== null) {
    // Try to extract message from various error formats
    const errorObj = err as Record<string, unknown>;

    if (errorObj.message && typeof errorObj.message === "string") {
      return errorObj.message;
    }

    if (errorObj.detail) {
      if (typeof errorObj.detail === "string") {
        return errorObj.detail;
      }
      return safeStringify(errorObj.detail);
    }

    if (errorObj.status) {
      return `HTTP ${errorObj.status}`;
    }

    // Try to stringify the object safely
    return safeStringify(err);
  }

  return "Unknown error occurred";
};

// Safe stringify with circular reference handling
const safeStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        // Simple circular reference detection
        if (value.constructor && value.constructor.name === "Object") {
          return value;
        }
        return "[Object]";
      }
      return value;
    });
  } catch {
    return (
      (obj as { toString?: () => string })?.toString?.() ||
      "Failed to serialize error"
    );
  }
};

export const useShorts = () => {
  const [shorts, setShorts] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API data to component format
  const transformShorts = (apiShorts: Shorts[]): ShortVideo[] => {
    return apiShorts.map((shorts) => ({
      id: shorts.id.toString(),
      title: shorts.title,
      description: shorts.description,
      video_url: shorts.video_url,
      thumbnail_url: shorts.thumbnail_url,
      views_count: shorts.views_count,
      likes_count: shorts.likes_count,
      dislikes_count: shorts.dislikes_count,
      created_at: shorts.created_at,
      channel: shorts.channel
        ? {
            id: shorts.channel.id.toString(),
            channel_name: shorts.channel.channel_name,
            profile_image_url: shorts.channel.profile_image_url,
            subscribers_count: shorts.channel.subscribers_count,
          }
        : undefined,
    }));
  };

  // Fetch shorts from API
  const fetchShorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getShorts();
      const transformedShorts = transformShorts(response);
      setShorts(transformedShorts);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error fetching shorts:", errorMsg, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh shorts
  const refreshShorts = () => {
    fetchShorts();
  };

  // Load on mount
  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  return {
    shorts,
    loading,
    error,
    refreshShorts,
  };
};

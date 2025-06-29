// src/components/ui/error-display.tsx

import React from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, X } from "lucide-react"

interface ErrorDisplayProps {
  error: string | null
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ErrorDisplay({ error, onRetry, onDismiss, className = "" }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-700">{error}</span>
        <div className="flex items-center gap-2 ml-4">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="h-8 px-2 text-red-700 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="h-8 px-2 text-red-700 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

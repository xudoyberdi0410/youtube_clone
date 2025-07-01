// src/app/feed/subscriptions/page.tsx

"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import { ApiClient } from '@/lib/api-client'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SubscriptionsIcon, VerifiedIcon } from '@/components/youtube-icons'
import { Users, Bell, BellOff, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { SubscriptionResponse } from '@/types/api'

export default function SubscriptionsPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const { subscriptions, isLoading, error, loadSubscriptions } = useSubscriptions()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleUnsubscribe = async (channelId: number) => {
    if (!window.confirm('Are you sure you want to unsubscribe?')) return
    
    try {
      const apiClient = ApiClient.getInstance()
      // Нужно использовать endpoint для отписки по channel ID
      // или найти способ получить subscription ID
      // Пока что просто перезагружаем список
      await loadSubscriptions()
    } catch (error: any) {
      console.error('Failed to unsubscribe:', error)
      const errorMessage = error?.message || 'Failed to unsubscribe. Please try again.'
      alert(errorMessage)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="text-center py-16">
          <SubscriptionsIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            Sign in to view your subscriptions
          </h2>
          <p className="text-gray-500 mb-6">
            Keep track of your favorite channels and never miss new content
          </p>
          <Button 
            onClick={() => setShowAuthDialog(true)}
            className="px-6 py-2"
          >
            Sign in
          </Button>
        </div>
        <AuthRequiredDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          title="Sign in to view subscriptions"
          description="You need to be signed in to view and manage your subscriptions."
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SubscriptionsIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={`skeleton-${i}`} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SubscriptionsIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={loadSubscriptions} variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SubscriptionsIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Subscriptions</h1>
        </div>
        
        <div className="text-center py-16">
          <SubscriptionsIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No subscriptions yet
          </h2>
          <p className="text-gray-500 mb-6">
            Subscribe to channels to see them here and get notified of new content
          </p>
          <Link href="/">
            <Button>Explore channels</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SubscriptionsIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <Badge variant="secondary" className="ml-2">
            {subscriptions.length} channel{subscriptions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subscriptions.map((subscription) => (
          <Card key={`subscription-${subscription.id}`} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage 
                    src={subscription.profile_image || undefined} 
                    alt={subscription.name}
                  />
                  <AvatarFallback>
                    {subscription.name?.[0]?.toUpperCase() || 'C'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-medium truncate">
                      {subscription.name}
                    </h3>
                    <VerifiedIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>
                      {subscription.subscription_amount?.toLocaleString() || '0'} subscribers
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/channel/${subscription.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUnsubscribe(subscription.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <BellOff className="w-4 h-4" />
                </Button>
              </div>
              
              <p className={cn("text-xs text-gray-500 mt-2", "line-clamp-2")}>
                Channel: @{subscription.username}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

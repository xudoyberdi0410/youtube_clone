// src/modules/feed/subscriptions/page.tsx

"use client"

import { useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useSubscriptions } from '@/hooks/use-subscriptions'
import { AuthRequiredDialog } from '@/components/auth/AuthRequiredDialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SubscriptionsIcon } from '@/components/youtube-icons'
import Link from 'next/link'
import { t } from '@/lib/i18n';
import { ApiClient } from '@/lib/api-client';

export default function SubscriptionsPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const { subscriptions, isLoading, error, loadSubscriptions } = useSubscriptions()
  const [showAuthDialog, setShowAuthDialog] = useState(true)

  const handleUnsubscribe = async (subscriptionId: number) => {
    if (!window.confirm(t('subscriptions.confirmUnsubscribe'))) return
    try {
      const apiClient = ApiClient.getInstance();
      await apiClient.unsubscribe(subscriptionId);
      await loadSubscriptions()
    } catch (error: unknown) {
      console.error('Failed to unsubscribe:', error)
      const errorMessage = error instanceof Error ? error.message : t('subscriptions.unsubscribeError')
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
      <AuthRequiredDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t('subscriptions.loadError')}
        </AlertDescription>
      </Alert>
    )
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {/* <BellOff className="w-12 h-12 mb-4 text-muted-foreground" /> */}
        <div className="text-lg font-semibold mb-2">{t('subscriptions.empty')}</div>
        <div className="text-muted-foreground mb-4">{t('subscriptions.emptyHint')}</div>
        <Link href="/feed">
          <Button variant="outline">{t('subscriptions.browseChannels')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <SubscriptionsIcon className="w-6 h-6" />
        {t('subscriptions.title')}
      </h1>
      <div className="grid gap-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="flex items-center gap-4 p-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={sub.channel_profile_image ? `/uploads/${sub.channel_profile_image}` : undefined} alt={sub.channel_name || 'Channel'} />
              <AvatarFallback>{sub.channel_name ? sub.channel_name[0] : '?'}</AvatarFallback>
            </Avatar>
            <CardContent className="flex-1 p-0">
              <div className="flex items-center gap-2">
                <Link href={`/channel/${sub.channel_name}`} className="font-semibold hover:underline">
                  {sub.channel_name || t('subscriptions.unknown')}
                </Link>
                <Badge variant="secondary" className="ml-2">{sub.channel_subscription_amount} {t('channel.subscribers')}</Badge>
              </div>
              <div className="text-muted-foreground text-sm">@{sub.username}</div>
            </CardContent>
            <Button variant="destructive" onClick={() => handleUnsubscribe(sub.id)} size="sm">
              {t('subscriptions.unsubscribe')}
            </Button>
            <Link href={`/channel/${sub.channel_name}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                {/* <ExternalLink className="w-4 h-4" /> */}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

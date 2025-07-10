'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings } from '@/modules/settings/hooks/use-settings'
import { AccountTab } from '@/modules/settings/ui/components/account-tab'
import { ChannelsTab } from '@/modules/settings/ui/components/channels-tab'
import { User, Video } from "lucide-react"
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { t } from '@/lib/i18n'

export const SettingsPage = () => {
  const { user, loading } = useSettings()
  const [activeTab, setActiveTab] = useState('account')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        </div>
        <p className="text-gray-600">{t('settings.description')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('settings.accountTab')}
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            {t('settings.channelsTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountTab />
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <ChannelsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

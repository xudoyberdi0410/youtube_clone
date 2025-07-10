'use client'

import { useEffect } from 'react'
import { HomeButton } from '@/components/ui/home-button'
import { ErrorPageProps } from '@/modules/error/types'
import { t } from '@/lib/i18n'

export const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('error.title')}</h1>
        <p className="text-gray-600 mb-8">
          {t('error.description')}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {t('error.retry')}
          </button>
          <HomeButton variant="outline" />
        </div>
      </div>
    </div>
  )
}

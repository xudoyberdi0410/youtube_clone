
import { HomeButton } from '@/components/ui/home-button'
import { t } from '@/lib/i18n'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{t('notFound.404')}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('notFound.title')}</h2>
        <p className="text-gray-600 mb-8">
          {t('notFound.description')}
        </p>
        <HomeButton variant="default" />
      </div>
    </div>
  )
}

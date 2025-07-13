
import { HomeButton } from '@/components/ui/home-button'
import { t } from '@/lib/i18n'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">{t('notFound.404')}</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">{t('notFound.title')}</h2>
        <p className="text-muted-foreground mb-8">
          {t('notFound.description')}
        </p>
        <HomeButton variant="default" />
      </div>
    </div>
  )
}

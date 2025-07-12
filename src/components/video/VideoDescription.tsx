"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatRelativeTimeIntl, formatFullDateIntl } from '@/lib/utils/format';
import { getCurrentLanguage } from '@/lib/i18n';

interface VideoDescriptionProps {
  description: string
  viewCount?: string
  publishDate?: string
  category?: string
  onSeek?: (seconds: number) => void
  maxPreviewLength?: number
}

// Утилита: конвертация timestamp → секунды
const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 2) {
    const [m, s] = parts
    return m * 60 + s
  }
  const [h, m, s] = parts
  return h * 3600 + m * 60 + s
}

// Регулярки вынесены в константы
const RE_TIMESTAMP = /^\d{1,2}:\d{2}(?::\d{2})?/
const RE_URL = /(https?:\/\/[^\s]+)/g
const RE_HEADER = /^[🔥🔗⏰#📱💻🎥→]/

export function VideoDescription({
  description,
  viewCount,
  publishDate,
  category,
  onSeek,
  maxPreviewLength = 150,
}: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Текст превью
  const previewText = useMemo(() => {
    if (description.length <= maxPreviewLength) {
      return description
    }
    const truncated = description.slice(0, maxPreviewLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return `${truncated.slice(0, lastSpace)}...`
  }, [description, maxPreviewLength])

  const shouldTruncate = description.length > maxPreviewLength

  // Парсим текст на параграфы и строки
  const blocks = useMemo(() => {
    return (isExpanded ? description : previewText)
      .split('\n\n')
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para, pi) => ({
        key: `para-${pi}`,
        lines: para
          .split('\n')
          .map((ln) => ln.trim())
          .filter(Boolean),
      }))
  }, [description, previewText, isExpanded])

  // Рендерим одну строку: разбиваем на слова, определяем токены
  const renderLine = useCallback(
    (line: string, li: number) => {
      const tokens = line.split(' ').filter(Boolean)
      return (
        <div key={`line-${li}`} className="mb-1 last:mb-0">
          {tokens.map((word, wi) => {
            // Timestamp
            if (RE_TIMESTAMP.test(word)) {
              const ts = word.match(RE_TIMESTAMP)![0]
              const rem = word.slice(ts.length)
              const sec = timestampToSeconds(ts)
              return (
                <React.Fragment key={wi}>
                  <button
                    onClick={() => onSeek?.(sec)}
                    className="text-blue-500 hover:underline px-1 py-0.5 rounded bg-secondary/20 hover:bg-secondary/40 transition"
                  >
                    {ts}
                  </button>
                  {rem}
                  {' '}
                </React.Fragment>
              )
            }

            // URL
            if (RE_URL.test(word)) {
              return (
                <a
                  key={wi}
                  href={word}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {word}
                </a>
              )
            }

            // Header emoji
            if (RE_HEADER.test(word)) {
              return (
                <span key={wi} className="font-semibold">
                  {word}{' '}
                </span>
              )
            }

            // Хэштег
            if (word.startsWith('#')) {
              return (
                <span key={wi} className="text-blue-500 hover:underline cursor-pointer">
                  {word}{' '}
                </span>
              )
            }

            // Обычный текст
            return (
              <span key={wi}>
                {word}{' '}
              </span>
            )
          })}
        </div>
      )
    },
    [onSeek]
  )

  return (
    <div className="bg-secondary/30 hover:bg-secondary/40 rounded-xl p-3 transition-colors">
      {/* Статистика */}
      {(viewCount || publishDate) && (
        <div className="flex items-center text-sm font-medium space-x-2 mb-2">
          {viewCount && <span>{viewCount} {t('video.views')}</span>}
          {viewCount && publishDate && <span>•</span>}
          {publishDate && (
            <span>
              {isExpanded
                ? formatFullDateIntl(publishDate, getCurrentLanguage())
                : formatRelativeTimeIntl(publishDate, getCurrentLanguage())}
            </span>
          )}
        </div>
      )}

      {/* Контент */}
      <div className="text-foreground text-sm leading-normal whitespace-pre-line">
        {blocks.map((para) => (
          <div key={para.key} className="mb-3 last:mb-0">
            {para.lines.map((ln, idx) => renderLine(ln, idx))}
          </div>
        ))}
        {isExpanded && category && (
          <div className="mt-2">
            <a
              href={`/search?category=${encodeURIComponent(category)}`}
              className="inline-block px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium"
            >
              #{category}
            </a>
          </div>
        )}
      </div>

      {/* Кнопка */}
      {shouldTruncate && (
        <div className="mt-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded((v) => !v)}
            className="p-0 font-medium text-sm"
          >
            {isExpanded ? (
              <>{t('video.hide')} <ChevronUp className="w-4 h-4 ml-1" /></>
            ) : (
              <>{t('video.showMore')} <ChevronDown className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

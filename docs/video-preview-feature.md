# Функциональность предварительного воспроизведения видео

## Обзор

Добавлена система предварительного воспроизведения видео при наведении на карточки видео с мгновенным переходом к воспроизведению при клике.

## Основные компоненты

### 1. Хуки

#### `useVideoPreview`
Хук для управления предварительным воспроизведением видео.

```typescript
const {
  videoRef,
  isPreviewing,
  handleMouseEnter,
  handleMouseLeave,
} = useVideoPreview({
  videoUrl,
  previewDelay: 500,
  autoPlay: true
});
```

**Параметры:**
- `videoUrl` - URL видео для предварительного воспроизведения
- `previewDelay` - задержка перед началом воспроизведения (по умолчанию 500мс)
- `autoPlay` - автоматическое воспроизведение (по умолчанию true)

#### `useInstantPlay`
Хук для мгновенного перехода к воспроизведению видео.

```typescript
const { navigateToWatch } = useInstantPlay({
  videoId,
  videoUrl,
  currentTime: 0
});
```

**Параметры:**
- `videoId` - ID видео
- `videoUrl` - URL видео
- `currentTime` - время начала воспроизведения

### 2. Компоненты

#### `VideoCardWithPreview`
Обновленная карточка видео с поддержкой предварительного воспроизведения.

```typescript
<VideoCardWithPreview
  id="123"
  title="Название видео"
  preview="/path/to/preview.jpg"
  videoUrl="/path/to/video.mp4"
  // ... другие пропсы
/>
```

#### `VideoPreviewOverlay`
Компонент-обертка для добавления предварительного воспроизведения к любому элементу.

```typescript
<VideoPreviewOverlay
  videoId="123"
  videoUrl="/path/to/video.mp4"
>
  <img src="/preview.jpg" alt="Preview" />
</VideoPreviewOverlay>
```

## Как это работает

### 1. Предварительное воспроизведение
- При наведении на карточку видео запускается таймер (500мс по умолчанию)
- После истечения таймера начинается воспроизведение видео без звука
- Видео воспроизводится в цикле
- При уходе курсора видео останавливается и сбрасывается

### 2. Мгновенный переход
- При клике на карточку сохраняется состояние видео в sessionStorage
- Происходит переход на страницу `/watch?v={videoId}`
- VideoPlayer автоматически восстанавливает состояние и начинает воспроизведение

### 3. Оптимизация производительности
- Видео загружается только при необходимости
- Используется `preload="metadata"` для быстрой загрузки
- Видео автоматически очищается при уходе курсора

## Использование

### В карточках видео
```typescript
import { VideoCardWithPreview } from '@/components/video/VideoCardWithPreview';

// Автоматически включает предварительное воспроизведение
<VideoCardWithPreview {...videoData} />
```

### В других компонентах
```typescript
import { VideoPreviewOverlay } from '@/components/video/VideoPreviewOverlay';

<VideoPreviewOverlay videoId="123" videoUrl="/video.mp4">
  <div className="custom-video-card">
    <img src="/preview.jpg" alt="Preview" />
    <h3>Название видео</h3>
  </div>
</VideoPreviewOverlay>
```

### Прямое использование хуков
```typescript
import { useVideoPreview, useInstantPlay } from '@/hooks';

function CustomVideoCard({ video }) {
  const { videoRef, isPreviewing, handleMouseEnter, handleMouseLeave } = 
    useVideoPreview({ videoUrl: video.videoUrl });
  
  const { navigateToWatch } = useInstantPlay({
    videoId: video.id,
    videoUrl: video.videoUrl
  });

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img src={video.preview} alt={video.title} />
      <video ref={videoRef} className={isPreviewing ? 'visible' : 'hidden'} />
      <button onClick={navigateToWatch}>Смотреть</button>
    </div>
  );
}
```

## Совместимость

- Работает только на десктопе (предварительное воспроизведение)
- Мобильные устройства используют обычную навигацию
- Поддерживает все современные браузеры
- Graceful degradation для браузеров без поддержки автовоспроизведения

## Производительность

- Видео загружается только при наведении
- Используется кэширование в sessionStorage
- Автоматическая очистка ресурсов
- Оптимизированная загрузка метаданных

## Настройка

### Изменение задержки
```typescript
const { videoRef, isPreviewing } = useVideoPreview({
  videoUrl: '/video.mp4',
  previewDelay: 1000 // 1 секунда
});
```

### Отключение автовоспроизведения
```typescript
const { videoRef, isPreviewing } = useVideoPreview({
  videoUrl: '/video.mp4',
  autoPlay: false
});
```

## Ограничения

1. Автовоспроизведение может быть заблокировано браузером
2. Работает только с поддерживаемыми форматами видео (MP4, WebM)
3. Требует HTTPS для автовоспроизведения в некоторых браузерах
4. Может потреблять значительное количество трафика при частом использовании 
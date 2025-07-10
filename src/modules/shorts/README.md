# YouTube Shorts Clone - API Integration

A complete YouTube Shorts clone with real API integration, featuring vertical scrolling, touch gestures, autoplay, and full mobile optimization.

## 🚀 Quick Start

### Basic Usage

```tsx
import { ShortsPage } from '@/modules/shorts';

function App() {
  return (
    <div className="w-full h-screen">
      <ShortsPage
        initialTab="feed"
        showHeader={true}
        showNavigation={true}
      />
    </div>
  );
}
```

### Components Only

```tsx
import { ShortsFeed } from '@/modules/shorts';

function CustomShorts() {
  return (
    <ShortsFeed
      initialFilters={{ category: 'Musiqa' }}
      autoLoadMore={true}
      cacheKey="music-shorts"
    />
  );
}
```

## 📡 API Integration

### Available Endpoints

The module integrates with these API endpoints:

- `GET /shorts/get_shorts` - Fetch all shorts
- `POST /shorts/post_shorts` - Upload new short
- `DELETE /shorts/delete_shorts` - Delete short
- `POST /videos/like` - Like/dislike video
- `POST /videos/comment` - Add comment
- `POST /videos/history` - Track view

### API Service Usage

```tsx
import { shortsApiService } from '@/modules/shorts/services/api';

// Get shorts with filters
const response = await shortsApiService.getShorts({
  category: 'Musiqa',
  page: 1,
  limit: 10
});

// Search shorts
const searchResults = await shortsApiService.searchShorts('dance');

// Handle interactions
await shortsApiService.handleInteraction({
  shortsId: '123',
  action: 'like'
});
```

### Using Hooks

```tsx
import { useShorts, useTrendingShorts } from '@/modules/shorts/hooks/useShorts';

function MyComponent() {
  const {
    shorts,
    loading,
    error,
    refreshShorts,
    handleInteraction
  } = useShorts({
    initialFilters: { category: 'Sport' },
    autoFetch: true
  });

  const { trendingShorts } = useTrendingShorts();

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {/* Render shorts */}
    </div>
  );
}
```

## 🎯 Core Features

### ✅ Implemented

- **Real API Integration** - Fetches data from backend
- **Vertical Scrolling** - Smooth snap-to-video scrolling
- **Touch Gestures** - Swipe up/down navigation
- **Autoplay Policy** - Handles browser autoplay restrictions
- **Search & Filter** - Real-time search and category filtering
- **Trending System** - Auto-refreshing trending shorts
- **User Interactions** - Like, comment, share, view tracking
- **Performance Optimization** - Caching, preloading, lazy loading
- **Error Handling** - Graceful fallbacks and retry logic
- **Mobile Responsive** - Optimized for all screen sizes

### 🎮 Controls

#### Touch/Mouse
- **Swipe up/down** - Navigate between videos
- **Tap video** - Play/pause toggle
- **Tap buttons** - Interact with video (like, comment, share)
- **Hover volume** - Show volume slider

#### Keyboard
- **↑/↓ Arrow keys** - Navigate videos
- **Space** - Play/pause current video
- **M** - Mute/unmute toggle
- **F** - Toggle fullscreen
- **Ctrl+K** - Open search
- **Ctrl+1/2** - Switch tabs

## 📦 Components

### Main Components

#### `ShortsPage`
Complete shorts experience with navigation, search, and filters.

```tsx
<ShortsPage
  initialTab="feed" // 'feed' | 'trending' | 'search'
  showHeader={true}
  showNavigation={true}
/>
```

#### `ShortsFeed`
Core shorts feed with API integration.

```tsx
<ShortsFeed
  initialFilters={{
    category: 'Musiqa',
    search: 'dance'
  }}
  autoLoadMore={true}
  cacheKey="main-feed"
/>
```

#### `TrendingShorts`
Trending shorts with auto-refresh.

```tsx
<TrendingShorts
  limit={20}
  showStats={true}
  autoRefresh={true}
  refreshInterval={5 * 60 * 1000} // 5 minutes
/>
```

### Sub-components

- `ShortVideoItem` - Individual video container
- `VideoPlayer` - Video player with controls
- `ActionButtons` - Like, share, comment buttons
- `VideoControls` - Play/pause, volume, fullscreen
- `VolumeControl` - Volume slider
- `ChannelInfo` - Channel details and subscribe

## 🔧 Configuration

### API Client Setup

Make sure your API client is configured:

```typescript
// In your api-client.ts
export const apiClient = new ApiClient();

// Shorts endpoints are already implemented:
// - uploadShorts(videoFile: File)
// - getShorts()
// - deleteShorts(shortsId: number)
```

### Environment Variables

```env
VITE_API_BASE_URL=your-api-url
VITE_API_TIMEOUT=10000
```

### Tailwind CSS Setup

Ensure these classes are available:

```css
/* In your globals.css or tailwind config */
@layer utilities {
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## 🎨 Customization

### Custom Styling

```css
/* Override default styles */
.shorts-container {
  background: linear-gradient(to bottom, #1a1a1a, #000);
}

.video-player-container {
  border-radius: 16px;
  overflow: hidden;
}

.action-buttons {
  right: 20px;
  bottom: 100px;
}
```

### Custom Filters

```tsx
const customFilters = {
  category: 'Musiqa',
  minViews: 1000,
  maxDuration: 60,
  language: 'uz'
};

<ShortsFeed initialFilters={customFilters} />
```

### Custom Interactions

```tsx
const handleCustomInteraction = async (videoId: string, action: string) => {
  switch (action) {
    case 'custom_action':
      await myCustomAPI.action(videoId);
      break;
    default:
      await shortsApiService.handleInteraction({ shortsId: videoId, action });
  }
};
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Testing Components

```tsx
import { render, screen } from '@testing-library/react';
import { ShortsFeed } from '@/modules/shorts';

test('renders shorts feed', () => {
  render(<ShortsFeed initialFilters={{}} />);
  expect(screen.getByText('Loading shorts...')).toBeInTheDocument();
});
```

### Mock Data for Testing

```tsx
import { mockShorts, getRandomShorts } from '@/modules/shorts/mockData';

// Use mock data for testing
const testShorts = getRandomShorts(5);
```

## 📊 Performance

### Optimization Features

1. **Lazy Loading** - Videos loaded only when needed
2. **Caching** - API responses cached for 5 minutes
3. **Preloading** - Adjacent videos preloaded
4. **Debounced Scrolling** - Smooth scroll performance
5. **Virtual Scrolling** - Only active videos in DOM
6. **Image Optimization** - Responsive thumbnails

### Performance Monitoring

```tsx
import { useShorts } from '@/modules/shorts/hooks/useShorts';

const { shorts, loading, error } = useShorts({
  initialFilters: { limit: 10 }, // Limit results
  cacheKey: 'performance-test'   // Enable caching
});

// Monitor performance
console.log(`Loaded ${shorts.length} shorts in ${loadTime}ms`);
```

## 🚨 Error Handling

### API Errors

```tsx
const {
  shorts,
  error,
  loading,
  refreshShorts,
  clearError
} = useShorts();

if (error) {
  return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button onClick={refreshShorts}>Retry</button>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

### Network Errors

```tsx
// Automatic retry with exponential backoff
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true
};

const { shorts } = useShorts({
  retryConfig,
  onError: (error) => {
    console.error('Shorts API Error:', error);
    // Send to error tracking service
  }
});
```

### Offline Support

```tsx
// Cache data for offline use
const { shorts, isOffline } = useShorts({
  cacheKey: 'offline-shorts',
  offlineSupport: true
});

if (isOffline) {
  return <div>Showing cached content (offline)</div>;
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Videos Not Playing
```typescript
// Check autoplay policy
import { isAutoplaySupported } from '@/modules/shorts/utils/autoplay';

if (!isAutoplaySupported()) {
  // Show manual play button
}
```

#### 2. API Connection Issues
```typescript
// Check API configuration
const apiStatus = await shortsApiService.healthCheck();
if (!apiStatus.ok) {
  console.error('API not available');
}
```

#### 3. Performance Issues
```typescript
// Reduce concurrent requests
const { shorts } = useShorts({
  initialFilters: { limit: 5 }, // Smaller batch size
  preloadNext: false           // Disable preloading
});
```

#### 4. Memory Leaks
```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup function runs on unmount
    videoRef.current?.pause();
    videoRef.current?.removeAttribute('src');
  };
}, []);
```

### Debug Mode

```tsx
import { ShortsPage } from '@/modules/shorts';

<ShortsPage
  debug={true}
  onError={(error) => console.error('Shorts Error:', error)}
  onInteraction={(action) => console.log('User Action:', action)}
/>
```

## 🔒 Security

### API Security

```typescript
// API requests include authentication
const apiClient = new ApiClient({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Content Security

```typescript
// Sanitize user content
import DOMPurify from 'dompurify';

const sanitizedDescription = DOMPurify.sanitize(video.description);
```

## 🌍 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 7+)

## 📚 API Documentation

### Data Types

```typescript
interface ShortVideo {
  id: string;
  video_url: string;
  title: string;
  description?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  views?: number;
  duration?: number;
  channel?: {
    id: string;
    name: string;
    avatar?: string;
    subscribers?: number;
    verified?: boolean;
  };
  created_at?: string;
}
```

### API Responses

```typescript
interface ShortsApiResponse {
  shorts: ShortVideo[];
  total: number;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## 📱 Mobile Optimization

### Touch Gestures

```css
/* Optimize touch targets */
.action-button {
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
}

/* Prevent zoom on double tap */
.video-element {
  touch-action: pan-y;
}
```

### Performance on Mobile

```typescript
// Reduce quality on mobile
const isMobile = window.innerWidth < 768;
const videoQuality = isMobile ? 'standard' : 'high';

const { shorts } = useShorts({
  initialFilters: { 
    quality: videoQuality,
    limit: isMobile ? 5 : 10
  }
});
```

## 🤝 Contributing

### Development Setup

```bash
git clone <repository>
cd youtube_clone
npm install
npm run dev
```

### Code Standards

- TypeScript for type safety
- ESLint + Prettier for code formatting
- React hooks for state management
- Tailwind CSS for styling
- Jest for testing

### Pull Request Guidelines

1. Create feature branch
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Submit PR with description

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related

- [API Documentation](../../../docs/api.md)
- [Component Library](../../../docs/components.md)
- [Testing Guide](../../../docs/testing.md)

---

**Built with ❤️ for the YouTube Clone project**
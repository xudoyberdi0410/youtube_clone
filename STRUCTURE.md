# Project Structure Documentation

This document outlines the improved file structure and organization of the YouTube Clone project.

## 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Home page route group
│   ├── auth/              # Authentication pages
│   ├── settings/          # Settings page
│   ├── watch/             # Video watch page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/            # Reusable UI components
│   ├── auth/              # Auth-specific components
│   ├── ui/                # shadcn/ui components
│   ├── video/             # Video-related components
│   └── youtube-icons/     # YouTube icon SVGs
├── hooks/                 # Custom React hooks
│   ├── use-api.ts         # API call hook
│   ├── use-local-storage.ts # localStorage hook
│   └── index.ts           # Hook exports
├── lib/                   # Utility libraries
│   ├── utils/             # Utility functions
│   │   ├── format.ts      # Formatting functions
│   │   ├── validation.ts  # Validation functions
│   │   └── index.ts       # Utils exports
│   ├── api-client.ts      # HTTP client
│   ├── api-config.ts      # API configuration
│   ├── constants.ts       # App constants
│   └── utils.ts           # Core utilities (cn function)
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   ├── home/              # Home page module
│   ├── settings/          # Settings module
│   └── [feature]/         # Other feature modules
└── types/                 # TypeScript type definitions
    ├── common.ts          # Common types
    ├── video.ts           # Video-related types
    └── auth.ts            # Auth-related types
```

## 🏗️ Architecture Patterns

### 1. **Feature Module Structure**
Each feature module follows this pattern:
```
module/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── lib/                 # Feature utilities
├── types/               # Feature types
├── ui/                  # UI components and layouts
└── index.ts             # Public API exports
```

### 2. **UI Component Organization**
- **Atomic Design**: Components are organized by complexity
- **Feature Components**: Feature-specific UI in module folders
- **Shared UI**: Reusable components in `/components/ui/`

### 3. **Type Safety**
- Comprehensive TypeScript types in `/types/`
- Feature-specific types in module folders
- Shared types exported from `/types/common.ts`

## 🔧 Configuration Management

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

### Constants Organization
- **App Config**: General app settings
- **UI Config**: Layout and design constants
- **API Config**: API endpoints and settings
- **Error/Success Messages**: Centralized messaging

## 📦 Import Organization

### Path Aliases
```typescript
// Absolute imports from root
import { Button } from '@/components/ui/button'
import { formatViews } from '@/lib/utils/format'
import { VIDEO_CONFIG } from '@/lib/constants'
```

### Export Patterns
```typescript
// Module index files provide clean public APIs
export { SettingsPage } from './ui/components/settings-page'
export { useSettings } from './hooks/use-settings'
export type { SettingsFormData } from './types'
```

## 🎯 Best Practices

### 1. **Separation of Concerns**
- Business logic in custom hooks
- UI logic in components
- Data types in dedicated files
- Constants centralized

### 2. **Scalability**
- Modular architecture
- Feature-based organization
- Consistent naming conventions
- Clear dependency management

### 3. **Developer Experience**
- TypeScript for type safety
- Comprehensive error handling
- Utility functions for common tasks
- Well-documented code structure

### 4. **Performance**
- Code splitting by features
- Optimized imports
- Lazy loading where appropriate
- Efficient re-exports

## 🚀 Getting Started

1. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

2. **Development**:
   ```bash
   bun dev
   ```

3. **Adding New Features**:
   - Create new module in `/src/modules/`
   - Follow established patterns
   - Export public API through index files
   - Add types to appropriate type files

This structure provides a solid foundation for scaling the YouTube clone project while maintaining code quality and developer productivity.

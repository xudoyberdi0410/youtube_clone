# YouTube Clone - Development Guide

## 🚀 Quick Start

1. **Clone and setup**:
   ```bash
   git clone [repository-url]
   cd youtube_clone
   cp .env.example .env.local
   bun install
   ```

2. **Environment Configuration**:
   Edit `.env.local` with your settings:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_ENV=development
   ```

3. **Start development**:
   ```bash
   bun dev
   ```

## 📁 Project Structure

This project follows a modular architecture with clear separation of concerns:

- **`/src/app/`** - Next.js App Router pages and layouts
- **`/src/modules/`** - Feature modules (auth, home, settings, etc.)
- **`/src/components/`** - Reusable UI components
- **`/src/lib/`** - Utilities, constants, and configurations
- **`/src/hooks/`** - Custom React hooks
- **`/src/types/`** - TypeScript type definitions

For detailed structure documentation, see [STRUCTURE.md](./STRUCTURE.md).

## 🛠️ Available Scripts

```bash
# Development
bun dev                 # Start development server
bun build              # Build for production
bun start              # Start production server

# Code Quality
bun lint               # Check for linting errors
bun lint:fix           # Fix linting errors
bun type-check         # Check TypeScript types
bun format             # Format code with Prettier
bun format:check       # Check code formatting

# Docker
./docker-dev.sh dev    # Start with Docker (Linux/Mac)
.\docker-dev.ps1 dev   # Start with Docker (Windows)

# Utilities
bun clean              # Clean build artifacts
bun analyze            # Analyze bundle size
```


## 🏗️ Architecture

### Module Structure
Each feature module follows this pattern:
```
module/
├── components/        # Feature-specific components
├── hooks/            # Feature-specific hooks
├── lib/              # Feature utilities
├── types/            # Feature types
├── ui/               # UI components and layouts
└── index.ts          # Public API exports
```

### Key Design Principles
- **Feature-based organization** for scalability
- **TypeScript-first** for type safety
- **Modular architecture** for maintainability
- **Consistent patterns** for developer experience

## 🔧 Development Workflow

### Adding New Features
1. Create module in `/src/modules/[feature-name]/`
2. Follow established patterns
3. Export public API through index files
4. Add types to appropriate type files
5. Update documentation

### Component Development
1. Use shadcn/ui components as base
2. Create feature-specific components in module folders
3. Follow atomic design principles
4. Implement proper TypeScript types

### API Integration
Our project features a comprehensive TypeScript API client with full type safety:

- **Centralized API client** in `/src/lib/api-client.ts` with complete endpoint coverage
- **Type-safe API types** in `/src/types/api.ts` for all requests and responses
- **Error handling** with custom `ApiError` class
- **FormData support** for file uploads (videos, images)
- **Automatic authentication** headers for protected endpoints

Key features:
- ✅ Singleton pattern for consistent client instance
- ✅ Full TypeScript coverage for all 30+ API endpoints
- ✅ Support for User, Channel, Video, Likes, Comments, History, Playlists, Shorts APIs
- ✅ Built-in error handling and network retry logic

For detailed API usage, see [API-CLIENT-GUIDE.md](./API-CLIENT-GUIDE.md).

## 📝 Code Standards

### TypeScript
- Use strict mode
- Define proper interfaces and types
- Leverage type safety throughout the application
- Use proper generic types where applicable

### React
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use proper dependency arrays in useEffect

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Maintain consistent spacing and typography

## 🐳 Docker Development

For containerized development:

```bash
# Linux/Mac
./docker-dev.sh dev

# Windows
.\docker-dev.ps1 dev
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

## 📚 Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Bun** - Fast package manager and runtime
- **React Query** - Server state management
- **Zustand** - Client state management

## 🔍 API Integration

The project uses a modular API architecture:

- **Configuration**: Centralized in `/src/lib/api-config.ts`
- **Client**: HTTP client in `/src/lib/api-client.ts`
- **Types**: API types in `/src/types/`
- **Hooks**: Custom hooks for API calls

See [API-GUIDE.md](./API-GUIDE.md) for detailed API documentation.

## 🎨 UI/UX Guidelines

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized loading and rendering
- **User Experience**: Intuitive navigation and interactions

## 🚦 Development Status

- ✅ Project structure and configuration
- ✅ Authentication system
- ✅ User settings and profile management
- ✅ Basic video display and layout
- 🔄 Video upload and management
- ⏳ Video player functionality
- ⏳ Comments and interactions
- ⏳ Search and filtering

## 🎯 Key Features

### 📺 Channel Viewing System
- **Dynamic Channel Pages**: Browse channels with URLs like `/@channelname`
- **Channel Management**: Create, edit, and manage multiple channels  
- **Subscriptions**: Subscribe/unsubscribe to channels
- **Channel Navigation**: Tabs for Home, Videos, Shorts, Playlists, About
- **Responsive Design**: Optimized for all screen sizes

For detailed channel functionality, see [CHANNEL_VIEWING_FEATURE.md](./CHANNEL_VIEWING_FEATURE.md).

### 🔐 Authentication System
- **JWT-based Auth**: Secure token-based authentication
- **Auto Token Refresh**: Seamless token management
- **Protected Routes**: Automatic redirect for protected content
- **User Management**: Profile creation and management

### 🎬 Video System  
- **Video Upload**: Support for video file uploads
- **Video Player**: Custom video player with controls
- **Categories**: Organized video categorization
- **Statistics**: Views, likes, and engagement tracking

### 🎨 Modern UI
- **shadcn/ui Components**: Beautiful, accessible components
- **Dark/Light Mode**: Theme switching support
- **Mobile Responsive**: Optimized for all devices
- **Loading States**: Smooth loading experiences

## 🤝 Contributing

1. Follow the established code structure
2. Write comprehensive TypeScript types
3. Include proper error handling
4. Add documentation for new features
5. Test your changes thoroughly

## 📞 Support

For questions or issues:
1. Check existing documentation
2. Review code patterns in similar modules
3. Create detailed issue reports
4. Follow contribution guidelines

---

This project is built with modern web technologies and follows industry best practices for scalability, maintainability, and developer experience.

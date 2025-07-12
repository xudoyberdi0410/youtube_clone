export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  status: 'draft' | 'published' | 'processing';
  views: number;
  likes: number;
  uploadedAt: string;
  visibility: 'public' | 'unlisted' | 'private';
  tags: string[];
}

export interface Comment {
  id: string;
  videoId: string;
  videoTitle: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  status: 'new' | 'hidden' | 'approved';
  createdAt: string;
  likes: number;
  replies: number;
}

export interface AnalyticsData {
  views: number;
  watchTime: number;
  subscribers: number;
  ctr: number;
  viewsByDay: Array<{ date: string; views: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
}

export interface ChannelSettings {
  name: string;
  description: string;
  avatar: string;
  banner: string;
  commentSettings: 'all' | 'filtered' | 'disabled';
}

// Mock videos data
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'How to Build a React App from Scratch',
    description: 'Complete tutorial on building a modern React application with TypeScript and Tailwind CSS.',
    thumbnail: '/api/placeholder/320/180',
    duration: '15:30',
    status: 'published',
    views: 15420,
    likes: 892,
    uploadedAt: '2024-01-15T10:30:00Z',
    visibility: 'public',
    tags: ['react', 'typescript', 'tutorial']
  },
  {
    id: '2',
    title: 'Advanced CSS Grid Techniques',
    description: 'Learn advanced CSS Grid techniques for modern web layouts.',
    thumbnail: '/api/placeholder/320/180',
    duration: '22:15',
    status: 'published',
    views: 8934,
    likes: 456,
    uploadedAt: '2024-01-10T14:20:00Z',
    visibility: 'public',
    tags: ['css', 'grid', 'layout']
  },
  {
    id: '3',
    title: 'Next.js 14 New Features',
    description: 'Exploring the latest features in Next.js 14 including App Router and Server Components.',
    thumbnail: '/api/placeholder/320/180',
    duration: '18:45',
    status: 'draft',
    views: 0,
    likes: 0,
    uploadedAt: '2024-01-20T09:15:00Z',
    visibility: 'private',
    tags: ['nextjs', 'react', 'web-development']
  },
  {
    id: '4',
    title: 'TypeScript Best Practices',
    description: 'Essential TypeScript patterns and best practices for better code quality.',
    thumbnail: '/api/placeholder/320/180',
    duration: '25:10',
    status: 'published',
    views: 12345,
    likes: 678,
    uploadedAt: '2024-01-05T16:45:00Z',
    visibility: 'public',
    tags: ['typescript', 'programming', 'best-practices']
  },
  {
    id: '5',
    title: 'Tailwind CSS Deep Dive',
    description: 'Advanced Tailwind CSS techniques and custom configurations.',
    thumbnail: '/api/placeholder/320/180',
    duration: '20:30',
    status: 'processing',
    views: 0,
    likes: 0,
    uploadedAt: '2024-01-18T11:00:00Z',
    visibility: 'unlisted',
    tags: ['tailwind', 'css', 'styling']
  }
];

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: '1',
    videoId: '1',
    videoTitle: 'How to Build a React App from Scratch',
    author: {
      name: 'John Developer',
      avatar: '/api/placeholder/40/40'
    },
    text: 'Great tutorial! Really helped me understand React better. Can you make a follow-up video about state management?',
    status: 'new',
    createdAt: '2024-01-16T08:30:00Z',
    likes: 12,
    replies: 2
  },
  {
    id: '2',
    videoId: '1',
    videoTitle: 'How to Build a React App from Scratch',
    author: {
      name: 'Sarah Coder',
      avatar: '/api/placeholder/40/40'
    },
    text: 'The TypeScript integration part was confusing. Could you explain it more slowly?',
    status: 'new',
    createdAt: '2024-01-16T10:15:00Z',
    likes: 5,
    replies: 1
  },
  {
    id: '3',
    videoId: '2',
    videoTitle: 'Advanced CSS Grid Techniques',
    author: {
      name: 'Mike Designer',
      avatar: '/api/placeholder/40/40'
    },
    text: 'This is exactly what I was looking for! The grid examples are so practical.',
    status: 'approved',
    createdAt: '2024-01-11T14:20:00Z',
    likes: 8,
    replies: 0
  },
  {
    id: '4',
    videoId: '4',
    videoTitle: 'TypeScript Best Practices',
    author: {
      name: 'Alex Programmer',
      avatar: '/api/placeholder/40/40'
    },
    text: 'Spam comment with inappropriate content',
    status: 'hidden',
    createdAt: '2024-01-06T09:45:00Z',
    likes: 0,
    replies: 0
  },
  {
    id: '5',
    videoId: '4',
    videoTitle: 'TypeScript Best Practices',
    author: {
      name: 'Emma Developer',
      avatar: '/api/placeholder/40/40'
    },
    text: 'The interface examples were really helpful. Do you have any resources for advanced TypeScript patterns?',
    status: 'approved',
    createdAt: '2024-01-06T11:30:00Z',
    likes: 15,
    replies: 3
  }
];

// Mock analytics data
export const mockAnalytics: AnalyticsData = {
  views: 45678,
  watchTime: 1234567, // in minutes
  subscribers: 2345,
  ctr: 4.2, // click-through rate percentage
  viewsByDay: [
    { date: '2024-01-15', views: 1234 },
    { date: '2024-01-16', views: 1456 },
    { date: '2024-01-17', views: 1321 },
    { date: '2024-01-18', views: 1678 },
    { date: '2024-01-19', views: 1890 },
    { date: '2024-01-20', views: 2100 },
    { date: '2024-01-21', views: 1987 }
  ],
  trafficSources: [
    { source: 'YouTube Search', percentage: 45 },
    { source: 'Suggested Videos', percentage: 25 },
    { source: 'External', percentage: 15 },
    { source: 'Playlists', percentage: 10 },
    { source: 'Other', percentage: 5 }
  ]
};

// Mock channel settings
export const mockChannelSettings: ChannelSettings = {
  name: 'Tech Tutorials Pro',
  description: 'Professional tutorials on web development, React, TypeScript, and modern web technologies. Helping developers build better applications.',
  avatar: '/api/placeholder/100/100',
  banner: '/api/placeholder/1200/300',
  commentSettings: 'filtered'
};

// Dashboard stats
export const mockDashboardStats = {
  totalViews: 45678,
  totalLikes: 2345,
  totalSubscribers: 1234,
  totalVideos: 15,
  recentViews: 2100,
  recentLikes: 89,
  recentSubscribers: 12
}; 
'use client';

import { ShortsFeed } from '@/modules/shorts/ShortsFeed';
import { shortsData } from '@/modules/shorts/data';

export default function ShortsPage() {
  return <ShortsFeed shorts={shortsData} />;
}
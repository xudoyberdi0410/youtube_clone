// src/app/playlist/layout.tsx

import { BaseLayout } from "@/components/layouts/BaseLayout"

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BaseLayout>{children}</BaseLayout>
}

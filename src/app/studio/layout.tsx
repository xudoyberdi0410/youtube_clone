import { StudioLayout } from "@/modules/studio/layout/StudioLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioLayout>{children}</StudioLayout>;
} 
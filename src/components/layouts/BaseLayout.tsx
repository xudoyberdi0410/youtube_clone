"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "@/modules/home/ui/components/home-navbar";
import { HomeSidebar } from "@/modules/home/ui/components/home-sidebar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

interface BaseLayoutProps {
  children: React.ReactNode;
  withContainer?: boolean;
}

export const BaseLayout = ({
  children,
  withContainer: propWithContainer,
}: BaseLayoutProps) => {
  const pathname = usePathname();
  const withContainer =
    propWithContainer ?? (pathname !== "/" && !pathname?.startsWith("/shorts"));

  // Исключаем определенные маршруты, которые имеют свой собственный layout
  const shouldRenderLayout =
    !pathname?.startsWith("/watch") && 
    !pathname?.startsWith("/auth") && 
    !pathname?.startsWith("/studio");

  // Если это исключенный маршрут, просто рендерим children
  if (!shouldRenderLayout) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <HomeNavbar />
        </Suspense>
        <div className="flex min-h-screen">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto bg-background pt-16">
            {withContainer ? (
              <div className="container mx-auto px-4 py-8">{children}</div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

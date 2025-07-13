"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "@/modules/home/ui/components/home-navbar";
import { WatchSidebar } from "@/modules/home/ui/components/watch-sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="w-full">
        <HomeNavbar />
        <div className="min-h-screen">
          <WatchSidebar />
          <main className="flex-1 overflow-y-auto bg-background pt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
export default Layout;
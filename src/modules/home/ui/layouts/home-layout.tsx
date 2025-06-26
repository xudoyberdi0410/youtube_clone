import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="w-full">
                <HomeNavbar />
                <div className="flex min-h-screen">
                    <HomeSidebar />
                    <main className="flex-1 overflow-y-auto bg-white pt-16">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
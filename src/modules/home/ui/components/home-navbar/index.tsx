"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { SearchInput } from "./search-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-botton"
import { SearchIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { useIsClient } from "@/hooks/use-is-client"
import { t } from "@/lib/i18n"
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useSearchParams } from "next/navigation"

export const HomeNavbar = () => {
    const isClient = useIsClient();
    const { isLoggedIn, loading } = useAuth();
    const searchParams = useSearchParams();
    const searchQuery = searchParams?.get("q") || "";

    if (!isClient || loading) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 md:px-4 z-50 border-b border-gray-200">
            <div className="flex items-center justify-between w-full">
                {/* Menu and logo */}
                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger />
                    <Link href="/">
                        <div className="p-2 md:p-4 flex items-center gap-1 md:gap-2">
                            <div className="relative w-8 h-8 md:w-12 md:h-12">
                                <Image 
                                    src="/youtube.svg" 
                                    alt="YouTube" 
                                    fill 
                                    priority
                                    sizes="(max-width: 768px) 32px, 48px"
                                />
                            </div>
                            <p className="hidden sm:block text-lg md:text-xl font-semibold tracking-tight">{t('navbar.youtube')}</p>
                        </div>
                    </Link>
                </div>

                {/* Search bar - hidden on mobile, shown on tablet+ */}
                <div className="hidden md:flex flex-1 justify-center max-w-[720px] mx-auto">
                    <SearchInput initialValue={searchQuery} />
                </div>

                {/* Right side - Upload button, Auth button and mobile search */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    {/* Mobile search button */}
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    
                    {/* Upload button - only show for authenticated users */}
                    {loading ? null : isLoggedIn && (
                    <Link href="/upload">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('navbar.upload')}</span>
                        </Button>
                    </Link>
                    )}
                    <ThemeSwitcher />
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}
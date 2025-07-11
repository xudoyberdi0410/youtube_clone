'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { t } from '@/lib/i18n'

interface HomeButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  iconOnly?: boolean
}

export function HomeButton({ 
  variant = "outline", 
  size = "default",
  className = "",
  iconOnly = false
}: HomeButtonProps) {
  return (
    <Link href="/">
      <Button variant={variant} size={iconOnly ? "icon" : size} className={className}>
        <Home className={iconOnly ? "w-4 h-4" : "w-4 h-4 mr-2"} />
        {!iconOnly && t('navbar.home')}
      </Button>
    </Link>
  )
}

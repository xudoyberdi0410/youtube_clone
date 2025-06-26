'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "@/components/youtube-icons"

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
        <HomeIcon className={iconOnly ? "w-4 h-4" : "w-4 h-4 mr-2"} />
        {!iconOnly && "На главную"}
      </Button>
    </Link>
  )
}

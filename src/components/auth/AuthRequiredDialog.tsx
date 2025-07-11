"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserCircle, LogIn } from 'lucide-react'
import Link from 'next/link'
import { t } from '@/lib/i18n'

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
  title = t("authRequired.title"),
  description = t("authRequired.description")
}: AuthRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              <LogIn className="w-4 h-4 mr-2" />
              {t("auth.signIn")}
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/signup">
              {t("auth.createAccount")}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t("playlist.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

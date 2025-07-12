"use client";

import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { UserAvatar } from "./user-avatar";
import { t } from "@/lib/i18n";

export const AuthButton = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    // Показываем заглушку во время загрузки
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (isLoggedIn && user) {
    // Показываем аватар для залогиненного пользователя
    return <UserAvatar user={user} />;
  }

  // Показываем кнопку входа для незалогиненного пользователя
  return (
    <Button
      variant={"outline"}
      className="px-4 py-2 text-sm font-medium rounded-full shadow-none flex items-center gap-2 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow transition-colors duration-150"
      asChild
    >
      <Link href="/auth/signin">
        <UserCircleIcon className="w-5 h-5" />
        {t("auth.signIn")}
      </Link>
    </Button>
  );
};

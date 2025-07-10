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
      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none hover:bg-blue-100"
      asChild
    >
      <Link href="/auth/signin">
        <UserCircleIcon />
        {t("auth.signIn")}
      </Link>
    </Button>
  );
};

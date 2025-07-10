"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateProfile } from "../../lib/auth-utils";
import { t } from "@/lib/i18n";

interface ProfileEditDialogProps {
  user?: {
    username?: string;
    email?: string;
  };
  children: React.ReactNode;
}

export function ProfileEditDialog({ user, children }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      setLoading(false);
      return;
    }

    try {
      const updateData: Record<string, string> = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateProfile(updateData);

      // Обновляем состояние авторизации
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("authStateChanged"));
      }
      setOpen(false);
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (err: unknown) {
      setError((err as Error).message || t("auth.error.profileUpdate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("auth.profile.editTitle")}</DialogTitle>
          <DialogDescription>{t("auth.profile.editDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="username">{t("settings.username")}</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("settings.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("settings.newPassword")}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={t("settings.newPasswordPlaceholder")}
            />
          </div>

          {formData.password && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("settings.confirmNewPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required={!!formData.password}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("settings.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("settings.saving") : t("settings.saveChanges")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { t } from "@/lib/i18n";
import { UploadVideoForm } from "@/modules/upload/ui/components/upload-video-form";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const { isLoggedIn, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="text-center mb-8">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center py-16">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium text-muted-foreground mb-2">
                {t("upload.authRequiredTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("upload.authRequiredDesc")}
              </p>
              <button
                onClick={() => setShowAuthDialog(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                {t("upload.authRequiredBtn")}
              </button>
            </div>
          </div>
        </div>
        <AuthRequiredDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          title={t("upload.authRequiredTitle")}
          description={t("upload.authRequiredDialogDesc")}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t("upload.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("upload.shareWithWorld")}
          </p>
        </div>

        <UploadVideoForm />
      </div>
    </div>
  );
}

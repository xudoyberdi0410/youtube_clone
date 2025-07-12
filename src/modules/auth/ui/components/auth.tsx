"use client"
import { LoginForm } from "./login-form";
import SignUpForm from "./sign-up-form";
import { HomeButton } from "@/components/ui/home-button";
import { useRouter } from "next/navigation";

export const Auth = ({ mode }: { mode: string }) => {
  const router = useRouter();
  let component;
  if (mode === "signin") {
    component = <LoginForm />;
  } else if (mode === "signup") {
    component = <SignUpForm />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {" "}
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded transition"
            onClick={() => router.back()}
          >
            ← Назад
          </button>
          <HomeButton variant="ghost" size="sm" />
        </div>
        {component}
      </div>
    </div>
  );
};

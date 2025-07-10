"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "../../lib/auth-utils";
import { t } from "@/lib/i18n";

type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;

function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEmailError(false);

    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, username, password });
      // Optionally, log in the user automatically after registration
      await loginUser({ username, password });
      router.push("/");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        const message = (err as { message?: string }).message!;
        if (message.toLowerCase().includes("email")) {
          setEmailError(true);
        }
        setError(message);
      } else {
        setError(t("auth.error.registrationFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("auth.signUpTitle") || "Sign up your account"}
          </CardTitle>
          <CardDescription>
            {t("auth.signUpDescription") ||
              "Enter your email below to register a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder") || "m@example.com"}
                  required
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    emailError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
              </div>

              {/* Username */}
              <div className="grid gap-3">
                <Label htmlFor="username">
                  {t("auth.username") || "Username"}
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">
                  {t("auth.password") || "Password"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">
                  {t("auth.confirmPassword") || "Confirm Password"}
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {/* Ошибка */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Кнопка */}
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? t("auth.signingUp") || "Signing Up..."
                  : t("auth.signUpBtn") || "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
              <a href="signin" className="underline underline-offset-4">
                {t("auth.loginLink") || "Log in"}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpForm;
export { SignUpForm };

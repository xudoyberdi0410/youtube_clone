import { LoginForm } from "./login-form";
import SignUpForm from "./sign-up-form";
import { HomeButton } from "@/components/ui/home-button";

export const Auth = ({ mode }: { mode: string }) => {
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
        <div className="mb-4 flex justify-start">
          <HomeButton variant="ghost" size="sm" />
        </div>
        {component}
      </div>
    </div>
  );
};

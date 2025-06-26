import { Auth as AuthComponent } from "@/modules/auth/ui/components/auth";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [
    { mode: 'signin' },
    { mode: 'signup' }
  ];
}

export default async function AuthPage({ params }: {
  params: Promise<{ mode: string }>
}) {
  const { mode } = await params;

  if (!["signin", "signup"].includes(mode)) {
    notFound();
  }

  return <AuthComponent mode={mode} />;
}

import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { AuthProvider } from "@/modules/auth/context/auth-context";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { ThemeProvider } from "next-themes";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.NAME,
    template: `%s | ${APP_CONFIG.NAME}`,
  },
  description: "A modern YouTube clone built with Next.js, TypeScript, and Tailwind CSS",
  keywords: ["youtube", "video", "streaming", "nextjs", "typescript"],
  authors: [{ name: "YouTube Clone Team" }],
  creator: "YouTube Clone Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: APP_CONFIG.NAME,
    title: APP_CONFIG.NAME,
    description: "A modern YouTube clone built with Next.js",
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.NAME,
    description: "A modern YouTube clone built with Next.js",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <BaseLayout>
              {children}
            </BaseLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { EnvChecker } from "@/components/EnvChecker";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetPals - Dog Breeding & Kennel Management Platform",
  description:
    "All-in-one kennel management solution where breeders can connect social media accounts and deploy template websites to run their entire business from one platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="env-config" strategy="beforeInteractive">
          {`
            window.ENV = {
              SUPABASE_URL: "${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}",
              SUPABASE_ANON_KEY: "${
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
              }"
            };
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <DatabaseProvider>
              <GlobalErrorHandler />
              <EnvChecker />
              {children}
              <Toaster />
            </DatabaseProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

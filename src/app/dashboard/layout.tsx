"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ErrorBoundary from "@/components/ErrorBoundary";
import { DatabaseConnectionError } from "@/components/DatabaseConnectionError";
import { useDatabase } from "@/contexts/DatabaseContext";
import {
  LayoutDashboard,
  Dog,
  Shield,
  Heart,
  BookOpen,
  Stethoscope,
  Utensils,
  Calendar,
  Image,
  Settings,
  Bot,
  Target,
  Dna,
  GitMerge,
  Award,
  Dumbbell,
  MessageSquare,
  Palette,
  PieChart,
  Sparkles,
  Server as ServerIcon,
  Globe,
  Users,
  DollarSign,
  FileText,
  Video,
  BarChart,
  Share2,
  Plus,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isConnected } = useDatabase();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            PetPals
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
              <span className="sr-only">Account</span>
            </Button>
          </nav>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <nav className="flex flex-col gap-2 p-4">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Main
              </h3>
            </div>
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/dogs">
              <Button
                variant={
                  pathname.startsWith("/dashboard/dogs") ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Dog className="mr-2 h-4 w-4" />
                My Dogs
              </Button>
            </Link>
            <Link href="/dashboard/ai-advisor">
              <Button
                variant={
                  pathname.startsWith("/dashboard/ai-advisor")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Bot className="mr-2 h-4 w-4" />
                AI Advisor
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Pet Owner
              </h3>
            </div>
            <Link href="/dashboard/health">
              <Button
                variant={
                  pathname.startsWith("/dashboard/health") ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Health
              </Button>
            </Link>
            <Link href="/dashboard/training">
              <Button
                variant={
                  pathname.startsWith("/dashboard/training")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Target className="mr-2 h-4 w-4" />
                Training
              </Button>
            </Link>
            <Link href="/dashboard/nutrition">
              <Button
                variant={
                  pathname.startsWith("/dashboard/nutrition")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Utensils className="mr-2 h-4 w-4" />
                Nutrition
              </Button>
            </Link>
            <Link href="/dashboard/appointments">
              <Button
                variant={
                  pathname.startsWith("/dashboard/appointments")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </Button>
            </Link>
            <Link href="/dashboard/gallery">
              <Button
                variant={
                  pathname.startsWith("/dashboard/gallery")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Image className="mr-2 h-4 w-4" />
                Gallery
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Kennel Owners
              </h3>
            </div>
            <Link href="/dashboard/breeding">
              <Button
                variant={
                  pathname === "/dashboard/breeding" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Target className="mr-2 h-4 w-4" />
                Breeding Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/breeding-programs">
              <Button
                variant={
                  pathname.startsWith("/dashboard/breeding-programs")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Breeding Programs
              </Button>
            </Link>
            <Link href="/dashboard/dna-tests">
              <Button
                variant={
                  pathname.startsWith("/dashboard/dna-tests")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Dna className="mr-2 h-4 w-4" />
                DNA Tests
              </Button>
            </Link>
            <Link href="/dashboard/health-clearances">
              <Button
                variant={
                  pathname.startsWith("/dashboard/health-clearances")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Award className="mr-2 h-4 w-4" />
                Health Clearances
              </Button>
            </Link>
            <Link href="/dashboard/breeding/compatibility">
              <Button
                variant={
                  pathname.startsWith("/dashboard/breeding/compatibility")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <GitMerge className="mr-2 h-4 w-4" />
                Compatibility
              </Button>
            </Link>
            <Link href="/dashboard/breeding/color-prediction">
              <Button
                variant={
                  pathname.startsWith("/dashboard/breeding/color-prediction")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Palette className="mr-2 h-4 w-4" />
                Color Prediction
              </Button>
            </Link>
            <Link href="/dashboard/breeding/coi-calculator">
              <Button
                variant={
                  pathname.startsWith("/dashboard/breeding/coi-calculator")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <PieChart className="mr-2 h-4 w-4" />
                COII Calculator
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Stud Services
              </h3>
            </div>
            <Link href="/dashboard/stud-services">
              <Button
                variant={
                  pathname === "/dashboard/stud-services" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Heart className="mr-2 h-4 w-4" />
                Stud Service Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/stud-services/create">
              <Button
                variant={
                  pathname === "/dashboard/stud-services/create" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Stud Service
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Marketing
              </h3>
            </div>
            <Link href="/dashboard/marketing">
              <Button
                variant={
                  pathname === "/dashboard/marketing" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Kennel Marketing Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/marketing/branding">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketing/branding")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Globe className="mr-2 h-4 w-4" />
                Kennel Branding
              </Button>
            </Link>
            <Link href="/dashboard/marketing/clients">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketing/clients")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Client Management
              </Button>
            </Link>
            <Link href="/dashboard/marketing/education">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketing/education")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Educational Content
              </Button>
            </Link>
            <Link href="/dashboard/marketing/stud">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketing/stud")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Award className="mr-2 h-4 w-4" />
                Stud Marketing
              </Button>
            </Link>
            <Link href="/dashboard/social">
              <Button
                variant={
                  pathname.startsWith("/dashboard/social") ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Social Media Marketing
              </Button>
            </Link>
            <Link href="/website-templates">
              <Button
                variant={
                  pathname === "/website-templates" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Kennel Website Templates
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Kennel Management
              </h3>
            </div>
            <Link href="/dashboard/marketing/finances">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketing/finances")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Financial Management
              </Button>
            </Link>
            <Link href="/dashboard/marketplace">
              <Button
                variant={
                  pathname.startsWith("/dashboard/marketplace")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <ServerIcon className="mr-2 h-4 w-4" />
                Marketplace
              </Button>
            </Link>

            <div className="mt-4 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">
                Account
              </h3>
            </div>
            <Link href="/dashboard/settings">
              <Button
                variant={
                  pathname.startsWith("/dashboard/settings")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          <ErrorBoundary>
            <DatabaseConnectionError />
            {isConnected && children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";
import { DatabaseConnectionError } from "@/components/DatabaseConnectionError";
import { useDatabase } from "@/contexts/DatabaseContext";
import "./dashboard.css";
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
  MessageSquare,
  Palette,
  PieChart,
  Server as ServerIcon,
  Globe,
  Users,
  DollarSign,
  FileText,
  BarChart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isConnected } = useDatabase();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Check if we're on mobile and hide sidebar by default on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarVisible(window.innerWidth >= 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:flex">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="gradient-text">PetPals</span>
            </Link>
          </div>
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
        <aside
          className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-muted/40 shadow-lg transition-all duration-300 ease-in-out ${sidebarVisible ? 'block' : 'hidden'} fixed md:relative h-[calc(100vh-4rem)] z-40 md:z-0 relative`}
        >
          <div className="hidden md:block sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </div>
          <div className="flex justify-end p-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className={`border-b border-gray-200 dark:border-gray-700 mb-2 ${collapsed ? 'mx-2' : 'mx-4'}`}></div>
          <nav className={`flex flex-col gap-2 ${collapsed ? 'px-2' : 'p-4'} overflow-y-auto h-[calc(100%-3rem)]`}>
            {!collapsed && (
              <div className="mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Main
                </h3>
              </div>
            )}
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                className={`${collapsed ? 'sidebar-collapsed-btn' : 'w-full justify-start'} ${pathname === "/dashboard" ? "btn-primary" : "hover:bg-[rgba(41,171,226,0.2)] hover:text-[#29ABE2]"}`}
                title="Dashboard"
              >
                <LayoutDashboard className={collapsed ? "" : "mr-2 h-4 w-4"} />
                {!collapsed && "Dashboard"}
              </Button>
            </Link>
            <Link href="/dashboard/dogs">
              <Button
                variant={
                  pathname.startsWith("/dashboard/dogs") ? "default" : "ghost"
                }
                className={`${collapsed ? 'sidebar-collapsed-btn' : 'w-full justify-start'} ${pathname.startsWith("/dashboard/dogs") ? "btn-primary" : "hover:bg-[rgba(41,171,226,0.2)] hover:text-[#29ABE2]"}`}
                title="My Dogs"
              >
                <Dog className={collapsed ? "" : "mr-2 h-4 w-4"} />
                {!collapsed && "My Dogs"}
              </Button>
            </Link>
            <Link href="/dashboard/ai-advisor">
              <Button
                variant={
                  pathname.startsWith("/dashboard/ai-advisor")
                    ? "default"
                    : "ghost"
                }
                className={`${collapsed ? 'sidebar-collapsed-btn' : 'w-full justify-start'} ${pathname.startsWith("/dashboard/ai-advisor") ? "btn-primary" : "hover:bg-[rgba(41,171,226,0.2)] hover:text-[#29ABE2]"}`}
                title="AI Advisor"
              >
                <Bot className={collapsed ? "" : "mr-2 h-4 w-4"} />
                {!collapsed && "AI Advisor"}
              </Button>
            </Link>

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Pet Owner
                </h3>
              </div>
            )}
            <Link href="/dashboard/health">
              <Button
                variant={
                  pathname.startsWith("/dashboard/health") ? "default" : "ghost"
                }
                className={`${collapsed ? 'sidebar-collapsed-btn' : 'w-full justify-start'}`}
                title="Health"
              >
                <Stethoscope className={collapsed ? "" : "mr-2 h-4 w-4"} />
                {!collapsed && "Health"}
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

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Kennel Owners
                </h3>
              </div>
            )}
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
                COI Calculator
              </Button>
            </Link>

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Stud Services
                </h3>
              </div>
            )}
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
            <Link href="/dashboard/stud-services/1/receptionist">
              <Button
                variant={
                  pathname.includes("/receptionist") ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Receptionist
              </Button>
            </Link>

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Marketing
                </h3>
              </div>
            )}
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
            <Link href="/dashboard/website-templates">
              <Button
                variant={
                  pathname === "/dashboard/website-templates" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Kennel Website Templates
              </Button>
            </Link>

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Kennel Management
                </h3>
              </div>
            )}
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
                Kennel Marketplace
              </Button>
            </Link>

            {!collapsed && (
              <div className="mt-4 mb-2">
                <h3 className="text-sm font-medium gradient-text px-4 py-2">
                  Account
                </h3>
              </div>
            )}
            <Link href="/dashboard/settings">
              <Button
                variant={
                  pathname.startsWith("/dashboard/settings")
                    ? "default"
                    : "ghost"
                }
                className={`${collapsed ? 'sidebar-collapsed-btn' : 'w-full justify-start'} ${pathname.startsWith("/dashboard/settings") ? "btn-primary" : "hover:bg-[rgba(41,171,226,0.2)] hover:text-[#29ABE2]"}`}
                title="Settings"
              >
                <Settings className={collapsed ? "" : "mr-2 h-4 w-4"} />
                {!collapsed && "Settings"}
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 overflow-x-hidden">
          <ErrorBoundary>
            <DatabaseConnectionError />
            {isConnected && children}
          </ErrorBoundary>
        </main>

        {/* Mobile overlay when sidebar is open */}
        {isMobile && sidebarVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

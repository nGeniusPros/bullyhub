"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Dna,
  FileText,
  MessageSquare,
  Palette,
  PieChart,
  Plus,
  Sparkles,
} from "lucide-react";

export default function BreedingDashboardPage() {
  // AI features
  const aiFeatures = [
    {
      title: "AI Stud Receptionist",
      description: "Automate stud service inquiries with AI assistance",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/dashboard/stud-services",
      color: "bg-blue-500",
    },
    {
      title: "Color Prediction",
      description: "Predict puppy coat colors based on parents' genetics",
      icon: <Palette className="h-5 w-5" />,
      href: "/dashboard/breeding/color-prediction",
      color: "bg-amber-500",
    },
    {
      title: "COI Calculator",
      description: "Calculate Coefficient of Inbreeding for potential matings",
      icon: <PieChart className="h-5 w-5" />,
      href: "/dashboard/breeding/coi-calculator",
      color: "bg-green-500",
    },
    {
      title: "Breeding Planning",
      description: "Plan and manage your breeding program with AI assistance",
      icon: <Sparkles className="h-5 w-5" />,
      href: "/dashboard/breeding/planning",
      color: "bg-purple-500",
    },
  ];

  // Breeding tools
  const breedingTools = [
    {
      title: "Breeding Programs",
      description: "Manage your breeding programs and goals",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/breeding-programs",
      count: 2,
    },
    {
      title: "DNA Tests",
      description: "View and manage DNA test results",
      icon: <Dna className="h-5 w-5" />,
      href: "/dashboard/dna-tests",
      count: 5,
    },
    {
      title: "Compatibility Analysis",
      description: "Analyze breeding compatibility between dogs",
      icon: <Sparkles className="h-5 w-5" />,
      href: "/dashboard/breeding/compatibility",
      count: null,
    },
    {
      title: "Breeding Calendar",
      description: "View your breeding schedule and important dates",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/breeding/calendar",
      count: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Breeding Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your breeding program with AI-powered tools
          </p>
        </div>
        <Link href="/dashboard/breeding/planning">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Breeding Plan
          </Button>
        </Link>
      </div>

      {/* AI Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiFeatures.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div
                    className={`w-10 h-10 rounded-full ${feature.color} flex items-center justify-center text-white mb-2`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto"
                  >
                    <span className="text-sm text-primary">Open</span>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Breeding Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Breeding Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {breedingTools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {tool.icon}
                    </div>
                    {tool.count !== null && (
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        {tool.count}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto"
                  >
                    <span className="text-sm text-primary">Open</span>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Breeding Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-sm text-muted-foreground">
                Active breeding programs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Planned Breedings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">
                Upcoming breeding plans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stud Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-sm text-muted-foreground">
                Active stud services
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

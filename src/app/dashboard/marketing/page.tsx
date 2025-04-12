"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Users, 
  DollarSign, 
  BookOpen, 
  Award, 
  Palette, 
  Image, 
  FileText, 
  Video, 
  MessageSquare, 
  BarChart, 
  Calendar 
} from "lucide-react";

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Marketing Suite</h1>
        <p className="text-muted-foreground">
          Manage your kennel branding, client relationships, finances, and educational content
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="stud">Stud Marketing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Kennel Branding */}
            <Card>
              <CardHeader gradient="primary" className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kennel Branding</CardTitle>
                <Globe className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent className="bg-gradient-to-b from-white/80 to-primary-light/30 rounded-b-xl">
                <div className="text-2xl font-bold">Website Templates</div>
                <p className="text-xs text-muted-foreground">
                  Custom website templates, logo design tools, and social media kit
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/branding" className="w-full">
                  <Button className="w-full">Manage Branding</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Client Management */}
            <Card>
              <CardHeader gradient="primary" className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Client Management</CardTitle>
                <Users className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent className="bg-gradient-to-b from-white/80 to-primary-light/30 rounded-b-xl">
                <div className="text-2xl font-bold">Client Database</div>
                <p className="text-xs text-muted-foreground">
                  Track clients, prospects, and communication history
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/clients" className="w-full">
                  <Button className="w-full">Manage Clients</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Financial Management */}
            <Card>
              <CardHeader gradient="primary" className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Management</CardTitle>
                <DollarSign className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent className="bg-gradient-to-b from-white/80 to-primary-light/30 rounded-b-xl">
                <div className="text-2xl font-bold">Breeding Finances</div>
                <p className="text-xs text-muted-foreground">
                  Track expenses, income, and profitability for your breeding program
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/finances" className="w-full">
                  <Button className="w-full">Manage Finances</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Educational Content</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Content Creator</div>
                <p className="text-xs text-muted-foreground">
                  Generate articles, videos, and graphics explaining breeding practices
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/education" className="w-full">
                  <Button variant="outline" className="w-full">Manage Content</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Stud Marketing */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stud Marketing</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Stud Showcase</div>
                <p className="text-xs text-muted-foreground">
                  DNA-enhanced stud cards, production history, and promotion tools
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/stud" className="w-full">
                  <Button variant="outline" className="w-full">Manage Stud Marketing</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common marketing tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
                <Button variant="outline" className="justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Record Transaction
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Article
                </Button>
                <Button variant="outline" className="justify-start">
                  <Award className="mr-2 h-4 w-4" />
                  Update Stud Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Website Templates</CardTitle>
                <CardDescription>Customizable kennel website templates</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Globe className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/website-templates" className="w-full">
                  <Button className="w-full">Manage Website Templates</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo Designer</CardTitle>
                <CardDescription>Create custom logos for your kennel</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Palette className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/branding/logo" className="w-full">
                  <Button className="w-full">Design Logo</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Kit</CardTitle>
                <CardDescription>Generate social media assets</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Image className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/branding/social" className="w-full">
                  <Button className="w-full">Create Social Media Kit</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Client Database</CardTitle>
                <CardDescription>Manage your client information</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Users className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/clients/database" className="w-full">
                  <Button className="w-full">View Clients</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>Track client interactions</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/clients/communications" className="w-full">
                  <Button className="w-full">View Communications</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prospect Tracking</CardTitle>
                <CardDescription>Manage potential clients</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/clients/prospects" className="w-full">
                  <Button className="w-full">Track Prospects</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Income Tracking</CardTitle>
                <CardDescription>Record and analyze income</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <DollarSign className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/finances/income" className="w-full">
                  <Button className="w-full">Track Income</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>Record and categorize expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <DollarSign className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/finances/expenses" className="w-full">
                  <Button className="w-full">Track Expenses</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profitability Analysis</CardTitle>
                <CardDescription>Analyze breeding program profitability</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/finances/analysis" className="w-full">
                  <Button className="w-full">View Analysis</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Article Generator</CardTitle>
                <CardDescription>Create educational articles</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/education/articles" className="w-full">
                  <Button className="w-full">Create Articles</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Content</CardTitle>
                <CardDescription>Manage educational videos</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/education/videos" className="w-full">
                  <Button className="w-full">Manage Videos</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Graphics Generator</CardTitle>
                <CardDescription>Create educational graphics</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Image className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/education/graphics" className="w-full">
                  <Button className="w-full">Create Graphics</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Stud Marketing Tab */}
        <TabsContent value="stud" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>DNA-Enhanced Stud Cards</CardTitle>
                <CardDescription>Create visual profiles with DNA data</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Award className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/stud/cards" className="w-full">
                  <Button className="w-full">Create Stud Cards</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production History</CardTitle>
                <CardDescription>Showcase previous litters</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Calendar className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/stud/history" className="w-full">
                  <Button className="w-full">View Production History</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stud Promotion Tools</CardTitle>
                <CardDescription>Social media and marketing tools</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Image className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/marketing/stud/promotion" className="w-full">
                  <Button className="w-full">Promote Stud</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

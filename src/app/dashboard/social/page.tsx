"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Calendar, 
  MessageSquare, 
  Share2, 
  Image as ImageIcon,
  PlusCircle,
  History,
  Settings
} from "lucide-react";
import SocialMediaPost from "@/components/SocialMediaPost";

export default function SocialDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media</h1>
          <p className="text-muted-foreground">
            Manage your social media presence across platforms
          </p>
        </div>
        <Link href="/dashboard/social/analytics">
          <Button variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Post</CardTitle>
                <CardDescription>Share updates quickly</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => setActiveTab("create")}
                >
                  Create Post
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track your performance</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/social/analytics" className="w-full">
                  <Button className="w-full">View Analytics</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Plan your content</CardDescription>
              </CardHeader>
              <CardContent className="h-40 flex items-center justify-center">
                <Calendar className="h-16 w-16 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setActiveTab("schedule")}>
                  View Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest social media activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your recent posts will appear here. Start creating content to see your activity.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Social Media Post</CardTitle>
              <CardDescription>Share updates across your platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialMediaPost />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Manage your upcoming content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You don't have any scheduled posts. Create a post and schedule it for later to see it here.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule New Post
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

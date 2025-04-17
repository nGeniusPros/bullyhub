"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Dog, Dna, Heart, BookOpen } from "lucide-react";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-container space-y-6">
      <div className="welcome-header bg-info-gradient-3color">
        <div className="flex flex-col space-y-2 z-10 relative max-w-[60%]">
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to PetPals</h1>
          <p className="text-white/90">
            We're here to help you manage your pets with our comprehensive suite of tools and services.
          </p>
          <div className="mt-4">
            <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Explore Features
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="quick-action-card bg-primary-gradient-3color">
          <div className="quick-action-icon">
            <Dog className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">My Dogs</h3>
          <p className="text-sm text-white/80 mb-3">
            Manage your dogs and their profiles
          </p>
          <Link href="/dashboard/dogs" className="inline-block">
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              View all
            </Button>
          </Link>
        </div>

        <div className="quick-action-card bg-secondary-gradient-3color">
          <div className="quick-action-icon">
            <Dna className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">DNA Tests</h3>
          <p className="text-sm text-white/80 mb-3">
            View and manage DNA test results
          </p>
          <Link href="/dashboard/dna-tests" className="inline-block">
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              View all
            </Button>
          </Link>
        </div>

        <div className="quick-action-card bg-success-gradient-3color">
          <div className="quick-action-icon">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Stud Services</h3>
          <p className="text-sm text-white/80 mb-3">
            Manage your stud services
          </p>
          <Link href="/dashboard/stud-services" className="inline-block">
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              View all
            </Button>
          </Link>
        </div>

        <div className="quick-action-card bg-info-gradient-3color">
          <div className="quick-action-icon">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Health Records</h3>
          <p className="text-sm text-white/80 mb-3">
            Track health and medical records
          </p>
          <Link href="/dashboard/health" className="inline-block">
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              View all
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 mt-8">
        <h2 className="text-xl font-semibold">PetPals Dashboard</h2>
        <Button className="btn-gradient-3color">
          <Plus className="h-4 w-4" /> Add Pet
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="pet-card pet-card-gradient pet-card-gradient-primary">
          <div className="relative">
            <Image
              src="/assets/images/marketing/cartoon-1.png"
              alt="French Bulldog"
              className="pet-card-image"
              width={500}
              height={300}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Max</h3>
                <p className="text-sm text-muted-foreground">French Bulldog</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
            </div>

            <div className="pet-card-stats mt-4">
              <div className="pet-stat">
                <span className="pet-stat-value">2 yrs</span>
                <span className="pet-stat-label">Age</span>
              </div>
              <div className="pet-stat">
                <span className="pet-stat-value">24 lbs</span>
                <span className="pet-stat-label">Weight</span>
              </div>
              <div className="pet-stat">
                <span className="pet-stat-value">Male</span>
                <span className="pet-stat-label">Gender</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Health</span>
                  <span className="text-xs font-medium">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="progress-bar progress-bar-health" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Nutrition</span>
                  <span className="text-xs font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="progress-bar progress-bar-nutrition" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pet-card pet-card-gradient pet-card-gradient-secondary">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=300&q=80"
              alt="Golden Retriever"
              className="pet-card-image"
              width={500}
              height={300}
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Bella</h3>
                <p className="text-sm text-muted-foreground">Golden Retriever</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
            </div>

            <div className="pet-card-stats mt-4">
              <div className="pet-stat">
                <span className="pet-stat-value">3 yrs</span>
                <span className="pet-stat-label">Age</span>
              </div>
              <div className="pet-stat">
                <span className="pet-stat-value">65 lbs</span>
                <span className="pet-stat-label">Weight</span>
              </div>
              <div className="pet-stat">
                <span className="pet-stat-value">Female</span>
                <span className="pet-stat-label">Gender</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Health</span>
                  <span className="text-xs font-medium">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="progress-bar progress-bar-health" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Training</span>
                  <span className="text-xs font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="progress-bar progress-bar-training" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="activity-card activity-card-gradient">
          <div className="activity-card-header-3color">
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </div>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary-gradient p-2">
                  <Dna className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">DNA Test Uploaded</p>
                  <p className="text-xs text-muted-foreground">
                    You uploaded a new DNA test for Max
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-secondary-gradient p-2">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Stud Service Inquiry</p>
                  <p className="text-xs text-muted-foreground">
                    You received a new stud service inquiry
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">5 days ago</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-success-gradient p-2">
                  <Dog className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Dog Added</p>
                  <p className="text-xs text-muted-foreground">
                    You added a new dog to your profile
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">1 week ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="activity-card activity-card-gradient">
          <div className="activity-card-header-3color">
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </div>
          <CardContent className="pt-6">
            <div className="grid gap-2">
              <Link href="/dashboard/dogs/add">
                <Button className="w-full justify-start btn-gradient-3color text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add a New Dog
                </Button>
              </Link>
              <Link href="/dashboard/dna-tests/upload">
                <Button className="w-full justify-start btn-secondary-gradient-3color text-white">
                  <Dna className="mr-2 h-4 w-4" />
                  Upload DNA Test
                </Button>
              </Link>
              <Link href="/dashboard/stud-services/create">
                <Button className="w-full justify-start bg-success-gradient-3color text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Create Stud Service
                </Button>
              </Link>
              <Link href="/dashboard/breeding-programs/create">
                <Button className="w-full justify-start bg-info-gradient-3color text-white">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create Breeding Program
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

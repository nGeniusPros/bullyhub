"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Search,
  Filter,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useStudMarketing } from "@/hooks/useStudMarketing";
import { StudCard } from "@/components/marketing/stud-card";

export default function StudMarketing() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { studProfiles, loading, error, fetchStudProfiles } =
    useStudMarketing();

  // Filter studs based on active tab and search term
  const filteredStuds = studProfiles.filter((stud) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "available" && stud.availabilityCalendar?.isAvailable) ||
      (activeTab === "unavailable" && !stud.availabilityCalendar?.isAvailable);

    const matchesSearch =
      searchTerm === "" ||
      (stud.dog?.name &&
        stud.dog.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stud.dog?.color &&
        stud.dog.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stud.dog?.breed &&
        stud.dog.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stud.title &&
        stud.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Stud Marketing</h1>
        <p className="text-muted-foreground">
          Create and manage DNA-enhanced stud cards and marketing materials
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => fetchStudProfiles()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search studs..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Link href="/dashboard/marketing/stud/new">
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Stud Card
                </Button>
              </Link>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Studs</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredStuds.map((stud) => (
                  <StudCard key={stud.id} stud={stud} />
                ))}
                {filteredStuds.length === 0 && (
                  <div className="text-center py-10 col-span-2">
                    <Award className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No studs found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredStuds.map((stud) => (
                  <StudCard key={stud.id} stud={stud} />
                ))}
                {filteredStuds.length === 0 && (
                  <div className="text-center py-10 col-span-2">
                    <Award className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      No available studs found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new stud.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="unavailable" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {filteredStuds.map((stud) => (
                  <StudCard key={stud.id} stud={stud} />
                ))}
                {filteredStuds.length === 0 && (
                  <div className="text-center py-10 col-span-2">
                    <Award className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      No unavailable studs found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

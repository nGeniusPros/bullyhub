"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, AlertTriangle, FileText, Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { HealthClearance, HealthClearanceWithDog } from "../types";
import { useHealthClearanceQueries } from "../data/queries";

interface HealthClearanceListProps {
  dogId?: string;
  showAddButton?: boolean;
  limit?: number;
}

export default function HealthClearanceList({
  dogId,
  showAddButton = true,
  limit,
}: HealthClearanceListProps) {
  const [clearances, setClearances] = useState<HealthClearanceWithDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const healthClearanceQueries = useHealthClearanceQueries();

  // Fetch health clearances
  useEffect(() => {
    const fetchClearances = async () => {
      setLoading(true);
      try {
        let data;
        if (dogId) {
          data = await healthClearanceQueries.getDogHealthClearances(dogId);
        } else {
          data = await healthClearanceQueries.getUserHealthClearances();
        }

        // Apply limit if specified
        if (limit && data.length > limit) {
          data = data.slice(0, limit);
        }

        setClearances(data);
      } catch (error) {
        console.error("Error fetching health clearances:", error);
        toast.error("Failed to load health clearances");
      } finally {
        setLoading(false);
      }
    };

    fetchClearances();
  }, [dogId, limit]);

  // Filter clearances based on active tab
  const filteredClearances = clearances.filter((clearance) => {
    if (activeTab === "all") return true;
    if (activeTab === "passed") return clearance.status === "passed";
    if (activeTab === "pending") return clearance.status === "pending";
    if (activeTab === "failed") return clearance.status === "failed";
    if (activeTab === "expiring") {
      if (!clearance.expiry_date) return false;
      const expiryDate = new Date(clearance.expiry_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return expiryDate > now && expiryDate < thirtyDaysFromNow;
    }
    return true;
  });

  // Get counts for each status
  const counts = {
    all: clearances.length,
    passed: clearances.filter((c) => c.status === "passed").length,
    pending: clearances.filter((c) => c.status === "pending").length,
    failed: clearances.filter((c) => c.status === "failed").length,
    expiring: clearances.filter((c) => {
      if (!c.expiry_date) return false;
      const expiryDate = new Date(c.expiry_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return expiryDate > now && expiryDate < thirtyDaysFromNow;
    }).length,
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Passed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Check if a clearance is expiring soon
  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return expiry > now && expiry < thirtyDaysFromNow;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Health Clearances</h2>
        {showAddButton && (
          <Link href={dogId ? `/dashboard/health-clearances/new?dogId=${dogId}` : "/dashboard/health-clearances/new"}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Clearance
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="passed">
            Passed ({counts.passed})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({counts.failed})
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring ({counts.expiring})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredClearances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No health clearances found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClearances.map((clearance) => (
                <Link
                  key={clearance.id}
                  href={`/dashboard/health-clearances/${clearance.id}`}
                >
                  <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{clearance.test}</CardTitle>
                          <CardDescription>
                            {clearance.dog?.name || "Unknown Dog"}
                          </CardDescription>
                        </div>
                        {getStatusBadge(clearance.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(clearance.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Result: {clearance.result}</span>
                        </div>
                        {clearance.expiry_date && (
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className={isExpiringSoon(clearance.expiry_date) ? "text-amber-600 font-medium" : ""}>
                              Expires: {format(new Date(clearance.expiry_date), "MMM d, yyyy")}
                              {isExpiringSoon(clearance.expiry_date) && " (Soon)"}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

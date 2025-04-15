"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  AlertCircle,
  DollarSign,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { StudServiceWithDog } from "../types";
import { useStudServiceQueries } from "../data/queries";
import { formatCurrency } from "@/lib/utils";

interface StudServiceListProps {
  showAddButton?: boolean;
  limit?: number;
}

export default function StudServiceList({
  showAddButton = true,
  limit,
}: StudServiceListProps) {
  const [services, setServices] = useState<StudServiceWithDog[]>([]);
  const [filteredServices, setFilteredServices] = useState<StudServiceWithDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const studServiceQueries = useStudServiceQueries();

  // Fetch stud services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await studServiceQueries.getAllStudServices();
        
        // Apply limit if specified
        const limitedData = limit ? data.slice(0, limit) : data;
        
        setServices(limitedData);
        setFilteredServices(limitedData);
      } catch (error) {
        console.error("Error fetching stud services:", error);
        toast.error("Failed to load stud services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit]);

  // Filter services based on search term and active tab
  useEffect(() => {
    let filtered = [...services];
    
    // Apply tab filter
    if (activeTab === "available") {
      filtered = filtered.filter(service => service.availability);
    } else if (activeTab === "unavailable") {
      filtered = filtered.filter(service => !service.availability);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.stud?.name?.toLowerCase().includes(term) ||
        service.stud?.breed?.toLowerCase().includes(term) ||
        service.stud?.color?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredServices(filtered);
  }, [services, searchTerm, activeTab]);

  // Subscribe to stud services changes
  useEffect(() => {
    const subscription = studServiceQueries.subscribeToStudServices(
      (payload) => {
        // Refresh the list when changes occur
        studServiceQueries.getAllStudServices()
          .then(data => {
            const limitedData = limit ? data.slice(0, limit) : data;
            setServices(limitedData);
          })
          .catch(error => {
            console.error("Error refreshing stud services:", error);
          });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [limit]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Stud Services</h2>
          <p className="text-muted-foreground">
            Manage your stud services and inquiries
          </p>
        </div>
        {showAddButton && (
          <Link href="/dashboard/stud-services/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Service
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stud services..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No stud services found</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first stud service to get started"}
              </p>
              {showAddButton && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/stud-services/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Service
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{service.stud?.name || "Unnamed Stud"}</CardTitle>
                        <CardDescription>
                          {service.stud?.breed || "Unknown breed"}, {service.stud?.color || "Unknown color"}
                        </CardDescription>
                      </div>
                      <Badge variant={service.availability ? "default" : "secondary"}>
                        {service.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Stud Fee</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(service.fee)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {service.description && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    )}
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>AI Receptionist Available</span>
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Link href={`/dashboard/stud-services/${service.id}`}>
                      <Button variant="outline" size="sm">
                        <Activity className="mr-2 h-4 w-4" />
                        Manage Service
                      </Button>
                    </Link>
                    <Link href={`/dashboard/stud-services/${service.id}/receptionist`}>
                      <Button variant="secondary" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        AI Receptionist
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

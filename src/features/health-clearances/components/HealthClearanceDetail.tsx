"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Calendar, CheckCircle, Clock, Download, ExternalLink, FileText, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { HealthClearance, HealthClearanceWithDog } from "../types";
import { useHealthClearanceQueries } from "../data/queries";

interface HealthClearanceDetailProps {
  clearanceId: string;
}

export default function HealthClearanceDetail({ clearanceId }: HealthClearanceDetailProps) {
  const router = useRouter();
  const [clearance, setClearance] = useState<HealthClearanceWithDog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const healthClearanceQueries = useHealthClearanceQueries();

  // Fetch health clearance details
  useEffect(() => {
    const fetchClearance = async () => {
      setLoading(true);
      try {
        const data = await healthClearanceQueries.getHealthClearance(clearanceId);
        setClearance(data);
      } catch (error) {
        console.error("Error fetching health clearance:", error);
        toast.error("Failed to load health clearance details");
      } finally {
        setLoading(false);
      }
    };

    if (clearanceId) {
      fetchClearance();
    }
  }, [clearanceId]);

  // Handle delete
  const handleDelete = async () => {
    if (!clearance) return;

    setDeleting(true);
    try {
      await healthClearanceQueries.deleteHealthClearance(clearance.id);
      toast.success("Health clearance deleted successfully");
      router.push("/dashboard/health-clearances");
    } catch (error) {
      console.error("Error deleting health clearance:", error);
      toast.error("Failed to delete health clearance");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
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

  // Check if a clearance is expired
  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!clearance) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Health Clearance Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The health clearance you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/health-clearances")}>
          Back to Health Clearances
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{clearance.test}</h1>
          <p className="text-muted-foreground">
            Health clearance for {clearance.dog?.name || "Unknown Dog"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/health-clearances")}>
            Back
          </Button>
          <Link href={`/dashboard/health-clearances/${clearance.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Health Clearance</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this health clearance? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Clearance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge(clearance.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Test Date:</span>
                    <span>{format(new Date(clearance.date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Result:</span>
                    <span>{clearance.result}</span>
                  </div>
                  {clearance.expiry_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className={isExpired(clearance.expiry_date) ? "text-red-600 font-medium" : ""}>
                        {format(new Date(clearance.expiry_date), "MMMM d, yyyy")}
                        {isExpired(clearance.expiry_date) && " (Expired)"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dog:</span>
                    <span>{clearance.dog?.name || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breed:</span>
                    <span>{clearance.dog?.breed || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span>{clearance.dog?.color || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(clearance.created_at), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {clearance.notes && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{clearance.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isExpired(clearance.expiry_date) && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Expired Health Clearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  This health clearance has expired. Please schedule a new test to maintain your dog's health records.
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/health-clearances/new?dogId=${clearance.dog_id}`}>
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-100">
                    Schedule New Test
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                View and download test certificates and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!clearance.documents || clearance.documents.length === 0 ? (
                <p className="text-muted-foreground">No documents have been uploaded for this health clearance.</p>
              ) : (
                <div className="space-y-2">
                  {clearance.documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Document {index + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={document} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={document} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/health-clearances/${clearance.id}/edit`}>
                <Button variant="outline">
                  Upload Documents
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Information</CardTitle>
              <CardDescription>
                Details for verifying this health clearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Verification Number</h3>
                <p className="text-lg font-mono">{clearance.verification_number}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Verification Instructions</h3>
                <p className="text-sm text-muted-foreground">
                  To verify this health clearance, use the verification number above with one of the following methods:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Visit the verification page at <Link href="/verify-health-clearance" className="text-primary hover:underline">bullyhub.com/verify-health-clearance</Link></li>
                  <li>Contact the testing facility directly and provide the verification number</li>
                  <li>Scan the QR code below (if available)</li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Verification QR Code</h3>
                <div className="flex justify-center">
                  <div className="w-40 h-40 bg-muted flex items-center justify-center">
                    <p className="text-xs text-center text-muted-foreground">QR Code Placeholder</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

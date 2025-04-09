"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { HealthRecordForm } from "@/components/HealthRecordForm";
import {
  Activity,
  Calendar,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Pill,
  Thermometer,
  Heart,
  Weight,
  Ruler,
} from "lucide-react";

interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  dateOfBirth: string;
  profileImageUrl?: string;
}

interface HealthRecord {
  id: string;
  dog_id: string;
  record_date: string;
  record_type: string;
  description: string;
  provider: string;
  results: string;
  notes: string;
  documents: string[];
  created_at: string;
}

export default function DogHealthPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "medications">("overview");

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await fetch(`/api/dogs/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dog");
        }
        const data = await response.json();
        setDog(data);
      } catch (error) {
        console.error("Error fetching dog:", error);
        toast.error("Failed to load dog profile");
      }
    };

    const fetchHealthRecords = async () => {
      try {
        const response = await fetch(`/api/health-records?dogId=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch health records");
        }
        const data = await response.json();
        setHealthRecords(data);
      } catch (error) {
        console.error("Error fetching health records:", error);
        toast.error("Failed to load health records");
      }
    };

    const fetchMedications = async () => {
      try {
        const response = await fetch(`/api/medications?dogId=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        const data = await response.json();
        setMedications(data);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast.error("Failed to load medications");
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
    fetchHealthRecords();
    fetchMedications();
  }, [params.id]);

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this health record? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/health-records/${recordId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete health record");
      }

      setHealthRecords(healthRecords.filter(record => record.id !== recordId));
      toast.success("Health record deleted successfully");
    } catch (error) {
      console.error("Error deleting health record:", error);
      toast.error("Failed to delete health record");
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "examination":
        return <Activity className="h-4 w-4" />;
      case "vaccination":
        return <FileText className="h-4 w-4" />;
      case "procedure":
        return <Thermometer className="h-4 w-4" />;
      case "lab_test":
        return <FileText className="h-4 w-4" />;
      case "injury":
        return <Heart className="h-4 w-4" />;
      case "illness":
        return <Thermometer className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case "examination":
        return "Examination";
      case "vaccination":
        return "Vaccination";
      case "procedure":
        return "Procedure";
      case "lab_test":
        return "Lab Test";
      case "injury":
        return "Injury";
      case "illness":
        return "Illness";
      default:
        return "Other";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Dog Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The dog you're looking for doesn't exist or you don't have permission
          to view it.
        </p>
        <Link href="/dashboard/dogs">
          <Button>Back to My Dogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dog.name}'s Health</h1>
          <p className="text-muted-foreground">
            Manage health records, medications, and wellness information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/dogs/${params.id}`)}>
            Back to Profile
          </Button>
          <Link href={`/dashboard/health/add?dogId=${params.id}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <Button
          variant={activeTab === "overview" ? "default" : "outline"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === "records" ? "default" : "outline"}
          onClick={() => setActiveTab("records")}
        >
          Health Records
        </Button>
        <Button
          variant={activeTab === "medications" ? "default" : "outline"}
          onClick={() => setActiveTab("medications")}
        >
          Medications
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-primary mr-2" />
                  <span>Health Records</span>
                </div>
                <Badge>{healthRecords.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Pill className="h-5 w-5 text-primary mr-2" />
                  <span>Active Medications</span>
                </div>
                <Badge>{medications.filter(med => med.is_active).length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span>Last Checkup</span>
                </div>
                <span className="text-sm">
                  {healthRecords.filter(record => record.record_type === "examination").length > 0
                    ? new Date(
                        healthRecords
                          .filter(record => record.record_type === "examination")
                          .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())[0]
                          .record_date
                      ).toLocaleDateString()
                    : "None"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {healthRecords.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No health records found.</p>
                  <p className="text-sm">Add a health record to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {healthRecords
                    .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
                    .slice(0, 3)
                    .map((record) => (
                      <div
                        key={record.id}
                        className="flex items-start p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <div className="mr-3 mt-0.5">
                          {getRecordTypeIcon(record.record_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{record.description}</span>
                              <Badge variant="outline" className="ml-2">
                                {getRecordTypeLabel(record.record_type)}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(record.record_date).toLocaleDateString()}
                            </span>
                          </div>
                          {record.provider && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Provider: {record.provider}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "records" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Health Records</CardTitle>
              <Link href={`/dashboard/health/add?dogId=${params.id}`}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {healthRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                <p>No health records found.</p>
                <p className="text-sm">Add a health record to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {healthRecords
                  .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
                  .map((record) => (
                    <div
                      key={record.id}
                      className="flex items-start p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="mr-4 mt-0.5">
                        {getRecordTypeIcon(record.record_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium">{record.description}</span>
                            <Badge variant="outline" className="ml-2">
                              {getRecordTypeLabel(record.record_type)}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.record_date).toLocaleDateString()}
                          </span>
                        </div>
                        {record.provider && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Provider: {record.provider}
                          </p>
                        )}
                        {record.results && (
                          <p className="text-sm mt-2">{record.results}</p>
                        )}
                        <div className="flex justify-end mt-2 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecord(record.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "medications" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Medications</CardTitle>
              <Link href={`/dashboard/health/medications/add?dogId=${params.id}`}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                <p>No medications found.</p>
                <p className="text-sm">Add a medication to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medications
                  .sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1))
                  .map((medication) => (
                    <div
                      key={medication.id}
                      className="p-4 border rounded-md hover:bg-muted/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Pill className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium">{medication.name}</span>
                            <Badge
                              variant={medication.is_active ? "default" : "outline"}
                              className="ml-2"
                            >
                              {medication.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {medication.dosage} • {medication.frequency}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(medication.start_date).toLocaleDateString()}
                          {medication.end_date && ` - ${new Date(medication.end_date).toLocaleDateString()}`}
                        </div>
                      </div>
                      {medication.notes && (
                        <p className="text-sm mt-2">{medication.notes}</p>
                      )}
                      <div className="flex justify-end mt-2 space-x-2">
                        <Link href={`/dashboard/health/medications/edit/${medication.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Health Record Detail Dialog */}
      {selectedRecord && (
        <Dialog
          open={!!selectedRecord && !showEditDialog}
          onOpenChange={(open) => !open && setSelectedRecord(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Health Record Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Badge variant="outline">
                  {getRecordTypeLabel(selectedRecord.record_type)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedRecord.record_date).toLocaleDateString()}
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{selectedRecord.description}</h3>
                {selectedRecord.provider && (
                  <p className="text-sm text-muted-foreground">
                    Provider: {selectedRecord.provider}
                  </p>
                )}
              </div>
              
              {selectedRecord.results && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Results</h4>
                  <p>{selectedRecord.results}</p>
                </div>
              )}
              
              {selectedRecord.notes && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Notes</h4>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
              
              {selectedRecord.documents && selectedRecord.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedRecord.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span className="truncate flex-1">{doc.split("/").pop()}</span>
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteRecord(selectedRecord.id);
                    setSelectedRecord(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Health Record Dialog */}
      {selectedRecord && showEditDialog && (
        <Dialog
          open={showEditDialog}
          onOpenChange={(open) => {
            if (!open) {
              setShowEditDialog(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Health Record</DialogTitle>
            </DialogHeader>
            <HealthRecordForm
              dogId={params.id}
              existingRecord={selectedRecord}
              onSuccess={() => {
                setShowEditDialog(false);
                setSelectedRecord(null);
                // Refresh health records
                fetch(`/api/health-records?dogId=${params.id}`)
                  .then(response => response.json())
                  .then(data => setHealthRecords(data))
                  .catch(error => console.error("Error refreshing health records:", error));
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

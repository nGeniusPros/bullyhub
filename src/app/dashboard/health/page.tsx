"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Calendar,
  Pill,
  Dog,
  FileText,
  Activity,
  Thermometer,
  Heart,
  Wind,
  Plus,
  Search,
  Filter,
  Syringe,
  AlertCircle,
} from "lucide-react";
import { HealthRecord, Medication } from "@/lib/database";

interface DogWithHealthData {
  id: string;
  name: string;
  breed: string;
  healthRecords: HealthRecord[];
  medications: Medication[];
  vaccinations: any[];
}

export default function HealthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "records" | "medications" | "vaccinations"
  >("overview");
  const [selectedMetric, setSelectedMetric] = useState<string>("weight");
  const [dogs, setDogs] = useState<DogWithHealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const userId = "REPLACE_WITH_AUTH_USER_ID"; // TODO: dynamically get logged-in user id

        const dogsResponse = await fetch(`/api/get-dogs?user_id=${userId}`);
        if (!dogsResponse.ok) throw new Error("Failed to fetch dogs");
        const dogsData = await dogsResponse.json();

        const dogsWithHealth = await Promise.all(
          (dogsData || []).map(async (dog: any) => {
            // Fetch health records
            const healthResponse = await fetch(
              `/api/get-health-records?dog_id=${dog.id}`
            );
            const healthData = healthResponse.ok
              ? await healthResponse.json()
              : [];

            // Fetch vaccinations
            const vaxResponse = await fetch(
              `/api/get-vaccinations?dog_id=${dog.id}`
            );
            const vaccinationsData = vaxResponse.ok
              ? await vaxResponse.json()
              : [];

            // Placeholder for medications
            const medData: any[] = [];

            return {
              ...dog,
              healthRecords: healthData,
              medications: medData,
              vaccinations: (vaccinationsData || []).map((vax: any) => ({
                id: vax.id,
                name: vax.vaccine_name,
                date: vax.date_administered,
                nextDue: vax.next_due_date,
              })),
            };
          })
        );

        setDogs(dogsWithHealth);
        if (dogsWithHealth.length > 0) {
          setSelectedDog(dogsWithHealth[0].id);
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
        toast.error("Failed to load health data");
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const healthTips = [
    {
      title: "Regular Check-ups",
      description:
        "Schedule veterinary visits every 6 months for preventive care.",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      title: "Nutrition Guide",
      description: "Balanced diet for age, size, and activity level.",
      icon: <Pill className="w-4 h-4" />,
    },
    {
      title: "Exercise & Activity",
      description: "Track daily exercise and ensure enough activity.",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      title: "Emergency Care",
      description: "Know signs of health issues and emergency steps.",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  // Get the selected dog's data
  const selectedDogData = dogs.find((dog) => dog.id === selectedDog);

  // Filter health records based on search term
  const filteredRecords =
    selectedDogData?.healthRecords.filter(
      (record) =>
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.record_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Filter medications based on search term
  const filteredMedications =
    selectedDogData?.medications.filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.dosage.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Filter vaccinations based on search term
  const filteredVaccinations =
    selectedDogData?.vaccinations.filter((vax) =>
      vax.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to check if a vaccination is due soon (within 30 days)
  const isVaccinationDueSoon = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Tracker</h1>
          <p className="text-muted-foreground">
            Monitor and manage your dogs' health
          </p>
        </div>
        <Link href="/dashboard/health/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : dogs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Dogs Found</h3>
            <p className="text-muted-foreground mb-4">
              You need to add a dog before you can track health records.
            </p>
            <Link href="/dashboard/dogs/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Dog
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <Select value={selectedDog} onValueChange={setSelectedDog}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select a dog" />
                </SelectTrigger>
                <SelectContent>
                  {dogs.map((dog) => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search health records..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab as any}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Health Records</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {selectedDogData && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {selectedDogData.name}'s Health Summary
                    </CardTitle>
                    <CardDescription>
                      Overview of health records, medications, and upcoming
                      vaccinations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">Health Records</span>
                      </div>
                      <Badge>{selectedDogData.healthRecords.length}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedDogData.healthRecords.length > 0
                          ? `Last record: ${formatDate(
                              selectedDogData.healthRecords[0].record_date
                            )}`
                          : "No records yet"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        <span className="font-medium">Active Medications</span>
                      </div>
                      <Badge>
                        {
                          selectedDogData.medications.filter((m) => m.is_active)
                            .length
                        }
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedDogData.medications.filter((m) => m.is_active)
                          .length > 0
                          ? `${
                              selectedDogData.medications.filter(
                                (m) => m.is_active
                              ).length
                            } active medications`
                          : "No active medications"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-5 w-5 text-primary" />
                        <span className="font-medium">Vaccinations</span>
                      </div>
                      <Badge>{selectedDogData.vaccinations.length}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedDogData.vaccinations.some((v) =>
                          isVaccinationDueSoon(v.nextDue)
                        )
                          ? "Vaccinations due soon"
                          : "All vaccinations up to date"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthTips.map((tip, idx) => (
                  <Card key={idx} className="p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      {tip.icon}
                      {tip.title}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="records">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Health Records</h2>
                <Link
                  href={`/dashboard/health/add${
                    selectedDog ? `?dogId=${selectedDog}` : ""
                  }`}
                >
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Button>
                </Link>
              </div>

              {filteredRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Health Records
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No records match your search criteria."
                        : "Add your first health record to start tracking."}
                    </p>
                    {!searchTerm && (
                      <Link
                        href={`/dashboard/health/add${
                          selectedDog ? `?dogId=${selectedDog}` : ""
                        }`}
                      >
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Health Record
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <Card
                      key={record.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {record.record_type}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {record.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatDate(record.record_date)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/health/records/${record.id}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="medications">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medications</h2>
                <Link
                  href={`/dashboard/health/medications/add${
                    selectedDog ? `?dogId=${selectedDog}` : ""
                  }`}
                >
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </Link>
              </div>

              {filteredMedications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Medications</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No medications match your search criteria."
                        : "Add your first medication to start tracking."}
                    </p>
                    {!searchTerm && (
                      <Link
                        href={`/dashboard/health/medications/add${
                          selectedDog ? `?dogId=${selectedDog}` : ""
                        }`}
                      >
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Medication
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredMedications.map((medication) => (
                    <Card
                      key={medication.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {medication.name}
                              </h3>
                              <Badge
                                variant={
                                  medication.is_active ? "default" : "secondary"
                                }
                              >
                                {medication.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} - {medication.frequency}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Started: {formatDate(medication.start_date)}
                                </span>
                              </div>
                              {medication.end_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Ends: {formatDate(medication.end_date)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/health/medications/edit/${medication.id}`
                                )
                              }
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vaccinations">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vaccinations</h2>
                <Button size="sm" disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccination (Coming Soon)
                </Button>
              </div>

              {filteredVaccinations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Syringe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Vaccinations
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No vaccinations match your search criteria."
                        : "Vaccination tracking coming soon."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredVaccinations.map((vaccination) => (
                    <Card
                      key={vaccination.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {vaccination.name}
                              </h3>
                              <Badge
                                variant={
                                  isVaccinationDueSoon(vaccination.nextDue)
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {isVaccinationDueSoon(vaccination.nextDue)
                                  ? "Due Soon"
                                  : "Up to Date"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Last: {formatDate(vaccination.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Next Due: {formatDate(vaccination.nextDue)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

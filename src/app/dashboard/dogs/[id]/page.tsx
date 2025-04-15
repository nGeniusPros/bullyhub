"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dog } from "@/types";
import Link from "next/link";
import { DogProfileImageUpload } from "@/features/dogs/components/DogProfileImageUpload";
import {
  Activity,
  Calendar,
  Dna,
  Edit,
  GitBranch,
  Heart,
  Medal,
  Pill,
  Trash2,
  Camera,
  Image as ImageIcon,
  Ruler,
  Tag,
  FileText,
} from "lucide-react";

export default function DogProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [params.id]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this dog? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/dogs/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dog");
      }

      toast.success("Dog deleted successfully");
      router.push("/dashboard/dogs");
    } catch (error) {
      console.error("Error deleting dog:", error);
      toast.error("Failed to delete dog");
    } finally {
      setDeleting(false);
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
          <h1 className="text-3xl font-bold tracking-tight">{dog.name}</h1>
          <p className="text-muted-foreground">
            {dog.breed} • {dog.color}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/dogs")}
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/dogs/edit/${params.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DogProfileImageUpload
              dogId={params.id}
              currentImageUrl={dog.profileImageUrl}
              onImageUploaded={(url) => {
                setDog((prev) =>
                  prev ? { ...prev, profileImageUrl: url } : null
                );
              }}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Basic Information
              </h3>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </span>
                <span>{new Date(dog.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Age
                </span>
                <span>{calculateAge(dog.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Sex
                </span>
                <span>{dog.isStud ? "Male" : "Female"}</span>
              </div>
              {dog.breeding_program_id && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Breeding Program
                  </span>
                  <Link
                    href={`/dashboard/breeding-programs/${dog.breeding_program_id}`}
                    className="text-primary hover:underline"
                  >
                    {dog.breeding_program_name}
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Additional Details
              </h3>
              {dog.weight && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Weight
                  </span>
                  <span>{dog.weight} lbs</span>
                </div>
              )}
              {dog.height && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Height
                  </span>
                  <span>{dog.height} inches</span>
                </div>
              )}
              {dog.microchipNumber && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Microchip
                  </span>
                  <span>{dog.microchipNumber}</span>
                </div>
              )}
              {dog.registrationNumber && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Registration
                  </span>
                  <span>{dog.registrationNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/dashboard/dogs/${params.id}/pedigree`}>
                  <Button variant="outline" className="w-full">
                    <GitBranch className="mr-2 h-4 w-4" />
                    Pedigree
                  </Button>
                </Link>
                <Link href={`/dashboard/dna-tests/upload?dogId=${params.id}`}>
                  <Button variant="outline" className="w-full">
                    <Dna className="mr-2 h-4 w-4" />
                    DNA Test
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/health-clearances/add?dogId=${params.id}`}
                >
                  <Button variant="outline" className="w-full">
                    <Medal className="mr-2 h-4 w-4" />
                    Health Clearance
                  </Button>
                </Link>
                <Link href={`/dashboard/health/${params.id}`}>
                  <Button variant="outline" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    Health Record
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="dna">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Records & Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="dna">DNA Tests</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="breeding">Breeding</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="dna" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">DNA Test Results</h3>
                  <Link href={`/dashboard/dna-tests/upload?dogId=${params.id}`}>
                    <Button variant="outline" size="sm">
                      Upload Test
                    </Button>
                  </Link>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Dna className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No DNA tests found for this dog.</p>
                  <p className="text-sm">
                    Upload a DNA test to see genetic and health markers.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Health Records</h3>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/health/${params.id}`}>
                      <Button variant="outline" size="sm">
                        View All Records
                      </Button>
                    </Link>
                    <Link href={`/dashboard/health/add?dogId=${params.id}`}>
                      <Button variant="outline" size="sm">
                        Add Record
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Health Clearances
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4 text-muted-foreground">
                        <Medal className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p className="text-sm">No health clearances found.</p>
                      </div>
                      <Link
                        href={`/dashboard/health-clearances/add?dogId=${params.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Add Clearance
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Medications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4 text-muted-foreground">
                        <Pill className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p className="text-sm">No medications found.</p>
                      </div>
                      <Link
                        href={`/dashboard/health/medications/add?dogId=${params.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          Add Medication
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Appointments</h3>
                  <Link
                    href={`/dashboard/appointments/schedule?dogId=${params.id}`}
                  >
                    <Button variant="outline" size="sm">
                      Schedule Appointment
                    </Button>
                  </Link>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No appointments found for this dog.</p>
                  <p className="text-sm">
                    Schedule appointments for veterinary visits, grooming, and
                    more.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Photo Gallery</h3>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/gallery/dog/${params.id}`}>
                      <Button variant="outline" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        View Gallery
                      </Button>
                    </Link>
                    <Link href={`/dashboard/gallery/upload?dogId=${params.id}`}>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photos
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No photos found for this dog.</p>
                  <p className="text-sm">
                    Upload photos to create a gallery for your dog.
                  </p>
                  <div className="mt-4">
                    <Link href={`/dashboard/gallery/dog/${params.id}`}>
                      <Button variant="outline">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        View Gallery
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breeding" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Breeding History</h3>
                  {dog.isStud ? (
                    <Link
                      href={`/dashboard/stud-services/add?dogId=${params.id}`}
                    >
                      <Button variant="outline" size="sm">
                        Add Stud Service
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/litters/add?damId=${params.id}`}>
                      <Button variant="outline" size="sm">
                        Record Litter
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No breeding history found for this dog.</p>
                  <p className="text-sm">
                    {dog.isStud
                      ? "Add stud services to track breeding history."
                      : "Record litters to track breeding history."}
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function calculateAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }`;
  }
}

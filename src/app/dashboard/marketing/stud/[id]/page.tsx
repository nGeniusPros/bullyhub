"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Award,
  Calendar,
  Dna,
  Heart,
  Palette,
  Trash,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  Dog,
  User,
  Image,
  Share2,
  Download,
  CheckCircle,
} from "lucide-react";
import { useStudMarketing } from "@/hooks/useStudMarketing";
import { StudMarketing, Dog as DogType } from "@/types";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { DNAVisualization } from "@/components/marketing/dna-visualization";
import { formatCurrency } from "@/lib/utils";

// Mock DNA data for demonstration
const mockDnaData = {
  colorGenes: [
    {
      name: "Dilution (D Locus)",
      locus: "D/d",
      genotype: "d/d",
      phenotype: "Blue",
      description: "The dilution gene affects black pigment, turning it to blue/gray when two copies are present."
    },
    {
      name: "Brown (B Locus)",
      locus: "B/b",
      genotype: "B/B",
      phenotype: "Non-Brown",
      description: "The dog does not carry the brown gene and will not produce brown/chocolate puppies."
    },
    {
      name: "Agouti (A Locus)",
      locus: "A/a",
      genotype: "a/a",
      phenotype: "Recessive Black",
      description: "The dog has two copies of recessive black, which allows other color genes to be expressed."
    },
    {
      name: "Extension (E Locus)",
      locus: "E/e",
      genotype: "E/e",
      phenotype: "Black Mask",
      description: "The dog has one copy of the dominant black mask gene and can pass it to 50% of offspring."
    }
  ],
  healthGenes: [
    {
      name: "Degenerative Myelopathy",
      genotype: "N/N",
      status: "clear",
      description: "This dog is clear of the mutation that causes Degenerative Myelopathy and will not develop the disease.",
      severity: "high"
    },
    {
      name: "Exercise-Induced Collapse",
      genotype: "N/EIC",
      status: "carrier",
      description: "This dog carries one copy of the EIC mutation but will not show symptoms. Can pass to 50% of offspring.",
      severity: "medium"
    },
    {
      name: "Progressive Retinal Atrophy",
      genotype: "N/N",
      status: "clear",
      description: "This dog is clear of the PRA mutation and will not develop this form of blindness.",
      severity: "medium"
    }
  ],
  traitGenes: [
    {
      name: "Body Size (IGF1)",
      genotype: "N/N",
      phenotype: "Standard",
      description: "This dog has the genetic markers for standard size rather than miniature or toy variants."
    },
    {
      name: "Coat Length",
      genotype: "S/S",
      phenotype: "Short Coat",
      description: "This dog has two copies of the short coat gene and will always have a short coat."
    },
    {
      name: "Ear Carriage",
      genotype: "E/E",
      phenotype: "Erect Ears",
      description: "This dog has the genetic markers for naturally erect ears."
    }
  ],
  coi: 6.25,
  prepotency: 78.4
};

export default function StudProfileDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { studProfiles, loading, error, getStudProfileById, updateStudProfile, deleteStudProfile } = useStudMarketing();
  const [studProfile, setStudProfile] = useState<(StudMarketing & { dog?: DogType }) | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch stud profile
  useEffect(() => {
    const fetchStudProfile = async () => {
      const profile = await getStudProfileById(params.id);
      if (profile) {
        setStudProfile(profile);
      }
    };

    fetchStudProfile();
  }, [params.id, getStudProfileById]);

  const handleDeleteProfile = async () => {
    if (!studProfile) return;

    if (window.confirm("Are you sure you want to delete this stud profile? This action cannot be undone.")) {
      const success = await deleteStudProfile(studProfile.id);
      if (success) {
        toast({
          title: "Success",
          description: "Stud profile deleted successfully",
        });
        router.push("/dashboard/marketing/stud");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !studProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Error</h3>
          </div>
          <p>{error || "Stud profile not found"}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/dashboard/marketing/stud")}
          >
            Back to Stud Profiles
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/marketing/stud")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {studProfile.dog?.name || "Stud Profile"}
          </h1>
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {studProfile.dog?.breed || "American Bully"}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteProfile}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={studProfile.dog?.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee"} 
                alt={studProfile.dog?.name || "Stud"} 
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {studProfile.successMetrics?.successRate || "95"}%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {studProfile.successMetrics?.litterCount || "8"}
                  </div>
                  <div className="text-xs text-muted-foreground">Litters</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Stud Fee:</span>
                  </div>
                  <span className="font-bold text-lg">
                    {formatCurrency(studProfile.feeStructure?.baseFee || 2000)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Age:</span>
                  <span className="ml-2">
                    {studProfile.dog?.dateOfBirth 
                      ? `${Math.floor((new Date().getTime() - new Date(studProfile.dog.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years` 
                      : "3 years"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Color:</span>
                  <span className="ml-2">{studProfile.dog?.color || "Blue"}</span>
                </div>
                {studProfile.colorGenetics?.mainColor && (
                  <div className="flex items-center">
                    <Dna className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Color Genetics:</span>
                    <span className="ml-2">{studProfile.colorGenetics.mainColor}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex flex-wrap gap-2">
                {studProfile.healthClearances?.tests?.map((test: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {test}
                  </Badge>
                )) || (
                  <>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      OFA Hips
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      OFA Elbows
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Cardiac
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      BAER
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Card
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dna">DNA Profile</TabsTrigger>
              <TabsTrigger value="production">Production History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{studProfile.title || `${studProfile.dog?.name || "Stud"} - ${studProfile.dog?.breed || "American Bully"}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {studProfile.description || 
                      "Champion bloodline with exceptional structure and temperament. DNA verified gene carrier with proven production history. This stud has consistently produced high-quality puppies with excellent conformation and temperament."}
                  </p>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Stud Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Standard Service</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Includes 2 breeding attempts with natural tie.
                        </p>
                        <div className="flex justify-between items-center">
                          <span>Fee:</span>
                          <span className="font-bold">{formatCurrency(studProfile.feeStructure?.baseFee || 2000)}</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Premium Service</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Includes 3 breeding attempts, progesterone testing, and semen evaluation.
                        </p>
                        <div className="flex justify-between items-center">
                          <span>Fee:</span>
                          <span className="font-bold">{formatCurrency((studProfile.feeStructure?.baseFee || 2000) * 1.5)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Availability</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">
                        Currently accepting breeding requests for the following months:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["May 2025", "June 2025", "July 2025"].map((month) => (
                          <Badge key={month} variant="outline">
                            <Calendar className="mr-1 h-3 w-3" />
                            {month}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>DNA Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Color Genetics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Main Color:</span>
                          <span className="font-medium">{studProfile.colorGenetics?.mainColor || "Blue dilute (d/d)"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pattern:</span>
                          <span className="font-medium">{studProfile.colorGenetics?.pattern || "Solid"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carries:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {studProfile.colorGenetics?.carries?.map((color: string, index: number) => (
                              <Badge key={index} variant="outline">{color}</Badge>
                            )) || (
                              <Badge variant="outline">Chocolate</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Health Clearances</h4>
                      <div className="space-y-2">
                        {studProfile.healthClearances?.tests?.map((test: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span>{test}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>OFA Hips - Good</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>OFA Elbows - Normal</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>Cardiac - Clear</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>BAER Hearing - Normal</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dna" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <DNAVisualization dnaData={mockDnaData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="production" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Production History</CardTitle>
                  <CardDescription>
                    Previous litters and offspring details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Litter 1 */}
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">Litter with Luna</h3>
                          <p className="text-sm text-muted-foreground">Whelped: January 15, 2024</p>
                        </div>
                        <Badge>6 Puppies</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Color Outcomes</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">3 Blue</Badge>
                            <Badge variant="outline">2 Blue Fawn</Badge>
                            <Badge variant="outline">1 Lilac</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Client Testimonial</h4>
                          <p className="text-sm italic text-muted-foreground">
                            "We couldn't be happier with our puppy from this litter. He has amazing structure and the sweetest temperament. Definitely worth the investment!"
                          </p>
                          <p className="text-xs mt-1">- Sarah Johnson</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <img 
                            src="https://images.unsplash.com/photo-1583511655826-05700442b31b" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                          <img 
                            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                          <img 
                            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Litter 2 */}
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">Litter with Bella</h3>
                          <p className="text-sm text-muted-foreground">Whelped: October 5, 2023</p>
                        </div>
                        <Badge>8 Puppies</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Color Outcomes</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">4 Blue</Badge>
                            <Badge variant="outline">2 Blue Brindle</Badge>
                            <Badge variant="outline">2 Lilac</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Client Testimonial</h4>
                          <p className="text-sm italic text-muted-foreground">
                            "The puppies from this breeding have exceeded our expectations. Great bone structure and amazing temperaments!"
                          </p>
                          <p className="text-xs mt-1">- Michael Williams</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <img 
                            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                          <img 
                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                          <img 
                            src="https://images.unsplash.com/photo-1583511655826-05700442b31b" 
                            alt="Puppy" 
                            className="rounded-md aspect-square object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

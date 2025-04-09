"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useStudMarketing } from "@/hooks/useStudMarketing";
import { DNAVisualization } from "@/components/marketing/dna-visualization";
import Link from "next/link";

// Sample DNA data for demonstration
const sampleDNAData = {
  colorGenes: [
    {
      name: "Dilution (D Locus)",
      locus: "D/d",
      genotype: "d/d",
      phenotype: "Blue/Dilute",
      description: "This dog carries two copies of the recessive dilution gene, resulting in a blue/dilute coat color."
    },
    {
      name: "Black/Brown (B Locus)",
      locus: "B/b",
      genotype: "B/B",
      phenotype: "Black pigment",
      description: "This dog carries two copies of the dominant black gene, producing black pigment rather than brown/chocolate/liver."
    },
    {
      name: "Extension (E Locus)",
      locus: "E/e",
      genotype: "E/E",
      phenotype: "Normal extension",
      description: "This dog can produce normal black pigment and does not carry the gene for red/yellow coat color."
    },
    {
      name: "Agouti (A Locus)",
      locus: "A/a",
      genotype: "a/a",
      phenotype: "Recessive black",
      description: "This dog is homozygous for recessive black, which may be masked by other coat color genes."
    }
  ],
  healthGenes: [
    {
      name: "Hip Dysplasia Risk",
      genotype: "HD+/HD-",
      status: "carrier",
      description: "This dog carries one copy of a genetic variant associated with increased risk of hip dysplasia.",
      severity: "medium"
    },
    {
      name: "Degenerative Myelopathy",
      genotype: "DM-/DM-",
      status: "clear",
      description: "This dog does not carry the mutation associated with Degenerative Myelopathy.",
      severity: "high"
    },
    {
      name: "Exercise-Induced Collapse",
      genotype: "EIC-/EIC-",
      status: "clear",
      description: "This dog does not carry the mutation associated with Exercise-Induced Collapse.",
      severity: "medium"
    }
  ],
  traitGenes: [
    {
      name: "Body Size (IGF1)",
      genotype: "IGF1/IGF1",
      phenotype: "Large",
      description: "This dog carries two copies of the variant associated with larger body size."
    },
    {
      name: "Muscle Mass (MSTN)",
      genotype: "MSTN+/MSTN+",
      phenotype: "Increased muscle mass",
      description: "This dog carries two copies of the variant associated with increased muscle mass."
    },
    {
      name: "Ear Type",
      genotype: "ET1/ET2",
      phenotype: "Semi-erect",
      description: "This dog carries variants associated with semi-erect ear carriage."
    }
  ],
  coi: 6.25,
  prepotency: 78.4
};

export default function StudDNAProfile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getStudProfileById, loading, error } = useStudMarketing();
  const [studProfile, setStudProfile] = useState<any>(null);
  
  // Fetch stud profile data
  useEffect(() => {
    const fetchStudProfile = async () => {
      const profile = await getStudProfileById(params.id);
      if (profile) {
        setStudProfile(profile);
      }
    };
    
    fetchStudProfile();
  }, [params.id, getStudProfileById]);
  
  // Get DNA data from the stud profile or use sample data
  const getDNAData = () => {
    if (studProfile?.dnaHighlights) {
      return studProfile.dnaHighlights;
    }
    
    // Use sample data for demonstration
    return sampleDNAData;
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
            Back to Stud Marketing
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/dashboard/marketing/stud/${params.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {studProfile.dog?.name} - DNA Profile
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="pt-6">
            <DNAVisualization dnaData={getDNAData()} />
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push(`/dashboard/marketing/stud/${params.id}`)}>
            Back to Stud Profile
          </Button>
          <Button>
            <Link href={`/dashboard/marketing/stud/${params.id}/dna/edit`}>
              Edit DNA Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

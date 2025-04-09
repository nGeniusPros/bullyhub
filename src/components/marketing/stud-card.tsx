"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Download,
  Dna,
  Palette,
  Heart,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StudMarketing } from "@/types";

interface StudCardProps {
  stud: StudMarketing;
}

export function StudCard({ stud }: StudCardProps) {
  // Default values for missing data
  const isAvailable = stud.availabilityCalendar?.isAvailable !== undefined 
    ? stud.availabilityCalendar.isAvailable 
    : true;
  
  const studFee = stud.feeStructure?.baseFee || 1500;
  
  const successRate = stud.successMetrics?.successRate || 90;
  const litterCount = stud.successMetrics?.litterCount || 5;
  const puppyCount = stud.successMetrics?.puppyCount || 30;
  
  const dogName = stud.dog?.name || "Unnamed Stud";
  const dogBreed = stud.dog?.breed || "American Bully";
  const dogColor = stud.dog?.color || "Blue";
  
  const imageUrl = stud.dog?.imageUrl || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee";
  
  const colorGenetics = stud.colorGenetics || {
    mainColor: "Blue dilute (d/d)",
    pattern: "Solid",
    carries: ["Chocolate"]
  };
  
  const healthClearances = stud.healthClearances?.tests || ["OFA Hips", "OFA Elbows", "Cardiac", "BAER"];
  
  const isDnaVerified = stud.dnaHighlights?.verified !== undefined 
    ? stud.dnaHighlights.verified 
    : true;

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={dogName} 
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {dogName}
              {isDnaVerified && (
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  <Dna className="mr-1 h-3 w-3" />
                  DNA Verified
                </span>
              )}
            </CardTitle>
            <CardDescription>{dogBreed} • {dogColor}</CardDescription>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Color Genetics:</span>
            </div>
            <div className="pl-6 text-xs space-y-1">
              <p>Coat: {colorGenetics.mainColor}</p>
              <p>Pattern: {colorGenetics.pattern}</p>
              <p>Carries: {Array.isArray(colorGenetics.carries) ? colorGenetics.carries.join(", ") : colorGenetics.carries}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Health Clearances:</span>
            </div>
            <div className="pl-6 text-xs">
              <p>{Array.isArray(healthClearances) ? healthClearances.join(", ") : healthClearances}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{litterCount}</div>
            <div className="text-xs text-muted-foreground">Litters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{puppyCount}</div>
            <div className="text-xs text-muted-foreground">Puppies</div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Stud Fee:</span>
            </div>
            <span className="font-bold text-lg">{formatCurrency(studFee)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
        <Link href={`/dashboard/marketing/stud/${stud.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

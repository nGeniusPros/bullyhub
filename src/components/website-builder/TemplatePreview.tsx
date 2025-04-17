"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplatePreviewProps {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function TemplatePreview({
  id,
  name,
  description,
  image,
  features,
  isSelected = false,
  onSelect,
}: TemplatePreviewProps) {
  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={`${name} template preview`}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-medium mb-2">Key Features:</h4>
        <ul className="text-sm space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/website-templates/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {onSelect && (
          <Button 
            size="sm" 
            variant={isSelected ? "default" : "secondary"}
            onClick={() => onSelect(id)}
          >
            {isSelected ? "Selected" : "Select Template"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

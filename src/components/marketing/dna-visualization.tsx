"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dna, Zap, Palette, Heart, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Gene {
  name: string;
  description: string;
  genotype: string;
  phenotype: string;
  status: "carrier" | "affected" | "clear" | "unknown";
  impact: "high" | "medium" | "low" | "none";
}

interface ColorGene {
  name: string;
  locus: string;
  genotype: string;
  phenotype: string;
  description: string;
}

interface HealthGene {
  name: string;
  genotype: string;
  status: "carrier" | "affected" | "clear" | "unknown";
  description: string;
  severity: "high" | "medium" | "low";
}

interface TraitGene {
  name: string;
  genotype: string;
  phenotype: string;
  description: string;
}

interface DNAVisualizationProps {
  dnaData: {
    colorGenes?: ColorGene[];
    healthGenes?: HealthGene[];
    traitGenes?: TraitGene[];
    coi?: number;
    prepotency?: number;
  };
}

export function DNAVisualization({ dnaData }: DNAVisualizationProps) {
  const [activeTab, setActiveTab] = useState("color");
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear":
        return "bg-green-100 text-green-800";
      case "carrier":
        return "bg-yellow-100 text-yellow-800";
      case "affected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-600" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Render DNA helix visualization
  const renderDNAHelix = () => {
    return (
      <div className="flex justify-center py-4">
        <div className="relative w-20 h-80">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="absolute w-full">
              <div 
                className="absolute h-4 w-16 rounded-full bg-blue-500 opacity-70"
                style={{ 
                  top: i * 16, 
                  transform: `rotate(${i % 2 === 0 ? 30 : -30}deg)`,
                  left: i % 2 === 0 ? -8 : 12
                }}
              />
              <div 
                className="absolute h-4 w-4 rounded-full bg-red-500"
                style={{ 
                  top: i * 16, 
                  left: i % 2 === 0 ? -12 : 28
                }}
              />
              <div 
                className="absolute h-4 w-4 rounded-full bg-yellow-500"
                style={{ 
                  top: i * 16, 
                  left: i % 2 === 0 ? 28 : -12
                }}
              />
            </div>
          ))}
          <div className="absolute h-full w-1 bg-gray-300 left-1/2 transform -translate-x-1/2" />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Dna className="mr-2 h-6 w-6" />
          DNA Profile
        </h2>
        {dnaData.coi !== undefined && (
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="font-medium">COI:</span>
              <Badge variant="outline" className="ml-2">
                {dnaData.coi.toFixed(2)}%
              </Badge>
            </div>
            {dnaData.prepotency !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Prepotency:</span>
                <Badge variant="outline" className="ml-2">
                  {dnaData.prepotency.toFixed(2)}%
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          {renderDNAHelix()}
        </div>
        
        <div className="lg:col-span-3 order-1 lg:order-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="color" className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Color Genetics
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                Health Markers
              </TabsTrigger>
              <TabsTrigger value="traits" className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Trait Genes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="color" className="space-y-4 mt-4">
              {dnaData.colorGenes && dnaData.colorGenes.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {dnaData.colorGenes.map((gene, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{gene.name}</CardTitle>
                          <Badge variant="outline">{gene.locus}</Badge>
                        </div>
                        <CardDescription>{gene.phenotype}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">Genotype:</span>
                            <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                              {gene.genotype}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{gene.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Palette className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No color genetics data available</h3>
                  <p className="text-sm text-muted-foreground">
                    DNA color testing information will appear here when available.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4 mt-4">
              {dnaData.healthGenes && dnaData.healthGenes.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {dnaData.healthGenes.map((gene, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base flex items-center">
                            {gene.name}
                            {getSeverityIcon(gene.severity)}
                          </CardTitle>
                          <Badge className={getStatusColor(gene.status)}>
                            {gene.status.charAt(0).toUpperCase() + gene.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">Genotype:</span>
                            <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                              {gene.genotype}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{gene.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No health markers data available</h3>
                  <p className="text-sm text-muted-foreground">
                    DNA health testing information will appear here when available.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="traits" className="space-y-4 mt-4">
              {dnaData.traitGenes && dnaData.traitGenes.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {dnaData.traitGenes.map((gene, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{gene.name}</CardTitle>
                          <Badge variant="outline">{gene.phenotype}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">Genotype:</span>
                            <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                              {gene.genotype}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{gene.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Zap className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No trait genes data available</h3>
                  <p className="text-sm text-muted-foreground">
                    DNA trait testing information will appear here when available.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

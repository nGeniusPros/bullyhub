'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Dog, CompatibilityResult } from '@/types';

export default function BreedingCompatibilityPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSire, setSelectedSire] = useState<string>('');
  const [selectedDam, setSelectedDam] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch('/api/dogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dogs');
        }
        
        const data = await response.json();
        setDogs(data);
      } catch (error) {
        console.error('Error fetching dogs:', error);
        toast.error('Failed to load dogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDogs();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedSire || !selectedDam) {
      toast.error('Please select both a sire and a dam');
      return;
    }
    
    if (selectedSire === selectedDam) {
      toast.error('Please select different dogs for sire and dam');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      const response = await fetch('/api/breeding/compatibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sireId: selectedSire,
          damId: selectedDam,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze compatibility');
      }
      
      const data = await response.json();
      setCompatibilityResult(data);
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      toast.error('Failed to analyze compatibility');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCompatibilityResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Breeding Compatibility</h1>
        <p className="text-muted-foreground">
          Analyze genetic compatibility between potential breeding pairs
        </p>
      </div>

      {!compatibilityResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Select Breeding Pair</CardTitle>
            <CardDescription>
              Choose a sire (male) and dam (female) to analyze their breeding compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sire">Sire (Male)</Label>
                  <Select
                    value={selectedSire}
                    onValueChange={setSelectedSire}
                  >
                    <SelectTrigger id="sire">
                      <SelectValue placeholder="Select a male dog" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs
                        .filter(dog => dog.isStud)
                        .map(dog => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.breed}, {dog.color})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dam">Dam (Female)</Label>
                  <Select
                    value={selectedDam}
                    onValueChange={setSelectedDam}
                  >
                    <SelectTrigger id="dam">
                      <SelectValue placeholder="Select a female dog" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs
                        .filter(dog => !dog.isStud)
                        .map(dog => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.breed}, {dog.color})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={analyzing || !selectedSire || !selectedDam}
                    className="w-full"
                  >
                    {analyzing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Compatibility'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Compatibility Results</h2>
            <Button variant="outline" onClick={resetAnalysis}>
              New Analysis
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Breeding Pair</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{compatibilityResult.sire?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {compatibilityResult.sire?.breed}, {compatibilityResult.sire?.color}
                      </p>
                      {compatibilityResult.sire?.hasDNA ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          DNA Test Available
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          No DNA Test
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{compatibilityResult.dam?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {compatibilityResult.dam?.breed}, {compatibilityResult.dam?.color}
                      </p>
                      {compatibilityResult.dam?.hasDNA ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          DNA Test Available
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          No DNA Test
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Coefficient of Inbreeding (COI)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{(compatibilityResult.coi * 100).toFixed(1)}%</span>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      compatibilityResult.coi < 0.05 
                        ? 'bg-green-100 text-green-700' 
                        : compatibilityResult.coi < 0.1 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {compatibilityResult.coi < 0.05 
                        ? 'Low' 
                        : compatibilityResult.coi < 0.1 
                        ? 'Moderate' 
                        : 'High'}
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        compatibilityResult.coi < 0.05 
                          ? 'bg-green-500' 
                          : compatibilityResult.coi < 0.1 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`} 
                      style={{ width: `${Math.min(compatibilityResult.coi * 200, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    The Coefficient of Inbreeding (COI) measures the genetic similarity between the breeding pair.
                    Lower values indicate less related dogs and generally healthier offspring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Color Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compatibilityResult.colorPredictions.map((prediction, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16">
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${prediction.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">{prediction.percentage}%</div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{prediction.color}</h3>
                      <p className="text-sm text-muted-foreground">{prediction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Health Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compatibilityResult.healthRisks.map((risk, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{risk.condition}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        risk.risk === 'Low' 
                          ? 'bg-green-100 text-green-700' 
                          : risk.risk === 'Medium' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {risk.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{risk.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{compatibilityResult.recommendation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

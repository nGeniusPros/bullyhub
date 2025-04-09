'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, AlertCircle, Plus, Trash2, HeartPulse } from 'lucide-react';
import { BreedingProgram } from '@/types';

interface HealthProtocol {
  protocolName: string;
  description: string;
  required: boolean;
  frequency: string;
}

export default function EditHealthProtocolsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [program, setProgram] = useState<BreedingProgram | null>(null);
  const [healthProtocols, setHealthProtocols] = useState<HealthProtocol[]>([{
    protocolName: '',
    description: '',
    required: true,
    frequency: ''
  }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBreedingProgram = async () => {
      try {
        const response = await fetch(`/api/breeding-programs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch breeding program');
        }
        
        const data = await response.json();
        setProgram(data);
        
        // Initialize health protocols with fetched data
        if (data.healthProtocols && data.healthProtocols.length > 0) {
          setHealthProtocols(data.healthProtocols);
        }
      } catch (err) {
        console.error('Error fetching breeding program:', err);
        setError('Failed to load breeding program');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBreedingProgram();
  }, [params.id]);
  
  const addHealthProtocol = () => {
    setHealthProtocols([...healthProtocols, {
      protocolName: '',
      description: '',
      required: true,
      frequency: ''
    }]);
  };

  const updateHealthProtocol = (index: number, field: string, value: any) => {
    const updatedProtocols = [...healthProtocols];
    updatedProtocols[index] = { ...updatedProtocols[index], [field]: value };
    setHealthProtocols(updatedProtocols);
  };

  const removeHealthProtocol = (index: number) => {
    if (healthProtocols.length > 1) {
      const updatedProtocols = [...healthProtocols];
      updatedProtocols.splice(index, 1);
      setHealthProtocols(updatedProtocols);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Filter out incomplete protocols
      const validProtocols = healthProtocols.filter(protocol => 
        protocol.protocolName.trim() !== ''
      );
      
      if (!program) {
        throw new Error('Program data not available');
      }
      
      // Update the program with the new health protocols
      const response = await fetch(`/api/breeding-programs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: program.name,
          description: program.description,
          goals: program.goals,
          programType: program.programType,
          colorFocus: program.colorFocus,
          healthProtocols: validProtocols,
          costRange: program.costRange,
          specialConsiderations: program.specialConsiderations
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update health protocols');
      }

      toast({
        title: 'Success',
        description: 'Health protocols updated successfully',
      });
      
      router.push(`/dashboard/breeding-programs/${params.id}`);
    } catch (error) {
      console.error('Error updating health protocols:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update health protocols',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !program) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/breeding-programs/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Program
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error || 'Failed to load breeding program'}</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => router.refresh()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href={`/dashboard/breeding-programs/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Program
          </Button>
        </Link>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Testing Protocols</h1>
        <p className="text-muted-foreground">
          Manage health testing protocols for <span className="font-medium">{program.name}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Health Protocols</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addHealthProtocol}>
              <Plus className="mr-2 h-4 w-4" />
              Add Protocol
            </Button>
          </CardHeader>
          <CardContent>
            {healthProtocols.length === 0 ? (
              <div className="text-center py-10 border rounded-md">
                <HeartPulse className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Health Protocols Defined</h3>
                <p className="text-muted-foreground mt-1">Define health testing protocols for your breeding program</p>
                <Button className="mt-4" type="button" onClick={addHealthProtocol}>
                  Add Your First Protocol
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {healthProtocols.map((protocol, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Protocol {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHealthProtocol(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Protocol Name</Label>
                        <Input
                          value={protocol.protocolName}
                          onChange={(e) => updateHealthProtocol(index, 'protocolName', e.target.value)}
                          placeholder="Hip and elbow evaluations"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={protocol.description}
                          onChange={(e) => updateHealthProtocol(index, 'description', e.target.value)}
                          placeholder="Detailed description of the health testing protocol"
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Input
                            value={protocol.frequency}
                            onChange={(e) => updateHealthProtocol(index, 'frequency', e.target.value)}
                            placeholder="Once per year"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-8">
                          <Checkbox
                            id={`required-${index}`}
                            checked={protocol.required}
                            onCheckedChange={(checked) => updateHealthProtocol(index, 'required', !!checked)}
                          />
                          <Label htmlFor={`required-${index}`}>Required</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/breeding-programs/${params.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Protocols'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

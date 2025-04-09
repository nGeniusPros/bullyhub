'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, AlertCircle, Plus, Trash2, Baby } from 'lucide-react';

interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  dateOfBirth?: string;
  isStud?: boolean;
}

interface Puppy {
  id?: string;
  name: string;
  color: string;
  gender: string;
}

export default function AddLitterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [sireId, setSireId] = useState<string>('');
  const [damId, setDamId] = useState<string>('');
  const [whelpingDate, setWhelpingDate] = useState<string>('');
  const [puppies, setPuppies] = useState<Puppy[]>([
    { name: '', color: '', gender: 'male' }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programName, setProgramName] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the breeding program to get its name
        const programResponse = await fetch(`/api/breeding-programs/${params.id}`);
        
        if (!programResponse.ok) {
          throw new Error('Failed to fetch breeding program');
        }
        
        const programData = await programResponse.json();
        setProgramName(programData.name);
        
        // Fetch all dogs owned by the user
        const dogsResponse = await fetch('/api/dogs');
        
        if (!dogsResponse.ok) {
          throw new Error('Failed to fetch dogs');
        }
        
        const dogsData = await dogsResponse.json();
        setDogs(dogsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);
  
  const addPuppy = () => {
    setPuppies([...puppies, { name: '', color: '', gender: 'male' }]);
  };
  
  const updatePuppy = (index: number, field: keyof Puppy, value: string) => {
    const updatedPuppies = [...puppies];
    updatedPuppies[index] = { ...updatedPuppies[index], [field]: value };
    setPuppies(updatedPuppies);
  };
  
  const removePuppy = (index: number) => {
    if (puppies.length > 1) {
      const updatedPuppies = [...puppies];
      updatedPuppies.splice(index, 1);
      setPuppies(updatedPuppies);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sireId || !damId || !whelpingDate) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate that sire and dam are different dogs
    if (sireId === damId) {
      toast({
        title: 'Invalid selection',
        description: 'Sire and dam must be different dogs',
        variant: 'destructive',
      });
      return;
    }
    
    // Filter out incomplete puppies
    const validPuppies = puppies.filter(puppy => 
      puppy.color.trim() !== '' && puppy.gender.trim() !== ''
    );
    
    setSaving(true);
    
    try {
      const response = await fetch(`/api/breeding-programs/${params.id}/litters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sireId,
          damId,
          whelpingDate,
          puppies: validPuppies
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record litter');
      }
      
      toast({
        title: 'Success',
        description: 'Litter recorded successfully',
      });
      
      router.push(`/dashboard/breeding-programs/${params.id}`);
    } catch (error) {
      console.error('Error recording litter:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record litter',
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
  
  if (error) {
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
            <p>{error}</p>
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
  
  // Filter dogs by gender for sire and dam selection
  const maleDogs = dogs.filter(dog => dog.isStud);
  const femaleDogs = dogs.filter(dog => !dog.isStud);
  
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
        <h1 className="text-3xl font-bold tracking-tight">Record New Litter</h1>
        <p className="text-muted-foreground">
          Add a new litter to <span className="font-medium">{programName}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Litter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sire">Sire (Father)</Label>
                  <Select value={sireId} onValueChange={setSireId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sire" />
                    </SelectTrigger>
                    <SelectContent>
                      {maleDogs.length === 0 ? (
                        <div className="p-2 text-center text-muted-foreground">
                          No stud dogs available
                        </div>
                      ) : (
                        maleDogs.map(dog => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.color})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {maleDogs.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      You need to add a stud dog first
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dam">Dam (Mother)</Label>
                  <Select value={damId} onValueChange={setDamId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dam" />
                    </SelectTrigger>
                    <SelectContent>
                      {femaleDogs.length === 0 ? (
                        <div className="p-2 text-center text-muted-foreground">
                          No female dogs available
                        </div>
                      ) : (
                        femaleDogs.map(dog => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.color})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {femaleDogs.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      You need to add a female dog first
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whelpingDate">Whelping Date</Label>
                <Input
                  id="whelpingDate"
                  type="date"
                  value={whelpingDate}
                  onChange={(e) => setWhelpingDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Puppies</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addPuppy}>
                <Plus className="mr-2 h-4 w-4" />
                Add Puppy
              </Button>
            </CardHeader>
            <CardContent>
              {puppies.length === 0 ? (
                <div className="text-center py-10 border rounded-md">
                  <Baby className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Puppies Added</h3>
                  <p className="text-muted-foreground mt-1">Add puppies to this litter</p>
                  <Button className="mt-4" type="button" onClick={addPuppy}>
                    Add First Puppy
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {puppies.map((puppy, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Puppy {index + 1}</h4>
                        {puppies.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePuppy(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Name (Optional)</Label>
                          <Input
                            value={puppy.name}
                            onChange={(e) => updatePuppy(index, 'name', e.target.value)}
                            placeholder="Puppy name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <Input
                            value={puppy.color}
                            onChange={(e) => updatePuppy(index, 'color', e.target.value)}
                            placeholder="Puppy color"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            value={puppy.gender}
                            onValueChange={(value) => updatePuppy(index, 'gender', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
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
              <Button type="submit" disabled={saving || !sireId || !damId || !whelpingDate}>
                {saving ? 'Recording...' : 'Record Litter'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

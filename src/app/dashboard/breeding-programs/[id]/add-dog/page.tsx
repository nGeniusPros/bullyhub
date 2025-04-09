'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Search, AlertCircle, Dog } from 'lucide-react';

interface DogType {
  id: string;
  name: string;
  breed: string;
  color: string;
  date_of_birth?: string;
  breeding_program_id?: string | null;
}

export default function AddDogToBreedingProgramPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dogs, setDogs] = useState<DogType[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<DogType[]>([]);
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
        setFilteredDogs(dogsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);
  
  useEffect(() => {
    // Filter dogs based on search query
    const filtered = dogs.filter(dog => 
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.color.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDogs(filtered);
  }, [searchQuery, dogs]);
  
  const handleToggleDog = (dogId: string) => {
    setSelectedDogs(prev => 
      prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };
  
  const handleAddDogs = async () => {
    if (selectedDogs.length === 0) {
      toast({
        title: 'No dogs selected',
        description: 'Please select at least one dog to add to the breeding program',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`/api/breeding-programs/${params.id}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dogIds: selectedDogs }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add dogs to breeding program');
      }
      
      toast({
        title: 'Success',
        description: `${selectedDogs.length} dog(s) added to breeding program`,
      });
      
      router.push(`/dashboard/breeding-programs/${params.id}`);
    } catch (error) {
      console.error('Error adding dogs to breeding program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add dogs to breeding program',
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
        <h1 className="text-3xl font-bold tracking-tight">Add Dogs to Program</h1>
        <p className="text-muted-foreground">
          Select dogs to add to <span className="font-medium">{programName}</span>
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Dogs</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, breed, or color..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredDogs.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <Dog className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Dogs Found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery 
                  ? 'No dogs match your search criteria' 
                  : 'You haven\'t added any dogs yet'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/dogs/add">
                    Add Your First Dog
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Select dogs to add to this program</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedDogs.length} selected
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDogs.map((dog) => (
                  <div 
                    key={dog.id} 
                    className={`border rounded-md p-4 ${
                      dog.breeding_program_id === params.id
                        ? 'bg-primary/5 border-primary/20'
                        : dog.breeding_program_id
                        ? 'bg-muted/50 border-muted'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {!dog.breeding_program_id && (
                          <Checkbox
                            id={`dog-${dog.id}`}
                            checked={selectedDogs.includes(dog.id)}
                            onCheckedChange={() => handleToggleDog(dog.id)}
                            disabled={!!dog.breeding_program_id}
                          />
                        )}
                        <div>
                          <Label 
                            htmlFor={`dog-${dog.id}`}
                            className="text-base font-medium"
                          >
                            {dog.name}
                          </Label>
                          <div className="text-sm text-muted-foreground">
                            {dog.breed} • {dog.color}
                          </div>
                          {dog.date_of_birth && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Born: {new Date(dog.date_of_birth).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {dog.breeding_program_id && (
                        <div className="text-xs bg-muted px-2 py-1 rounded-md">
                          {dog.breeding_program_id === params.id 
                            ? 'Already in this program' 
                            : 'In another program'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
          <Button 
            onClick={handleAddDogs} 
            disabled={saving || selectedDogs.length === 0}
          >
            {saving ? 'Adding...' : `Add ${selectedDogs.length} Dog(s) to Program`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Dog,
  Baby,
  HeartPulse,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { BreedingProgram } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Dog {
  id: string;
  name: string;
  breed: string;
  color: string;
  date_of_birth?: string;
}

interface Puppy {
  id: string;
  name: string;
  color: string;
  gender: string;
}

interface Litter {
  id: string;
  whelping_date: string;
  puppy_count: number;
  sire: Dog;
  dam: Dog;
  puppies: Puppy[];
}

interface ExtendedBreedingProgram extends BreedingProgram {
  dogs: Dog[];
  litters: Litter[];
}

export default function BreedingProgramDetailPage({ params }) {
  const router = useRouter();
  const [program, setProgram] = useState<ExtendedBreedingProgram | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        setError('Error loading breeding program details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBreedingProgram();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this breeding program?')) {
      return;
    }

    try {
      const response = await fetch(`/api/breeding-programs/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete breeding program');
      }

      router.push('/dashboard/breeding-programs');
    } catch (err) {
      setError('Error deleting breeding program');
      console.error(err);
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
          <Link href="/dashboard/breeding-programs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Error loading breeding program</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
              <Button
                className="mt-4"
                onClick={() => router.refresh()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getProgramTypeBadge = (type: string) => {
    switch (type) {
      case 'standard':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Standard</Badge>;
      case 'rare':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Rare</Badge>;
      case 'specialized':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Specialized</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/breeding-programs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/breeding-programs/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Program
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{program.name}</CardTitle>
                <CardDescription className="mt-1">{program.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getProgramTypeBadge(program.programType)}
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {program.colorFocus}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="dogs">
                  Dogs ({program.dogs.length})
                </TabsTrigger>
                <TabsTrigger value="litters">
                  Litters ({program.litters.length})
                </TabsTrigger>
                <TabsTrigger value="health">Health Protocols</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    {/* Goals */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Program Goals</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {program.goals.map((goal, index) => (
                          <li key={index} className="text-muted-foreground">{goal}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Special Considerations */}
                    {program.specialConsiderations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Special Considerations</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {program.specialConsiderations.map((consideration, index) => (
                            <li key={index} className="text-muted-foreground">{consideration}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Program Stats */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Dog className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Dogs in Program</div>
                            <div className="text-2xl font-bold">{program.dogs.length}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Baby className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Litters</div>
                            <div className="text-2xl font-bold">{program.litters.length}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cost Range */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4 mb-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <div className="text-sm font-medium">Expected Cost Range</div>
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(program.costRange.min)} - {formatCurrency(program.costRange.max)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dogs">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Dogs in Program</h3>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/breeding-programs/${params.id}/add-dog`}>
                        Add Dog
                      </Link>
                    </Button>
                  </div>

                  {program.dogs.length === 0 ? (
                    <div className="text-center py-10 border rounded-md">
                      <Dog className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Dogs Added Yet</h3>
                      <p className="text-muted-foreground mt-1">Add dogs to your breeding program</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/dashboard/breeding-programs/${params.id}/add-dog`}>
                          Add Your First Dog
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.dogs.map((dog) => (
                        <Card key={dog.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{dog.name}</h4>
                                <p className="text-sm text-muted-foreground">{dog.breed}</p>
                              </div>
                              <Badge>{dog.color}</Badge>
                            </div>
                            <div className="mt-4 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date of Birth:</span>
                                <span>{dog.date_of_birth ? new Date(dog.date_of_birth).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={`/dashboard/dogs/${dog.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="litters">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Litters</h3>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/breeding-programs/${params.id}/add-litter`}>
                        Record Litter
                      </Link>
                    </Button>
                  </div>

                  {program.litters.length === 0 ? (
                    <div className="text-center py-10 border rounded-md">
                      <Baby className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Litters Recorded Yet</h3>
                      <p className="text-muted-foreground mt-1">Record litters for your breeding program</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/dashboard/breeding-programs/${params.id}/add-litter`}>
                          Record Your First Litter
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {program.litters.map((litter) => (
                        <Card key={litter.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  Litter from {litter.dam.name} × {litter.sire.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Whelped: {new Date(litter.whelping_date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge>{litter.puppy_count} puppies</Badge>
                            </div>

                            {litter.puppies.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Puppies:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {litter.puppies.map((puppy) => (
                                    <div key={puppy.id} className="text-sm border rounded-md p-2">
                                      <div className="flex justify-between">
                                        <span>{puppy.name || 'Unnamed'}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {puppy.gender}
                                        </Badge>
                                      </div>
                                      <div className="text-muted-foreground text-xs mt-1">
                                        {puppy.color}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-4">
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={`/dashboard/litters/${litter.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="health">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Health Testing Protocols</h3>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/breeding-programs/${params.id}/edit-protocols`}>
                        Edit Protocols
                      </Link>
                    </Button>
                  </div>

                  {(!program.healthProtocols || program.healthProtocols.length === 0) ? (
                    <div className="text-center py-10 border rounded-md">
                      <HeartPulse className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Health Protocols Defined</h3>
                      <p className="text-muted-foreground mt-1">Define health testing protocols for your breeding program</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/dashboard/breeding-programs/${params.id}/edit-protocols`}>
                          Add Health Protocols
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {program.healthProtocols.map((protocol: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{protocol.protocolName}</h4>
                                <p className="text-sm text-muted-foreground">{protocol.description}</p>
                              </div>
                              <div className="flex space-x-2">
                                {protocol.required && (
                                  <Badge variant="default">Required</Badge>
                                )}
                                {protocol.frequency && (
                                  <Badge variant="outline">{protocol.frequency}</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

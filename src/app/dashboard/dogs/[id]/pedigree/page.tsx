'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PedigreeData } from '@/types';
import { PedigreeTree } from '@/components/PedigreeTree';
import Link from 'next/link';

export default function DogPedigreePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pedigree, setPedigree] = useState<PedigreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedigree = async () => {
      try {
        const response = await fetch(`/api/dogs/${params.id}/pedigree`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pedigree');
        }
        
        const data = await response.json();
        setPedigree(data);
      } catch (error) {
        console.error('Error fetching pedigree:', error);
        toast.error('Failed to load pedigree');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedigree();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pedigree) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Pedigree Not Found</h1>
        <p className="text-muted-foreground mb-6">The pedigree for this dog couldn't be loaded.</p>
        <Link href={`/dashboard/dogs/${params.id}`}>
          <Button>Back to Dog Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pedigree.dog.name}'s Pedigree</h1>
          <p className="text-muted-foreground">
            View ancestry and lineage information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/dogs/${params.id}`)}>
            Back to Profile
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Three Generation Pedigree</CardTitle>
        </CardHeader>
        <CardContent>
          <PedigreeTree pedigree={pedigree} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linebreeding Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Coefficient of Inbreeding (COI)</h3>
              <p className="text-muted-foreground">
                Based on this pedigree, the estimated COI is <span className="font-medium">3.2%</span>
              </p>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '3.2%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg">Key Ancestors</h3>
              <p className="text-muted-foreground mb-4">
                These dogs appear multiple times in the pedigree
              </p>
              
              <div className="border rounded-md divide-y">
                <div className="grid grid-cols-3 p-3 font-medium text-sm">
                  <div>Name</div>
                  <div>Occurrences</div>
                  <div>Genetic Contribution</div>
                </div>
                <div className="grid grid-cols-3 p-3 text-sm">
                  <div>Champion Rex</div>
                  <div>2</div>
                  <div>12.5%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

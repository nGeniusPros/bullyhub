'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { DNATestResult } from '@/types';
import Link from 'next/link';

export default function DNATestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dnaTest, setDnaTest] = useState<DNATestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDNATest = async () => {
      try {
        const response = await fetch(`/api/dna-tests/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch DNA test');
        }
        
        const data = await response.json();
        setDnaTest(data);
      } catch (error) {
        console.error('Error fetching DNA test:', error);
        toast.error('Failed to load DNA test');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDNATest();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this DNA test? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/dna-tests/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete DNA test');
      }
      
      toast.success('DNA test deleted successfully');
      router.push('/dashboard/dna-tests');
    } catch (error) {
      console.error('Error deleting DNA test:', error);
      toast.error('Failed to delete DNA test');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dnaTest) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">DNA Test Not Found</h1>
        <p className="text-muted-foreground mb-6">The DNA test you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/dna-tests">
          <Button>Back to DNA Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dnaTest.dogName}'s DNA Test</h1>
          <p className="text-muted-foreground">
            {dnaTest.provider} • {new Date(dnaTest.testDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/dna-tests')}>
            Back
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Test'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="genetic">
        <TabsList className="mb-4">
          <TabsTrigger value="genetic">Genetic Markers</TabsTrigger>
          <TabsTrigger value="health">Health Markers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="genetic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genetic Markers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dnaTest.markers.map((marker, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-lg">{marker.locus}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                        {marker.alleles.join('/')}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">{marker.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Markers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dnaTest.healthMarkers.map((marker, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{marker.condition}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        marker.status === 'Clear' 
                          ? 'bg-green-100 text-green-700' 
                          : marker.status === 'Carrier' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {marker.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

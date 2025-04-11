'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { DNATestResult } from '@/types';
import Link from 'next/link';
import { AlertTriangle, Download, FileText, Share2, Trash2 } from 'lucide-react';

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

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
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
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete DNA Test</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this DNA test? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>

      <Tabs defaultValue="genetic">
        <TabsList className="mb-4">
          <TabsTrigger value="genetic">Genetic Markers</TabsTrigger>
          <TabsTrigger value="health">Health Markers</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="genetic" className="space-y-4">
          <Card className="card-gradient card-gradient-primary">
            <CardHeader>
              <CardTitle>Coat Color & Type Genes</CardTitle>
              <CardDescription>
                Genetic markers that determine your dog's appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dnaTest.markers.map((marker, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{marker.locus}</h3>
                      <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {marker.alleles.join("/")}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {marker.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card className="card-gradient card-gradient-secondary">
            <CardHeader>
              <CardTitle>Health Markers</CardTitle>
              <CardDescription>
                Genetic health conditions and risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dnaTest.healthMarkers.map((marker, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{marker.condition}</h3>
                      <Badge className={marker.status === 'Clear'
                          ? 'bg-green-100 text-green-700'
                          : marker.status === 'Carrier'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'}>
                        {marker.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {marker.status === "Clear"
                        ? "Your dog does not have this genetic variant."
                        : marker.status === "Carrier"
                        ? "Your dog carries one copy of this genetic variant but is not affected."
                        : "Your dog is at risk for this condition."}
                    </p>
                    {marker.status === "At Risk" && (
                      <div className="flex items-center mt-3 text-amber-600 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <span>Consult with your veterinarian about this result</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card className="card-gradient card-gradient-success">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
              <CardDescription>
                Overview of your dog's genetic profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Dog Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{dnaTest.dogName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Test Date</p>
                      <p>{new Date(dnaTest.testDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p>{dnaTest.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Test ID</p>
                      <p>{dnaTest.id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Health Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p>Clear</p>
                      <p className="font-semibold">
                        {dnaTest.healthMarkers.filter(m => m.status === "Clear").length} conditions
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Carrier</p>
                      <p className="font-semibold">
                        {dnaTest.healthMarkers.filter(m => m.status === "Carrier").length} conditions
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>At Risk</p>
                      <p className="font-semibold">
                        {dnaTest.healthMarkers.filter(m => m.status === "At Risk").length} conditions
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Breeding Implications</h3>
                  <p className="text-sm">
                    This DNA test can be used in our breeding compatibility tools to help make informed breeding decisions.
                  </p>
                  <Button
                    className="btn-gradient-3color text-white mt-2"
                    onClick={() => router.push(`/dashboard/breeding/compatibility?dogId=${dnaTest.dogId}`)}
                  >
                    Check Breeding Compatibility
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

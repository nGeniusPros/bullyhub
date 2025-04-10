'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { HealthClearance } from '@/types';
import Link from 'next/link';

export default function HealthClearancesPage() {
  const router = useRouter();
  const [healthClearances, setHealthClearances] = useState<HealthClearance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthClearances = async () => {
      try {
        const response = await fetch('/api/health-clearances');

        if (!response.ok) {
          throw new Error('Failed to fetch health clearances');
        }

        const data = await response.json();
        setHealthClearances(data);
      } catch (error) {
        console.error('Error fetching health clearances:', error);
        toast.error('Failed to load health clearances');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthClearances();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Clearances</h1>
          <p className="text-muted-foreground">
            Manage health clearances and certifications for your dogs
          </p>
        </div>
        <Link href="/dashboard/health-clearances/add">
          <Button>
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
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add Clearance
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : healthClearances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No health clearances found. Add your first health clearance to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthClearances.map((clearance) => (
            <Link key={clearance.id} href={`/dashboard/health-clearances/${clearance.id}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{clearance.test}</CardTitle>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(clearance.status)}`}>
                      {clearance.status.charAt(0).toUpperCase() + clearance.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {clearance.dogName}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Test Date</p>
                        <p className="text-sm font-medium">{new Date(clearance.date).toLocaleDateString()}</p>
                      </div>
                      {clearance.expiryDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">Expiry Date</p>
                          <p className="text-sm font-medium">
                            {new Date(clearance.expiryDate).toLocaleDateString()}
                            {new Date(clearance.expiryDate) < new Date() && (
                              <span className="ml-2 text-red-500 text-xs">(Expired)</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Result</p>
                      <p className="text-sm font-medium">{clearance.result}</p>
                    </div>

                    {clearance.verificationNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground">Verification Number</p>
                        <p className="text-sm font-mono">{clearance.verificationNumber}</p>
                      </div>
                    )}

                    {clearance.documents && clearance.documents.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        {clearance.documents.length} document{clearance.documents.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

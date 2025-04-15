'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HealthClearanceForm } from '@/features/health-clearances';
import { toast } from 'sonner';

export default function NewHealthClearancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dogId = searchParams.get('dogId');
  const [dogs, setDogs] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch('/api/dogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dogs');
        }
        
        const data = await response.json();
        setDogs(data.map((dog: any) => ({ id: dog.id, name: dog.name })));
      } catch (error) {
        console.error('Error fetching dogs:', error);
        toast.error('Failed to load dogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDogs();
  }, []);

  const handleSuccess = (clearanceId: string) => {
    router.push(`/dashboard/health-clearances/${clearanceId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Health Clearance</h1>
        <p className="text-muted-foreground">
          Record a new health clearance or certification for your dog
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <HealthClearanceForm 
          dogId={dogId || undefined} 
          dogs={dogs} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  );
}

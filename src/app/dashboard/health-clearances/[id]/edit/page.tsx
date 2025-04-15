'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HealthClearanceForm } from '@/features/health-clearances';
import { toast } from 'sonner';
import { HealthClearanceFormData } from '@/features/health-clearances/types';

export default function EditHealthClearancePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<HealthClearanceFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthClearance = async () => {
      try {
        const response = await fetch(`/api/health-clearances/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch health clearance');
        }
        
        const data = await response.json();
        setInitialData({
          dogId: data.dogId,
          test: data.test,
          date: data.date,
          result: data.result,
          status: data.status,
          expiryDate: data.expiryDate || '',
          verificationNumber: data.verificationNumber,
          notes: data.notes || '',
          documents: data.documents || [],
        });
      } catch (error) {
        console.error('Error fetching health clearance:', error);
        toast.error('Failed to load health clearance');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthClearance();
  }, [params.id]);

  const handleSuccess = (clearanceId: string) => {
    router.push(`/dashboard/health-clearances/${clearanceId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Health Clearance</h1>
        <p className="text-muted-foreground">
          Update health clearance information
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : initialData ? (
        <HealthClearanceForm 
          dogId={initialData.dogId} 
          initialData={initialData} 
          onSuccess={handleSuccess} 
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Health clearance not found or you don't have permission to edit it.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { HealthClearance } from '@/types';
import Link from 'next/link';

export default function HealthClearanceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [healthClearance, setHealthClearance] = useState<HealthClearance | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    test: '',
    date: '',
    result: '',
    status: '',
    expiryDate: '',
    verificationNumber: '',
    notes: '',
  });

  useEffect(() => {
    const fetchHealthClearance = async () => {
      try {
        const response = await fetch(`/api/health-clearances/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch health clearance');
        }
        
        const data = await response.json();
        setHealthClearance(data);
        setFormData({
          test: data.test,
          date: data.date,
          result: data.result,
          status: data.status,
          expiryDate: data.expiryDate || '',
          verificationNumber: data.verificationNumber,
          notes: data.notes || '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/health-clearances/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update health clearance');
      }
      
      const updatedData = await response.json();
      setHealthClearance(updatedData);
      setEditing(false);
      toast.success('Health clearance updated successfully');
    } catch (error) {
      console.error('Error updating health clearance:', error);
      toast.error('Failed to update health clearance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this health clearance? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      const response = await fetch(`/api/health-clearances/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete health clearance');
      }
      
      toast.success('Health clearance deleted successfully');
      router.push('/dashboard/health-clearances');
    } catch (error) {
      console.error('Error deleting health clearance:', error);
      toast.error('Failed to delete health clearance');
    } finally {
      setDeleting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!healthClearance) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Health Clearance Not Found</h1>
        <p className="text-muted-foreground mb-6">The health clearance you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/health-clearances">
          <Button>Back to Health Clearances</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{healthClearance.test}</h1>
          <p className="text-muted-foreground">
            Health clearance for {healthClearance.dogName}
          </p>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <>
              <Button variant="outline" onClick={() => router.push('/dashboard/health-clearances')}>
                Back
              </Button>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Edit Health Clearance</CardTitle>
              <CardDescription>
                Update the details of this health clearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test">Test/Certification</Label>
                <Input
                  id="test"
                  required
                  value={formData.test}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Test Date</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Input
                  id="result"
                  required
                  value={formData.result}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  required
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationNumber">Verification Number</Label>
                <Input
                  id="verificationNumber"
                  required
                  value={formData.verificationNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Health Clearance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Test/Certification</h3>
                  <p className="mt-1">{healthClearance.test}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(healthClearance.status)}`}>
                      {healthClearance.status.charAt(0).toUpperCase() + healthClearance.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Test Date</h3>
                  <p className="mt-1">{new Date(healthClearance.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                  <p className="mt-1">
                    {healthClearance.expiryDate 
                      ? new Date(healthClearance.expiryDate).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Result</h3>
                  <p className="mt-1">{healthClearance.result}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Verification Number</h3>
                  <p className="mt-1">{healthClearance.verificationNumber}</p>
                </div>
              </div>
              
              {healthClearance.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="mt-1 whitespace-pre-line">{healthClearance.notes}</p>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

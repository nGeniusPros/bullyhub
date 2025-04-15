'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, Clock, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { HealthClearanceVerificationResult } from '@/features/health-clearances/types';

export default function VerifyHealthClearancePage() {
  const [verificationNumber, setVerificationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthClearanceVerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationNumber.trim()) {
      toast.error('Please enter a verification number');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`/.netlify/functions/health-clearance-verification?verificationNumber=${verificationNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to verify health clearance');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error verifying health clearance:', error);
      toast.error('Failed to verify health clearance');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Verify Health Clearance</h1>
        <p className="text-muted-foreground mt-2">
          Enter a verification number to check the authenticity of a health clearance
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <CardDescription>
            Enter the verification number from the health clearance certificate
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="verificationNumber">Verification Number</Label>
              <Input
                id="verificationNumber"
                placeholder="e.g., OFA123456, CERF-123, etc."
                value={verificationNumber}
                onChange={(e) => setVerificationNumber(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Verifying...
                </>
              ) : (
                'Verify Health Clearance'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {result && result.verified && result.clearance && (
        <Card className={result.clearance.isExpired ? 'border-red-200' : 'border-green-200'}>
          <CardHeader className={result.clearance.isExpired ? 'bg-red-50' : 'bg-green-50'}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                {getStatusIcon(result.clearance.status)}
                <span className="ml-2">
                  {result.clearance.isExpired ? 'Expired Health Clearance' : 'Valid Health Clearance'}
                </span>
              </CardTitle>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.clearance.isExpired ? 'bg-red-100 text-red-700' :
                result.clearance.status === 'passed' ? 'bg-green-100 text-green-700' :
                result.clearance.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {result.clearance.isExpired ? 'EXPIRED' : result.clearance.status.toUpperCase()}
              </div>
            </div>
            <CardDescription>
              Verification Number: {result.clearance.verificationNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Test/Certification</h3>
                <p className="mt-1 font-medium">{result.clearance.test}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Result</h3>
                <p className="mt-1 font-medium">{result.clearance.result}</p>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Test Date</h3>
                  <p className="text-sm">{format(new Date(result.clearance.date), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              {result.clearance.expiryDate && (
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Expiry Date</h3>
                    <p className={`text-sm ${result.clearance.isExpired ? 'text-red-600 font-medium' : ''}`}>
                      {format(new Date(result.clearance.expiryDate), 'MMMM d, yyyy')}
                      {result.clearance.isExpired && ' (Expired)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-2">Dog Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                  <p className="mt-1">{result.clearance.dogName || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Breed</h4>
                  <p className="mt-1">{result.clearance.dogBreed || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Color</h4>
                  <p className="mt-1">{result.clearance.dogColor || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Verification Information</h3>
                  <p className="text-sm">
                    This health clearance was verified on {format(new Date(result.clearance.verifiedAt), 'MMMM d, yyyy')} at {format(new Date(result.clearance.verifiedAt), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30">
            <div className="text-sm text-muted-foreground">
              {result.clearance.isExpired ? (
                <p className="text-red-600">
                  This health clearance has expired. Please contact the dog owner for updated information.
                </p>
              ) : result.clearance.status === 'passed' ? (
                <p className="text-green-600">
                  This is a valid health clearance that has passed all requirements.
                </p>
              ) : result.clearance.status === 'pending' ? (
                <p className="text-yellow-600">
                  This health clearance is pending final verification or results.
                </p>
              ) : (
                <p className="text-red-600">
                  This health clearance did not meet the required standards.
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
      
      {result && !result.verified && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              Verification Failed
            </CardTitle>
            <CardDescription className="text-red-600">
              The verification number could not be found in our system.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>
              We could not verify the health clearance with the provided verification number. 
              Please check the number and try again, or contact the issuing organization for assistance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

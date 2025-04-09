'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateStudServicePage() {
  const router = useRouter();

  // Mock data for dogs eligible for stud services
  const eligibleDogs = [
    { id: '1', name: 'Max', breed: 'American Bully', color: 'Blue' },
    { id: '3', name: 'Rocky', breed: 'American Bully', color: 'Tri-color' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally save the stud service to the database
    // For now, we'll just redirect back to the stud services page
    router.push('/dashboard/stud-services');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Stud Service</h1>
        <p className="text-muted-foreground">
          Set up a stud service for one of your dogs
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Stud Service Information</CardTitle>
            <CardDescription>
              Enter details about your stud service offering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dog">Dog</Label>
              <Select required>
                <SelectTrigger id="dog">
                  <SelectValue placeholder="Select dog" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleDogs.map((dog) => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name} ({dog.color} {dog.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Only male dogs are eligible for stud services
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">Stud Fee</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  $
                </span>
                <Input
                  id="fee"
                  type="number"
                  placeholder="1000"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your stud's qualities, achievements, and requirements for females"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Requirements for Females</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireDNA"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="requireDNA">Require DNA health testing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireRegistration"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="requireRegistration">Require registration papers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requirePhotos"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="requirePhotos">Require photos of female</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select defaultValue="available">
                <SelectTrigger id="availability">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/stud-services')}
            >
              Cancel
            </Button>
            <Button type="submit">Create Service</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

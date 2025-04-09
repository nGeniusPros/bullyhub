'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function AddDogPage() {
  const router = useRouter();
  const [isStud, setIsStud] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally save the dog to the database
    // For now, we'll just redirect back to the dogs page
    router.push('/dashboard/dogs');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add a New Dog</h1>
        <p className="text-muted-foreground">
          Enter your dog's information to add them to your profile
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Dog Information</CardTitle>
            <CardDescription>
              Basic information about your dog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Select required>
                  <SelectTrigger id="breed">
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="american-bully">American Bully</SelectItem>
                    <SelectItem value="american-bully-pocket">American Bully (Pocket)</SelectItem>
                    <SelectItem value="american-bully-xl">American Bully XL</SelectItem>
                    <SelectItem value="american-bully-classic">American Bully (Classic)</SelectItem>
                    <SelectItem value="american-bully-standard">American Bully (Standard)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="Blue" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isStud"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={isStud}
                  onChange={(e) => setIsStud(e.target.checked)}
                />
                <Label htmlFor="isStud">This dog is available for stud services</Label>
              </div>
            </div>
            {isStud && (
              <div className="space-y-2 border rounded-md p-4">
                <Label htmlFor="studFee">Stud Fee</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    $
                  </span>
                  <Input
                    id="studFee"
                    type="number"
                    placeholder="1000"
                    className="rounded-l-none"
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="studDescription">Stud Description</Label>
                  <Textarea
                    id="studDescription"
                    placeholder="Describe your stud's qualities, achievements, and requirements for females"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your dog's temperament, structure, and other notable qualities"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/dogs')}
            >
              Cancel
            </Button>
            <Button type="submit">Add Dog</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { BreedingProgram } from '@/types';

interface HealthProtocol {
  protocolName: string;
  description: string;
  required: boolean;
  frequency: string;
}

export default function EditBreedingProgramPage({ params }) {
  const router = useRouter();
  const [program, setProgram] = useState<BreedingProgram | null>(null);
  const [goals, setGoals] = useState<string[]>(['']);
  const [healthProtocols, setHealthProtocols] = useState<HealthProtocol[]>([{
    protocolName: '',
    description: '',
    required: true,
    frequency: ''
  }]);
  const [costRange, setCostRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreedingProgram = async () => {
      try {
        const response = await fetch(`/api/breeding-programs/${params.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch breeding program');
        }

        const data = await response.json();
        setProgram(data);

        // Initialize form state with fetched data
        setGoals(data.goals.length > 0 ? data.goals : ['']);
        setHealthProtocols(data.healthProtocols.length > 0
          ? data.healthProtocols
          : [{
              protocolName: '',
              description: '',
              required: true,
              frequency: ''
            }]
        );
        setCostRange(data.costRange || { min: 0, max: 0 });
      } catch (err) {
        console.error('Error fetching breeding program:', err);
        setError('Failed to load breeding program');
      } finally {
        setLoading(false);
      }
    };

    fetchBreedingProgram();
  }, [params.id]);

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const updateGoal = (index: number, value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const updatedGoals = [...goals];
      updatedGoals.splice(index, 1);
      setGoals(updatedGoals);
    }
  };

  const addHealthProtocol = () => {
    setHealthProtocols([...healthProtocols, {
      protocolName: '',
      description: '',
      required: true,
      frequency: ''
    }]);
  };

  const updateHealthProtocol = (index: number, field: string, value: any) => {
    const updatedProtocols = [...healthProtocols];
    updatedProtocols[index] = { ...updatedProtocols[index], [field]: value };
    setHealthProtocols(updatedProtocols);
  };

  const removeHealthProtocol = (index: number) => {
    if (healthProtocols.length > 1) {
      const updatedProtocols = [...healthProtocols];
      updatedProtocols.splice(index, 1);
      setHealthProtocols(updatedProtocols);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const specialConsiderationsText = formData.get('specialConsiderations')?.toString() || '';
      const specialConsiderations = specialConsiderationsText
        .split('\n')
        .filter(s => s.trim() !== '');

      const programData = {
        name: formData.get('name')?.toString(),
        description: formData.get('description')?.toString(),
        goals: goals.filter(g => g.trim() !== ''),
        programType: formData.get('programType')?.toString(),
        colorFocus: formData.get('colorFocus')?.toString(),
        healthProtocols: healthProtocols.filter(h => h.protocolName.trim() !== ''),
        costRange,
        specialConsiderations
      };

      const response = await fetch(`/api/breeding-programs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update breeding program');
      }

      toast({
        title: 'Success',
        description: 'Breeding program updated successfully',
      });

      router.push(`/dashboard/breeding-programs/${params.id}`);
    } catch (error) {
      console.error('Error updating breeding program:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update breeding program',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/breeding-programs/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Program
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error || 'Failed to load breeding program'}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => router.refresh()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href={`/dashboard/breeding-programs/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Program
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Breeding Program</h1>
        <p className="text-muted-foreground">Update your breeding program details</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Breeding Program Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Program Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={program.name}
                placeholder="Blue French Bulldog Program"
                required
              />
            </div>

            {/* Program Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="programType">Program Type</Label>
              <Select name="programType" defaultValue={program.programType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Color Program</SelectItem>
                  <SelectItem value="rare">Rare Color Program</SelectItem>
                  <SelectItem value="specialized">Specialized Coat Type Program</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Standard: Brindle, Fawn, Pied, etc. | Rare: Blue, Chocolate, Lilac, etc. | Specialized: Fluffy/Long-Haired
              </p>
            </div>

            {/* Color Focus */}
            <div className="space-y-2">
              <Label htmlFor="colorFocus">Color Focus</Label>
              <Input
                id="colorFocus"
                name="colorFocus"
                defaultValue={program.colorFocus}
                placeholder="Blue, Brindle, etc."
                required
              />
            </div>

            {/* Cost Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Cost</Label>
                <Input
                  type="number"
                  value={costRange.min}
                  onChange={(e) => setCostRange({ ...costRange, min: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Cost</Label>
                <Input
                  type="number"
                  value={costRange.max}
                  onChange={(e) => setCostRange({ ...costRange, max: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={program.description}
                placeholder="Describe the focus and purpose of your breeding program"
                rows={4}
                required
              />
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Program Goals</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGoal}
                >
                  Add Goal
                </Button>
              </div>
              <div className="space-y-2">
                {goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Goal ${index + 1}`}
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      required
                    />
                    {goals.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeGoal(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Health Protocols */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Health Testing Protocols</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHealthProtocol}
                >
                  Add Protocol
                </Button>
              </div>
              <div className="space-y-4">
                {healthProtocols.map((protocol, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Protocol {index + 1}</h4>
                      {healthProtocols.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeHealthProtocol(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Protocol Name</Label>
                      <Input
                        value={protocol.protocolName}
                        onChange={(e) => updateHealthProtocol(index, 'protocolName', e.target.value)}
                        placeholder="Hip and elbow evaluations"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={protocol.description}
                        onChange={(e) => updateHealthProtocol(index, 'description', e.target.value)}
                        placeholder="Detailed description of the health testing protocol"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input
                          value={protocol.frequency}
                          onChange={(e) => updateHealthProtocol(index, 'frequency', e.target.value)}
                          placeholder="Once per year"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                          id={`required-${index}`}
                          checked={protocol.required}
                          onCheckedChange={(checked) => updateHealthProtocol(index, 'required', !!checked)}
                        />
                        <Label htmlFor={`required-${index}`}>Required</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Considerations */}
            <div className="space-y-2">
              <Label htmlFor="specialConsiderations">Special Considerations</Label>
              <Textarea
                id="specialConsiderations"
                name="specialConsiderations"
                defaultValue={program.specialConsiderations.join('\n')}
                placeholder="Enter any special considerations for this breeding program. Each line will be treated as a separate item."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Enter genetic considerations, specific health concerns, or breeding restrictions. Each line will be treated as a separate item.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/breeding-programs/${params.id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

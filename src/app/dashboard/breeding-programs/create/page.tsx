"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

export default function CreateBreedingProgramPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>([""]);
  const [healthProtocols, setHealthProtocols] = useState<
    Array<{
      protocolName: string;
      description: string;
      required: boolean;
      frequency: string;
    }>
  >([
    {
      protocolName: "",
      description: "",
      required: true,
      frequency: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [costRange, setCostRange] = useState({ min: 0, max: 0 });

  const addGoal = () => {
    setGoals([...goals, ""]);
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
    setHealthProtocols([
      ...healthProtocols,
      {
        protocolName: "",
        description: "",
        required: true,
        frequency: "",
      },
    ]);
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
    setLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const specialConsiderationsText =
        formData.get("specialConsiderations")?.toString() || "";
      const specialConsiderations = specialConsiderationsText
        .split("\n")
        .filter((s) => s.trim() !== "");

      const programData = {
        name: formData.get("name")?.toString(),
        description: formData.get("description")?.toString(),
        goals: goals.filter((g) => g.trim() !== ""),
        programType: formData.get("programType")?.toString(),
        colorFocus: formData.get("colorFocus")?.toString(),
        healthProtocols: healthProtocols.filter(
          (h) => h.protocolName.trim() !== ""
        ),
        costRange,
        specialConsiderations,
      };

      const response = await fetch("/api/breeding-programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create breeding program");
      }

      toast({
        title: "Success",
        description: "Breeding program created successfully",
      });

      router.push("/dashboard/breeding-programs");
    } catch (error) {
      console.error("Error creating breeding program:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create breeding program",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create Breeding Program
        </h1>
        <p className="text-muted-foreground">
          Set up a new breeding program to organize your breeding strategy
        </p>
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
                placeholder="Blue French Bulldog Program"
                required
              />
            </div>

            {/* Program Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="programType">Program Type</Label>
              <Select name="programType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">
                    Standard Color Program
                  </SelectItem>
                  <SelectItem value="rare">Rare Color Program</SelectItem>
                  <SelectItem value="specialized">
                    Specialized Coat Type Program
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Standard: Brindle, Fawn, Pied, etc. | Rare: Blue, Chocolate,
                Lilac, etc. | Specialized: Fluffy/Long-Haired
              </p>
            </div>

            {/* Color Focus */}
            <div className="space-y-2">
              <Label htmlFor="colorFocus">Color Focus</Label>
              <Input
                id="colorFocus"
                name="colorFocus"
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
                  onChange={(e) =>
                    setCostRange({
                      ...costRange,
                      min: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Cost</Label>
                <Input
                  type="number"
                  value={costRange.max}
                  onChange={(e) =>
                    setCostRange({
                      ...costRange,
                      max: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the focus and purpose of your breeding program"
                rows={4}
                required
              />
            </div>
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
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
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
                        onChange={(e) =>
                          updateHealthProtocol(
                            index,
                            "protocolName",
                            e.target.value
                          )
                        }
                        placeholder="Hip and elbow evaluations"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={protocol.description}
                        onChange={(e) =>
                          updateHealthProtocol(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Detailed description of the health testing protocol"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input
                          value={protocol.frequency}
                          onChange={(e) =>
                            updateHealthProtocol(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                          placeholder="Once per year"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                          id={`required-${index}`}
                          checked={protocol.required}
                          onCheckedChange={(checked) =>
                            updateHealthProtocol(index, "required", !!checked)
                          }
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
              <Label htmlFor="specialConsiderations">
                Special Considerations
              </Label>
              <Textarea
                id="specialConsiderations"
                name="specialConsiderations"
                placeholder="Enter any special considerations for this breeding program. Each line will be treated as a separate item."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Enter genetic considerations, specific health concerns, or
                breeding restrictions. Each line will be treated as a separate
                item.
              </p>
            </div>

            {/* Genetic Strategies */}
            <div className="space-y-2">
              <Label>Genetic Strategies</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="linebreeding"
                    name="geneticStrategies"
                    value="linebreeding"
                  />
                  <Label htmlFor="linebreeding">Linebreeding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outcrossing"
                    name="geneticStrategies"
                    value="outcrossing"
                  />
                  <Label htmlFor="outcrossing">Outcrossing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="backmassing"
                    name="geneticStrategies"
                    value="backmassing"
                  />
                  <Label htmlFor="backmassing">Back-massing</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/breeding-programs")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Program"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

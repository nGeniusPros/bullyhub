"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Dna,
  Loader2,
  MessageSquare,
  Palette,
  PieChart,
  Plus,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BreedingPlan {
  id: string;
  name: string;
  sireId: string;
  damId: string;
  breedingProgramId: string;
  plannedDate: string;
  status: "planned" | "in-progress" | "completed" | "cancelled";
  notes: string;
  aiRecommendations: string[];
  compatibility: {
    score: number;
    colorPredictions: { color: string; percentage: number }[];
    healthRisks: { condition: string; risk: string }[];
    coi: number;
  };
}

export default function BreedingPlanningPage() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSire, setSelectedSire] = useState<string>("");
  const [selectedDam, setSelectedDam] = useState<string>("");
  const [plannedDate, setPlannedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [breedingPlans, setBreedingPlans] = useState<BreedingPlan[]>([
    {
      id: "1",
      name: "Blue Line Breeding - Spring 2023",
      sireId: "1",
      damId: "2",
      breedingProgramId: "1",
      plannedDate: "2023-04-15",
      status: "completed",
      notes:
        "Successful breeding with 5 puppies. All puppies have been placed.",
      aiRecommendations: [
        "Good genetic match with low COI",
        "High probability of blue puppies",
        "Monitor for potential skin issues",
      ],
      compatibility: {
        score: 85,
        colorPredictions: [
          { color: "Blue", percentage: 60 },
          { color: "Fawn", percentage: 30 },
          { color: "Blue Fawn", percentage: 10 },
        ],
        healthRisks: [
          { condition: "Hip Dysplasia", risk: "Low" },
          { condition: "Skin Allergies", risk: "Medium" },
        ],
        coi: 4.2,
      },
    },
    {
      id: "2",
      name: "Brindle Program - Summer 2023",
      sireId: "3",
      damId: "4",
      breedingProgramId: "2",
      plannedDate: "2023-07-20",
      status: "in-progress",
      notes: "Breeding confirmed. Ultrasound scheduled for August 10.",
      aiRecommendations: [
        "Moderate genetic match with acceptable COI",
        "High probability of brindle puppies",
        "Consider additional cardiac testing",
      ],
      compatibility: {
        score: 72,
        colorPredictions: [
          { color: "Brindle", percentage: 70 },
          { color: "Fawn", percentage: 20 },
          { color: "Chocolate", percentage: 10 },
        ],
        healthRisks: [
          { condition: "Cardiac Issues", risk: "Medium" },
          { condition: "BOAS", risk: "Low" },
        ],
        coi: 7.8,
      },
    },
    {
      id: "3",
      name: "Lilac Program - Fall 2023",
      sireId: "1",
      damId: "4",
      breedingProgramId: "1",
      plannedDate: "2023-10-05",
      status: "planned",
      notes: "Planning breeding for October. Need to complete health testing.",
      aiRecommendations: [
        "Good genetic match with low COI",
        "Potential for rare colors",
        "Complete BOAS assessment before breeding",
      ],
      compatibility: {
        score: 80,
        colorPredictions: [
          { color: "Blue", percentage: 40 },
          { color: "Chocolate", percentage: 30 },
          { color: "Lilac", percentage: 20 },
          { color: "Fawn", percentage: 10 },
        ],
        healthRisks: [
          { condition: "BOAS", risk: "Medium" },
          { condition: "Hip Dysplasia", risk: "Low" },
        ],
        coi: 5.5,
      },
    },
  ]);

  // Mock data for dogs and breeding programs
  const dogs = [
    {
      id: "1",
      name: "Max",
      breed: "American Bully",
      color: "Blue",
      hasDNA: true,
      isStud: true,
    },
    {
      id: "2",
      name: "Bella",
      breed: "American Bully",
      color: "Fawn",
      hasDNA: true,
      isStud: false,
    },
    {
      id: "3",
      name: "Rocky",
      breed: "American Bully",
      color: "Brindle",
      hasDNA: true,
      isStud: true,
    },
    {
      id: "4",
      name: "Luna",
      breed: "American Bully",
      color: "Chocolate",
      hasDNA: false,
      isStud: false,
    },
  ];

  const breedingPrograms = [
    { id: "1", name: "Blue French Bulldog Program" },
    { id: "2", name: "Standard Brindle Program" },
  ];

  const handleCreatePlan = async () => {
    if (!selectedProgram || !selectedSire || !selectedDam || !plannedDate) {
      return;
    }

    setAnalyzing(true);

    try {
      // In a real implementation, we would call the API
      // For now, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newPlan: BreedingPlan = {
        id: `${breedingPlans.length + 1}`,
        name: `New Breeding Plan - ${new Date().toLocaleDateString()}`,
        sireId: selectedSire,
        damId: selectedDam,
        breedingProgramId: selectedProgram,
        plannedDate,
        status: "planned",
        notes,
        aiRecommendations: [
          "Good genetic match with moderate COI",
          "Potential for diverse color outcomes",
          "Complete all health testing before breeding",
        ],
        compatibility: {
          score: 75,
          colorPredictions: [
            {
              color:
                dogs.find((d) => d.id === selectedSire)?.color || "Unknown",
              percentage: 40,
            },
            {
              color: dogs.find((d) => d.id === selectedDam)?.color || "Unknown",
              percentage: 40,
            },
            { color: "Mixed", percentage: 20 },
          ],
          healthRisks: [
            { condition: "Hip Dysplasia", risk: "Low" },
            { condition: "BOAS", risk: "Medium" },
          ],
          coi: 6.5,
        },
      };

      setBreedingPlans((prev) => [...prev, newPlan]);
      setShowNewPlanDialog(false);

      // Reset form
      setSelectedProgram("");
      setSelectedSire("");
      setSelectedDam("");
      setPlannedDate("");
      setNotes("");
    } catch (error) {
      console.error("Error creating breeding plan:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline">Planned</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      Blue: "bg-blue-500",
      Brindle: "bg-amber-700",
      Fawn: "bg-amber-300",
      Chocolate: "bg-amber-900",
      Black: "bg-black",
      Lilac: "bg-purple-300",
      Merle: "bg-slate-400",
      Pied: "bg-white border border-gray-300",
      "Blue Brindle": "bg-blue-700",
      "Blue Fawn": "bg-blue-300",
    };

    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Breeding Planning
          </h1>
          <p className="text-muted-foreground">
            Plan and manage your breeding program with AI assistance
          </p>
        </div>
        <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Breeding Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Breeding Plan</DialogTitle>
              <DialogDescription>
                Select the breeding program, sire, and dam for your new breeding
                plan. Our AI will analyze compatibility and provide
                recommendations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="program" className="text-right">
                  Program
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedProgram}
                    onValueChange={setSelectedProgram}
                  >
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select breeding program" />
                    </SelectTrigger>
                    <SelectContent>
                      {breedingPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sire" className="text-right">
                  Sire
                </Label>
                <div className="col-span-3">
                  <Select value={selectedSire} onValueChange={setSelectedSire}>
                    <SelectTrigger id="sire">
                      <SelectValue placeholder="Select sire" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs
                        .filter((dog) => dog.isStud && dog.id !== selectedDam)
                        .map((dog) => (
                          <SelectItem key={dog.id} value={dog.id}>
                            <div className="flex items-center">
                              <span>{dog.name}</span>
                              <span className="ml-2 text-muted-foreground">
                                ({dog.color})
                              </span>
                              {!dog.hasDNA && (
                                <span className="ml-auto text-amber-500 text-xs">
                                  No DNA
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dam" className="text-right">
                  Dam
                </Label>
                <div className="col-span-3">
                  <Select value={selectedDam} onValueChange={setSelectedDam}>
                    <SelectTrigger id="dam">
                      <SelectValue placeholder="Select dam" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs
                        .filter((dog) => !dog.isStud && dog.id !== selectedSire)
                        .map((dog) => (
                          <SelectItem key={dog.id} value={dog.id}>
                            <div className="flex items-center">
                              <span>{dog.name}</span>
                              <span className="ml-2 text-muted-foreground">
                                ({dog.color})
                              </span>
                              {!dog.hasDNA && (
                                <span className="ml-auto text-amber-500 text-xs">
                                  No DNA
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Planned Date
                </Label>
                <div className="col-span-3">
                  <Input
                    id="date"
                    type="date"
                    value={plannedDate}
                    onChange={(e) => setPlannedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this breeding plan"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewPlanDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlan}
                disabled={
                  !selectedProgram ||
                  !selectedSire ||
                  !selectedDam ||
                  !plannedDate ||
                  analyzing
                }
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create with AI Analysis
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Breeding Plans</CardTitle>
            <CardDescription>
              View and manage your current and upcoming breeding plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Breeding Pair</TableHead>
                  <TableHead>Planned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compatibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breedingPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getColorClass(
                            dogs.find((d) => d.id === plan.sireId)?.color || ""
                          )}`}
                        ></div>
                        <span>
                          {dogs.find((d) => d.id === plan.sireId)?.name}
                        </span>
                        <span className="text-muted-foreground">×</span>
                        <div
                          className={`w-3 h-3 rounded-full ${getColorClass(
                            dogs.find((d) => d.id === plan.damId)?.color || ""
                          )}`}
                        ></div>
                        <span>
                          {dogs.find((d) => d.id === plan.damId)?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(plan.plannedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress
                          value={plan.compatibility.score}
                          className="h-2 w-16 mr-2"
                        />
                        <span>{plan.compatibility.score}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/breeding/planning/${plan.id}`
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/breeding/compatibility?sire=${plan.sireId}&dam=${plan.damId}`
                            )
                          }
                        >
                          <PieChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-primary" />
                Color Prediction
              </CardTitle>
              <CardDescription>
                Predict puppy colors based on genetics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI-powered color prediction tool analyzes the genetic
                markers of both parents to predict possible coat colors in
                puppies.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Blue", "Brindle", "Fawn", "Chocolate", "Lilac"].map(
                  (color) => (
                    <div key={color} className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getColorClass(
                          color
                        )} mr-1`}
                      ></div>
                      <span className="text-xs">{color}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push("/dashboard/breeding/color-prediction")
                }
              >
                <Palette className="mr-2 h-4 w-4" />
                Open Color Prediction
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                COI Calculator
              </CardTitle>
              <CardDescription>
                Calculate inbreeding coefficient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The Coefficient of Inbreeding (COI) calculator helps you assess
                genetic diversity and make informed breeding decisions.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Low COI (&lt;5%)</span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Recommended
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Medium COI (5-10%)</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-500"
                  >
                    Acceptable
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>High COI (&gt;10%)</span>
                  <Badge
                    variant="outline"
                    className="bg-red-500/10 text-red-500"
                  >
                    Caution
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push("/dashboard/breeding/coi-calculator")
                }
              >
                <PieChart className="mr-2 h-4 w-4" />
                Open COI Calculator
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                AI Stud Receptionist
              </CardTitle>
              <CardDescription>Automate stud service inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI Stud Receptionist handles inquiries about your stud
                services, providing information and collecting details from
                potential customers.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-sm">Answers questions 24/7</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-sm">
                    Provides accurate stud information
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                  <span className="text-sm">Collects customer details</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/stud-services")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Manage Stud Services
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Breeding Calendar</CardTitle>
            <CardDescription>
              View your breeding schedule and important dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertTitle>Upcoming Breeding Events</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-2">
                    {breedingPlans
                      .filter(
                        (plan) =>
                          plan.status === "planned" ||
                          plan.status === "in-progress"
                      )
                      .map((plan) => (
                        <li
                          key={plan.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-muted-foreground ml-2">
                              ({dogs.find((d) => d.id === plan.sireId)?.name} ×{" "}
                              {dogs.find((d) => d.id === plan.damId)?.name})
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm">
                              {new Date(plan.plannedDate).toLocaleDateString()}
                            </span>
                            {getStatusBadge(plan.status)}
                          </div>
                        </li>
                      ))}
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <p className="text-muted-foreground">
                  A more detailed calendar view is coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

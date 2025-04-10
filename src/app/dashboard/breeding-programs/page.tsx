"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Plus,
  Loader2,
  Sparkles,
  AlertCircle,
  Calendar,
  Check,
  MessageSquare,
  Palette,
  PieChart,
} from "lucide-react";

interface BreedingProgram {
  id: string;
  name: string;
  description: string;
  programType: string;
  colorFocus: string;
  goals: string[];
  dogCount: number;
  litterCount: number;
}

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

export default function BreedingProgramsPage() {
  const router = useRouter();

  const [breedingPrograms, setBreedingPrograms] = useState<BreedingProgram[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [errorPrograms, setErrorPrograms] = useState<string | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSire, setSelectedSire] = useState<string>("");
  const [selectedDam, setSelectedDam] = useState<string>("");
  const [plannedDate, setPlannedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);

  const [breedingPlans, setBreedingPlans] = useState<BreedingPlan[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/breeding-programs");
        if (!response.ok) throw new Error("Failed to fetch breeding programs");
        const data = await response.json();
        setBreedingPrograms(data);
      } catch (err) {
        console.error(err);
        setErrorPrograms("Failed to load breeding programs");
      } finally {
        setLoadingPrograms(false);
      }
    };

    const fetchDogs = async () => {
      try {
        const response = await fetch("/api/dogs");
        if (!response.ok) throw new Error("Failed to fetch dogs");
        const data = await response.json();
        setDogs(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBreedingPlans = async () => {
      try {
        const response = await fetch("/api/breeding-plans");
        if (!response.ok) throw new Error("Failed to fetch breeding plans");
        const data = await response.json();
        setBreedingPlans(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrograms();
    fetchDogs();
    fetchBreedingPlans();
  }, []);

  const handleCreatePlan = async () => {
    if (!selectedProgram || !selectedSire || !selectedDam || !plannedDate) return;
    setAnalyzing(true);
    try {
      const response = await fetch("/.netlify/functions/create-breeding-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breedingProgramId: selectedProgram,
          sireId: selectedSire,
          damId: selectedDam,
          plannedDate,
          notes,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Failed to create breeding plan:", result);
        alert(result.error || "Failed to create breeding plan");
      } else {
        // Refresh plans
        const plansResponse = await fetch("/api/breeding-plans");
        const plansData = await plansResponse.json();
        setBreedingPlans(plansData);
        setShowNewPlanDialog(false);
        setSelectedProgram("");
        setSelectedSire("");
        setSelectedDam("");
        setPlannedDate("");
        setNotes("");
      }
    } catch (e) {
      console.error(e);
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
    <div className="space-y-10 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Breeding Programs</h1>
          <p className="text-muted-foreground">Manage your breeding programs with AI assistance</p>
        </div>
        <Link href="/dashboard/breeding-programs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Breeding Programs</h2>
        <Card>
          <CardHeader>
            <CardTitle>Breeding Programs</CardTitle>
            <CardDescription>View and manage your current and upcoming breeding programs</CardDescription>
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
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(dogs.find(d => d.id === plan.sireId)?.color || "")}`}></div>
                        <span>{dogs.find(d => d.id === plan.sireId)?.name}</span>
                        <span className="text-muted-foreground">×</span>
                        <div className={`w-3 h-3 rounded-full ${getColorClass(dogs.find(d => d.id === plan.damId)?.color || "")}`}></div>
                        <span>{dogs.find(d => d.id === plan.damId)?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(plan.plannedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={plan.compatibility.score} className="h-2 w-16 mr-2" />
                        <span>{plan.compatibility.score}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/breeding/planning/${plan.id}`)}>View</Button>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/breeding/compatibility?sire=${plan.sireId}&dam=${plan.damId}`)}>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Palette className="h-5 w-5 mr-2 text-primary" />Color Prediction</CardTitle>
            <CardDescription>Predict puppy colors based on genetics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI-powered color prediction tool analyzes the genetic markers of both parents to predict possible coat colors in puppies.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Blue", "Brindle", "Fawn", "Chocolate", "Lilac"].map(color => (
                <div key={color} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getColorClass(color)} mr-1`}></div>
                  <span className="text-xs">{color}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/breeding/color-prediction")}>
              <Palette className="mr-2 h-4 w-4" />Open Color Prediction
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChart className="h-5 w-5 mr-2 text-primary" />COI Calculator</CardTitle>
            <CardDescription>Calculate inbreeding coefficient</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The Coefficient of Inbreeding (COI) calculator helps you assess genetic diversity and make informed breeding decisions.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>{"Low COI (<5%)"}</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Recommended</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Medium COI (5-10%)</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Acceptable</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{"High COI (>10%)"}</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-500">Caution</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/breeding/coi-calculator")}>
              <PieChart className="mr-2 h-4 w-4" />Open COI Calculator
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquare className="h-5 w-5 mr-2 text-primary" />AI Stud Receptionist</CardTitle>
            <CardDescription>Automate stud service inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI Stud Receptionist handles inquiries about your stud services, providing information and collecting details from potential customers.
            </p>
            <div className="space-y-2">
              <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" /><span className="text-sm">Answers questions 24/7</span></div>
              <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" /><span className="text-sm">Provides accurate stud information</span></div>
              <div className="flex items-start"><Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" /><span className="text-sm">Collects customer details</span></div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/stud-services")}>
              <MessageSquare className="mr-2 h-4 w-4" />Manage Stud Services
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Breeding Calendar</CardTitle>
          <CardDescription>View your breeding schedule and important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Upcoming Breeding Events</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-2">
                  {breedingPlans.filter(p => p.status === "planned" || p.status === "in-progress").map(plan => (
                    <li key={plan.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ({dogs.find(d => d.id === plan.sireId)?.name} × {dogs.find(d => d.id === plan.damId)?.name})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{new Date(plan.plannedDate).toLocaleDateString()}</span>
                        {getStatusBadge(plan.status)}
                      </div>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <p className="text-muted-foreground">A more detailed calendar view is coming soon.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Dog {
  id: string;
  name: string;
}

interface MedicationFormProps {
  dogId?: string;
  onSuccess?: () => void;
  existingMedication?: any;
}

export function MedicationForm({ dogId, onSuccess, existingMedication }: MedicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>(dogId || "");
  const [name, setName] = useState<string>(existingMedication?.name || "");
  const [dosage, setDosage] = useState<string>(existingMedication?.dosage || "");
  const [frequency, setFrequency] = useState<string>(existingMedication?.frequency || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingMedication ? new Date(existingMedication.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    existingMedication?.end_date ? new Date(existingMedication.end_date) : undefined
  );
  const [notes, setNotes] = useState<string>(existingMedication?.notes || "");
  const [isActive, setIsActive] = useState<boolean>(
    existingMedication ? existingMedication.is_active : true
  );

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch("/api/dogs");
        if (!response.ok) {
          throw new Error("Failed to fetch dogs");
        }
        const data = await response.json();
        setDogs(data);
      } catch (error) {
        console.error("Error fetching dogs:", error);
        toast.error("Failed to load dogs");
      }
    };

    fetchDogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDogId) {
      toast.error("Please select a dog");
      return;
    }
    
    if (!name) {
      toast.error("Please enter a medication name");
      return;
    }
    
    if (!dosage) {
      toast.error("Please enter a dosage");
      return;
    }
    
    if (!frequency) {
      toast.error("Please enter a frequency");
      return;
    }
    
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const medicationData = {
        dog_id: selectedDogId,
        name,
        dosage,
        frequency,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate ? endDate.toISOString().split("T")[0] : null,
        notes,
        is_active: isActive,
      };
      
      const url = existingMedication 
        ? `/api/medications/${existingMedication.id}` 
        : "/api/medications";
      
      const method = existingMedication ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicationData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save medication");
      }
      
      toast.success(`Medication ${existingMedication ? "updated" : "created"} successfully`);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/health/${selectedDogId}`);
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      toast.error(`Failed to ${existingMedication ? "update" : "create"} medication`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dog">Dog</Label>
        <Select
          value={selectedDogId}
          onValueChange={setSelectedDogId}
          disabled={!!dogId || isSubmitting}
        >
          <SelectTrigger id="dog">
            <SelectValue placeholder="Select a dog" />
          </SelectTrigger>
          <SelectContent>
            {dogs.map((dog) => (
              <SelectItem key={dog.id} value={dog.id}>
                {dog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Medication Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g., Amoxicillin, Prednisone"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g., 10mg, 1 tablet"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Input
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          disabled={isSubmitting}
          placeholder="e.g., Twice daily, Every 8 hours"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes or instructions"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
          disabled={isSubmitting}
        />
        <Label htmlFor="isActive">Currently Active</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              {existingMedication ? "Updating..." : "Saving..."}
            </>
          ) : (
            existingMedication ? "Update Medication" : "Save Medication"
          )}
        </Button>
      </div>
    </form>
  );
}

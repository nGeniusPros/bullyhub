"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Dog {
  id: string;
  name: string;
}

interface HealthRecordFormProps {
  dogId?: string;
  onSuccess?: () => void;
  existingRecord?: any;
}

export function HealthRecordForm({ dogId, onSuccess, existingRecord }: HealthRecordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogId, setSelectedDogId] = useState<string>(dogId || "");
  const [recordDate, setRecordDate] = useState<Date | undefined>(
    existingRecord ? new Date(existingRecord.record_date) : new Date()
  );
  const [recordType, setRecordType] = useState<string>(existingRecord?.record_type || "");
  const [description, setDescription] = useState<string>(existingRecord?.description || "");
  const [provider, setProvider] = useState<string>(existingRecord?.provider || "");
  const [results, setResults] = useState<string>(existingRecord?.results || "");
  const [notes, setNotes] = useState<string>(existingRecord?.notes || "");
  const [files, setFiles] = useState<FileList | null>(null);

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
    
    if (!recordDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!recordType) {
      toast.error("Please select a record type");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("dog_id", selectedDogId);
      formData.append("record_date", recordDate.toISOString().split("T")[0]);
      formData.append("record_type", recordType);
      formData.append("description", description);
      formData.append("provider", provider);
      formData.append("results", results);
      formData.append("notes", notes);
      
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("documents", files[i]);
        }
      }
      
      const url = existingRecord 
        ? `/api/health-records/${existingRecord.id}` 
        : "/api/health-records";
      
      const method = existingRecord ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to save health record");
      }
      
      toast.success(`Health record ${existingRecord ? "updated" : "created"} successfully`);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/dashboard/health/${selectedDogId}`);
      }
    } catch (error) {
      console.error("Error saving health record:", error);
      toast.error(`Failed to ${existingRecord ? "update" : "create"} health record`);
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
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !recordDate && "text-muted-foreground"
              )}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {recordDate ? format(recordDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={recordDate}
              onSelect={setRecordDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Record Type</Label>
        <Select
          value={recordType}
          onValueChange={setRecordType}
          disabled={isSubmitting}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select a record type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="examination">Examination</SelectItem>
            <SelectItem value="vaccination">Vaccination</SelectItem>
            <SelectItem value="procedure">Procedure</SelectItem>
            <SelectItem value="lab_test">Lab Test</SelectItem>
            <SelectItem value="injury">Injury</SelectItem>
            <SelectItem value="illness">Illness</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Input
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Veterinarian or clinic name"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="results">Results</Label>
        <Textarea
          id="results"
          value={results}
          onChange={(e) => setResults(e.target.value)}
          placeholder="Test results or diagnosis"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="documents">Documents</Label>
        <div className="flex items-center gap-2">
          <Input
            id="documents"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isSubmitting}
            onClick={() => document.getElementById("documents")?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload medical reports, lab results, or other documents (PDF, JPG, PNG)
        </p>
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
              {existingRecord ? "Updating..." : "Saving..."}
            </>
          ) : (
            existingRecord ? "Update Record" : "Save Record"
          )}
        </Button>
      </div>
    </form>
  );
}

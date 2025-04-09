"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Define appointment and veterinarian types
interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  dog_id: string;
  dog?: {
    id: string;
    name: string;
    breed: string;
    color: string;
  };
  veterinarian_id?: string;
  veterinarian?: {
    id: string;
    name: string;
    clinic: string;
    address: string;
    phone: string;
    email: string;
  };
  notes?: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

interface Veterinarian {
  id: string;
  name: string;
  clinic: string;
  specialty?: string;
  address: string;
  phone: string;
  email: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showVetForm, setShowVetForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState({
    upcoming: true,
    past: true,
    veterinarians: true,
  });
  const [error, setError] = useState({
    upcoming: null,
    past: null,
    veterinarians: null,
  });

  // Fetch upcoming appointments
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await fetch("/api/appointments?type=upcoming");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUpcomingAppointments(data);
      } catch (error) {
        console.error("Error fetching upcoming appointments:", error);
        setError((prev) => ({
          ...prev,
          upcoming: "Failed to load upcoming appointments",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, upcoming: false }));
      }
    };

    fetchUpcomingAppointments();
  }, []);

  // Fetch past appointments
  useEffect(() => {
    const fetchPastAppointments = async () => {
      try {
        const response = await fetch("/api/appointments?type=past");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPastAppointments(data);
      } catch (error) {
        console.error("Error fetching past appointments:", error);
        setError((prev) => ({
          ...prev,
          past: "Failed to load past appointments",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, past: false }));
      }
    };

    fetchPastAppointments();
  }, []);

  // Fetch veterinarians
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        const response = await fetch("/api/veterinarians");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setVeterinarians(data);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        setError((prev) => ({
          ...prev,
          veterinarians: "Failed to load veterinarians",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, veterinarians: false }));
      }
    };

    fetchVeterinarians();
  }, []);

  // Appointment Form component
  const AppointmentForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dogName">Dog</Label>
            <Select defaultValue="max">
              <SelectTrigger id="dogName">
                <SelectValue placeholder="Select dog" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="max">Max</SelectItem>
                <SelectItem value="luna">Luna</SelectItem>
                <SelectItem value="rocky">Rocky</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointmentType">Appointment Type</Label>
            <Select defaultValue="checkup">
              <SelectTrigger id="appointmentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkup">Check-up</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="dental">Dental Cleaning</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appointmentDate">Date</Label>
            <Input id="appointmentDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointmentTime">Time</Label>
            <Input id="appointmentTime" type="time" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vetName">Veterinarian/Clinic</Label>
          <Select defaultValue="dr_smith">
            <SelectTrigger id="vetName">
              <SelectValue placeholder="Select veterinarian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr_smith">
                Dr. Smith - City Animal Hospital
              </SelectItem>
              <SelectItem value="dr_johnson">
                Dr. Johnson - City Animal Hospital
              </SelectItem>
              <SelectItem value="dr_wilson">
                Dr. Wilson - PetCare Clinic
              </SelectItem>
              <SelectItem value="petsmart">PetSmart Grooming</SelectItem>
              <SelectItem value="other">Other (specify below)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinicPhone">Phone</Label>
            <Input id="clinicPhone" placeholder="(555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicEmail">Email</Label>
            <Input
              id="clinicEmail"
              type="email"
              placeholder="info@clinic.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinicAddress">Address</Label>
          <Input id="clinicAddress" placeholder="123 Main St, Anytown, USA" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointmentNotes">Notes</Label>
          <Textarea
            id="appointmentNotes"
            placeholder="Reason for visit, special instructions, etc."
          />
        </div>
        <div className="flex justify-end">
          <Button>Save Appointment</Button>
        </div>
      </div>
    );
  };

  // Veterinarian Form component
  const VeterinarianForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vetName">Name</Label>
            <Input id="vetName" placeholder="Dr. Smith" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vetSpecialty">Specialty</Label>
            <Input id="vetSpecialty" placeholder="General Practice" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vetClinic">Clinic</Label>
          <Input id="vetClinic" placeholder="City Animal Hospital" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vetPhone">Phone</Label>
            <Input id="vetPhone" placeholder="(555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vetEmail">Email</Label>
            <Input id="vetEmail" type="email" placeholder="doctor@clinic.com" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vetAddress">Address</Label>
          <Input id="vetAddress" placeholder="123 Main St, Anytown, USA" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vetNotes">Notes</Label>
          <Textarea
            id="vetNotes"
            placeholder="Additional information about this veterinarian"
          />
        </div>
        <div className="flex justify-end">
          <Button>Save Veterinarian</Button>
        </div>
      </div>
    );
  };

  // Appointment Details component
  const AppointmentDetails = ({ appointment }: { appointment: any }) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">
              {appointment.type} for {appointment.dogName}
            </h3>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {new Date(appointment.date).toLocaleDateString()} at{" "}
                {appointment.time}
              </span>
            </div>
          </div>
          <Badge
            variant={
              appointment.status === "confirmed"
                ? "default"
                : appointment.status === "pending"
                ? "secondary"
                : appointment.status === "completed"
                ? "outline"
                : "destructive"
            }
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="bg-muted p-4 rounded-md space-y-3">
          <div>
            <p className="text-sm font-medium">Veterinarian/Clinic</p>
            <p className="text-sm">{appointment.vetName}</p>
            <p className="text-sm">{appointment.clinic}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <p className="text-sm">{appointment.address}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm">{appointment.phone}</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm">{appointment.email}</p>
              </div>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <div>
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm mt-1">{appointment.notes}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {appointment.status !== "completed" && (
            <>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              {appointment.status === "pending" && (
                <Button size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              )}
            </>
          )}
          {appointment.status === "completed" && (
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Report
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Schedule and manage veterinary and grooming appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={showAppointmentForm}
            onOpenChange={setShowAppointmentForm}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Enter the details for your dog's appointment
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="veterinarians">Veterinarians</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading.upcoming ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Loading appointments...</p>
              </CardContent>
            </Card>
          ) : error.upcoming ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{error.upcoming}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <h3 className="font-medium">
                            {appointment.type} -{" "}
                            {appointment.dog?.name || "Unknown Dog"}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </p>
                        <p className="text-sm mt-2">
                          {appointment.veterinarian?.name || "No veterinarian"}{" "}
                          • {appointment.veterinarian?.clinic || "No clinic"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No upcoming appointments
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAppointmentForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {loading.past ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Loading past appointments...
                </p>
              </CardContent>
            </Card>
          ) : error.past ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{error.past}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                          <h3 className="font-medium">
                            {appointment.type} -{" "}
                            {appointment.dog?.name || "Unknown Dog"}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </p>
                        <p className="text-sm mt-2">
                          {appointment.veterinarian?.name || "No veterinarian"}{" "}
                          • {appointment.veterinarian?.clinic || "No clinic"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Completed</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="veterinarians" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Veterinarians</h2>
            <Dialog open={showVetForm} onOpenChange={setShowVetForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Veterinarian
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Veterinarian</DialogTitle>
                  <DialogDescription>
                    Save a veterinarian's information for future appointments
                  </DialogDescription>
                </DialogHeader>
                <VeterinarianForm />
              </DialogContent>
            </Dialog>
          </div>

          {loading.veterinarians ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading veterinarians...</p>
            </div>
          ) : error.veterinarians ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error.veterinarians}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {veterinarians.length > 0 ? (
                veterinarians.map((vet) => (
                  <Card key={vet.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{vet.name}</CardTitle>
                      <CardDescription>{vet.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="font-medium text-sm">{vet.clinic}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vet.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vet.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{vet.email}</span>
                        </div>
                      </div>
                      {vet.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {vet.notes}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 pt-0">
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No veterinarians saved yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowVetForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Veterinarian
                  </Button>
                </div>
              )}
            </div>
          )
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            <AppointmentDetails appointment={selectedAppointment} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

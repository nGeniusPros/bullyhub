"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  MessageSquare,
  Calendar,
  Clock,
  Trash,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useClientInteractions } from "@/hooks/useClientInteractions";
import { Client, ClientInteraction } from "@/types";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getClientById, updateClient, deleteClient, loading: clientLoading, error: clientError } = useClients();
  const { interactions, addInteraction, updateInteraction, deleteInteraction, completeFollowUp, loading: interactionsLoading, error: interactionsError } = useClientInteractions(params.id);
  
  const [client, setClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<Client>>({});
  const [activeTab, setActiveTab] = useState("details");
  const [newInteraction, setNewInteraction] = useState<{
    interactionType: string;
    notes: string;
    followUpDate?: string;
  }>({
    interactionType: "email",
    notes: "",
  });
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      const clientData = await getClientById(params.id);
      if (clientData) {
        setClient(clientData);
        setEditedClient(clientData);
      }
    };

    fetchClient();
  }, [params.id, getClientById]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedClient(client || {});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveClient = async () => {
    if (!client || !editedClient) return;

    const success = await updateClient(client.id, editedClient);
    if (success) {
      setClient({ ...client, ...editedClient });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Client information updated successfully",
      });
    }
  };

  const handleDeleteClient = async () => {
    if (!client) return;

    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      const success = await deleteClient(client.id);
      if (success) {
        toast({
          title: "Success",
          description: "Client deleted successfully",
        });
        router.push("/dashboard/marketing/clients");
      }
    }
  };

  const handleAddInteraction = async () => {
    if (!client) return;

    const interaction: Omit<ClientInteraction, "id" | "createdAt" | "updatedAt"> = {
      clientId: client.id,
      interactionType: newInteraction.interactionType,
      interactionDate: new Date().toISOString(),
      notes: newInteraction.notes,
      followUpDate: newInteraction.followUpDate,
      followUpCompleted: false,
    };

    const result = await addInteraction(interaction);
    if (result) {
      setNewInteraction({
        interactionType: "email",
        notes: "",
      });
      setIsAddingInteraction(false);
      toast({
        title: "Success",
        description: "Interaction added successfully",
      });
    }
  };

  const handleCompleteFollowUp = async (interactionId: string) => {
    await completeFollowUp(interactionId);
  };

  if (clientLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Error</h3>
          </div>
          <p>{clientError || "Client not found"}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/dashboard/marketing/clients")}
          >
            Back to Clients
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/marketing/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {client.firstName} {client.lastName}
          </h1>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
            client.status === 'active' ? 'bg-green-100 text-green-800' :
            client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {client.status === 'active' ? 'Active Client' :
             client.status === 'prospect' ? 'Prospect' :
             'Past Client'}
          </span>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveClient}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDeleteClient}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Client Details</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedClient.firstName || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedClient.lastName || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedClient.email || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedClient.phone || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editedClient.status || "prospect"}
                      onChange={(e) => setEditedClient({ ...editedClient, status: e.target.value as "prospect" | "active" | "past" })}
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      value={editedClient.source || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, source: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{client.firstName} {client.lastName}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{client.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {client.city && client.state && (
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">{client.city}, {client.state}</span>
                      </div>
                    )}
                    {client.source && (
                      <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Source:</span>
                        <span className="ml-2">{client.source}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Client Since:</span>
                      <span className="ml-2">{format(new Date(client.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedClient.notes || ""}
                  onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                  placeholder="Add notes about this client..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {client.notes || "No notes available."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={editedClient.address || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editedClient.city || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editedClient.state || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={editedClient.zip || ""}
                      onChange={(e) => setEditedClient({ ...editedClient, zip: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editedClient.country || "USA"}
                      onChange={(e) => setEditedClient({ ...editedClient, country: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {client.address ? (
                    <div className="space-y-1">
                      <p>{client.address}</p>
                      <p>{client.city}, {client.state} {client.zip}</p>
                      <p>{client.country || "USA"}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No address information available.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Interaction History</CardTitle>
              <Button onClick={() => setIsAddingInteraction(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Interaction
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingInteraction && (
                <Card className="mb-4 border-dashed">
                  <CardHeader>
                    <CardTitle>New Interaction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="interactionType">Type</Label>
                        <select
                          id="interactionType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newInteraction.interactionType}
                          onChange={(e) => setNewInteraction({ ...newInteraction, interactionType: e.target.value })}
                        >
                          <option value="email">Email</option>
                          <option value="call">Phone Call</option>
                          <option value="meeting">Meeting</option>
                          <option value="social">Social Media</option>
                          <option value="text">Text Message</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followUpDate">Follow-up Date (Optional)</Label>
                        <Input
                          id="followUpDate"
                          type="date"
                          value={newInteraction.followUpDate || ""}
                          onChange={(e) => setNewInteraction({ ...newInteraction, followUpDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newInteraction.notes}
                        onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                        placeholder="Enter details about the interaction..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsAddingInteraction(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddInteraction}>
                      Save Interaction
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {interactionsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : interactions && interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions
                    .sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime())
                    .map((interaction) => (
                      <Card key={interaction.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${
                                interaction.interactionType === 'email' ? 'bg-blue-100' :
                                interaction.interactionType === 'call' ? 'bg-green-100' :
                                interaction.interactionType === 'meeting' ? 'bg-purple-100' :
                                interaction.interactionType === 'social' ? 'bg-pink-100' :
                                'bg-gray-100'
                              }`}>
                                {interaction.interactionType === 'email' ? <Mail className="h-4 w-4" /> :
                                 interaction.interactionType === 'call' ? <Phone className="h-4 w-4" /> :
                                 interaction.interactionType === 'meeting' ? <Users className="h-4 w-4" /> :
                                 interaction.interactionType === 'social' ? <MessageSquare className="h-4 w-4" /> :
                                 <MessageSquare className="h-4 w-4" />}
                              </div>
                              <div>
                                <CardTitle className="text-base">{
                                  interaction.interactionType.charAt(0).toUpperCase() + interaction.interactionType.slice(1)
                                }</CardTitle>
                                <CardDescription>{format(new Date(interaction.interactionDate), 'MMM d, yyyy h:mm a')}</CardDescription>
                              </div>
                            </div>
                            {interaction.followUpDate && (
                              <div className={`flex items-center px-3 py-1 rounded-full text-xs ${
                                interaction.followUpCompleted
                                  ? 'bg-green-100 text-green-800'
                                  : new Date(interaction.followUpDate) < new Date()
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                <Calendar className="mr-1 h-3 w-3" />
                                {interaction.followUpCompleted
                                  ? 'Completed'
                                  : `Follow-up: ${format(new Date(interaction.followUpDate), 'MMM d, yyyy')}`}
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">{interaction.notes}</p>
                        </CardContent>
                        {interaction.followUpDate && !interaction.followUpCompleted && (
                          <CardFooter className="pt-0 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteFollowUp(interaction.id)}
                            >
                              Mark as Completed
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No interactions yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Record your first interaction with this client.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

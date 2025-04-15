"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Tag,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useClientInteractions } from "@/hooks/useClientInteractions";
import { Client, ClientInteraction } from "@/types";
import { format } from "date-fns";

export default function ClientManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error, fetchClients } = useClients();

  // Filter clients based on active tab and search term
  const filteredClients = clients.filter((client) => {
    const matchesTab = activeTab === "all" || client.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">
          Manage your clients, prospects, and communication history
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Error</h3>
            </div>
            <p>{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => fetchClients()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Link href="/dashboard/marketing/clients/new">
                <Button variant="default">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </Link>
            </div>
          </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All Clients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="prospect">Prospects</TabsTrigger>
          <TabsTrigger value="past">Past Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-10">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No clients found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-10">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">
                  No active clients found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or add a new client.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

            <TabsContent value="prospect" className="space-y-4">
              <div className="grid gap-4">
                {filteredClients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
                {filteredClients.length === 0 && (
                  <div className="text-center py-10">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No prospects found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new prospect.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-10">
                <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">
                  No past clients found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  const { interactions, loading } = useClientInteractions(client.id);

  // Get latest interaction
  const latestInteraction = interactions && interactions.length > 0
    ? interactions.sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime())[0]
    : null;

  // Get upcoming follow-ups
  const upcomingFollowUps = interactions ? interactions.filter(
    (interaction) =>
      interaction.followUpDate &&
      !interaction.followUpCompleted &&
      new Date(interaction.followUpDate) >= new Date()
  ) : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {client.firstName} {client.lastName}
            </CardTitle>
            <CardDescription>{client.email}</CardDescription>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                client.status === "active"
                  ? "bg-green-100 text-green-800"
                  : client.status === "prospect"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {client.status === "active"
                ? "Active Client"
                : client.status === "prospect"
                ? "Prospect"
                : "Past Client"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {client.phone && (
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                {client.phone}
              </div>
            )}
            {client.city && client.state && (
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {client.city}, {client.state}
              </div>
            )}
            {client.source && (
              <div className="flex items-center text-sm">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                Source: {client.source}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              Last Contact:{" "}
              {latestInteraction
                ? format(
                    new Date(latestInteraction.interactionDate),
                    "yyyy-MM-dd"
                  )
                : "N/A"}
            </div>
            {latestInteraction && (
              <div className="flex items-center text-sm">
                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                Last Interaction: {latestInteraction.interactionType}
              </div>
            )}
            {upcomingFollowUps.length > 0 && (
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                Follow-up:{" "}
                {format(
                  new Date(upcomingFollowUps[0].followUpDate!),
                  "yyyy-MM-dd"
                )}
              </div>
            )}
          </div>
        </div>
        {client.notes && (
          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">{client.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Log Interaction
        </Button>
        <Link href={`/dashboard/marketing/clients/${client.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

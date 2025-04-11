"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Bell,
  Heart,
  Activity,
  Pill,
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  gender: string;
  color: string;
  weight: string;
  image: string;
  lastCheckup?: string;
  nextCheckup?: string;
  healthStatus: "healthy" | "attention" | "critical";
  upcomingReminders: Array<{
    id: string;
    type: string;
    date: string;
    description: string;
  }>;
}

export default function DogsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch("/api/dogs");
        if (!response.ok) {
          throw new Error("Failed to fetch dogs");
        }
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching dogs:", error);
      }
    };

    fetchDogs();
  }, []);

  const getStatusColor = (status: Pet["healthStatus"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "attention":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="welcome-header mb-6">
        <div className="flex flex-col space-y-2 z-10 relative max-w-[60%]">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Dogs</h1>
          <p className="text-white/90">
            Manage your dogs' profiles and health records
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/dashboard/gallery">
              <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                View Gallery
              </Button>
            </Link>
            <Link href="/dashboard/dogs/add">
              <Button className="btn-secondary-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add New Dog
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card
            key={pet.id}
            className="pet-card"
          >
            <Link href={`/dashboard/dogs/${pet.id}`} className="block">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="pet-card-image"
                  width={500}
                  height={300}
                />
              </div>
            </Link>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/dashboard/dogs/${pet.id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                      {pet.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{pet.breed}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${pet.healthStatus === 'healthy' ? 'badge-success' : pet.healthStatus === 'attention' ? 'badge-secondary' : 'badge-danger'}`}
                >
                  {pet.healthStatus.charAt(0).toUpperCase() +
                    pet.healthStatus.slice(1)}
                </span>
              </div>
              <div className="pet-card-stats">
                <div className="pet-stat">
                  <span className="pet-stat-value">{new Date(pet.birthDate).getFullYear()}</span>
                  <span className="pet-stat-label">Birth Year</span>
                </div>
                <div className="pet-stat">
                  <span className="pet-stat-value">{pet.weight}</span>
                  <span className="pet-stat-label">Weight (lbs)</span>
                </div>
                <div className="pet-stat">
                  <span className="pet-stat-value">{pet.gender || 'N/A'}</span>
                  <span className="pet-stat-label">Gender</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Health</span>
                    <span className="text-xs font-medium">{pet.healthStatus === 'healthy' ? '95%' : pet.healthStatus === 'attention' ? '75%' : '45%'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="progress-bar progress-bar-health" style={{ width: pet.healthStatus === 'healthy' ? '95%' : pet.healthStatus === 'attention' ? '75%' : '45%' }}></div>
                  </div>
                </div>
              </div>
              {pet.upcomingReminders.length > 0 && (
                <div className="bg-info-gradient rounded-lg p-3 text-xs text-white mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="h-3 w-3" />
                    <p className="font-medium">
                      Upcoming: {pet.upcomingReminders[0].type}
                    </p>
                  </div>
                  <p className="text-white/80">
                    {new Date(
                      pet.upcomingReminders[0].date
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-white/80 mt-1">
                    {pet.upcomingReminders[0].description}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="bg-primary-gradient hover-lift"
                    onClick={() =>
                      router.push(`/dashboard/dogs/edit/${pet.id}`)
                    }
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-danger-gradient hover-lift"
                    onClick={() => {
                      /* delete logic */
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="bg-success-gradient hover-lift"
                    onClick={() => router.push(`/dashboard/health/${pet.id}`)}
                    title="Health"
                  >
                    <Activity className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-secondary-gradient hover-lift"
                    onClick={() =>
                      router.push(`/dashboard/dogs/${pet.id}`)
                    }
                    title="Appointments"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-info-gradient hover-lift"
                    onClick={() =>
                      router.push(`/dashboard/nutrition/${pet.id}`)
                    }
                    title="Nutrition"
                  >
                    <Pill className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-warning-gradient hover-lift"
                    onClick={() =>
                      router.push(`/dashboard/breeding-programs/${pet.id}`)
                    }
                    title="Breeding"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

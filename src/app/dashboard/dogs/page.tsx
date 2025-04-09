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
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Max",
      breed: "English Bulldog",
      birthDate: "2020-05-15",
      gender: "Male",
      color: "Fawn and White",
      weight: "50",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
      lastCheckup: "2023-12-01",
      nextCheckup: "2024-03-01",
      healthStatus: "healthy",
      upcomingReminders: [
        {
          id: "r1",
          type: "Vaccination",
          date: "2024-02-15",
          description: "Annual vaccination due",
        },
      ],
    },
    {
      id: "2",
      name: "Luna",
      breed: "French Bulldog",
      birthDate: "2021-03-10",
      gender: "Female",
      color: "Brindle",
      weight: "28",
      image: "https://images.unsplash.com/photo-1583511666407-5f06533f2113",
      lastCheckup: "2023-11-15",
      nextCheckup: "2024-02-15",
      healthStatus: "attention",
      upcomingReminders: [
        {
          id: "r2",
          type: "Medication",
          date: "2024-01-20",
          description: "Heartworm prevention due",
        },
      ],
    },
  ]);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dogs</h1>
          <p className="text-muted-foreground">
            Manage your dogs' profiles and health records
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/gallery">
            <Button variant="outline">View Gallery</Button>
          </Link>
          <Link href="/dashboard/dogs/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Dog
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card
            key={pet.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/dashboard/dogs/${pet.id}`} className="block">
              <div className="aspect-video">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="object-cover w-full h-full"
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
                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                    pet.healthStatus
                  )}`}
                >
                  {pet.healthStatus.charAt(0).toUpperCase() +
                    pet.healthStatus.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Birth Date</p>
                  <p>{new Date(pet.birthDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p>{pet.weight} lbs</p>
                </div>
              </div>
              {pet.upcomingReminders.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-2 text-xs">
                  <p className="font-medium text-purple-900">
                    Upcoming: {pet.upcomingReminders[0].type}
                  </p>
                  <p className="text-purple-700">
                    {new Date(
                      pet.upcomingReminders[0].date
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-purple-700">
                    {pet.upcomingReminders[0].description}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/dogs/edit/${pet.id}`)
                    }
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      /* delete logic */
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/health/${pet.id}`)}
                    title="Health"
                  >
                    <Activity className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/appointments/${pet.id}`)
                    }
                    title="Appointments"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/nutrition/${pet.id}`)
                    }
                    title="Nutrition"
                  >
                    <Pill className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/breeding-programs/${pet.id}`)
                    }
                    title="Breeding"
                  >
                    <Heart className="w-4 h-4" />
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

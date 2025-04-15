"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, DollarSign, Activity } from "lucide-react";

export default function StudServicesPage() {
  // Mock data for stud services
  const studServices = [
    {
      id: "1",
      studId: "1",
      dogName: "Max",
      breed: "American Bully",
      color: "Blue",
      fee: 1500,
      description:
        "Champion bloodline, excellent structure, and temperament. DNA health tested and clear.",
      availability: true,
      inquiries: 3,
    },
    {
      id: "2",
      studId: "3",
      dogName: "Rocky",
      breed: "American Bully",
      color: "Tri-color",
      fee: 1200,
      description:
        "Exceptional head structure, muscular build, and great temperament. Health tested.",
      availability: true,
      inquiries: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="welcome-header mb-6">
        <div className="flex flex-col space-y-2 z-10 relative max-w-[60%]">
          <h1 className="text-3xl font-bold tracking-tight text-white">Stud Services</h1>
          <p className="text-white/90">
            Manage your stud services and inquiries
          </p>
          <div className="mt-4">
            <Link href="/dashboard/stud-services/create">
              <Button className="btn-secondary-gradient">
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
                  className="mr-2 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        {studServices.map((service) => (
          <Card key={service.id} className="pet-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{service.dogName}'s Stud Service</CardTitle>
                <div className="badge-gradient">${service.fee}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="pet-card-stats mb-4">
                    <div className="pet-stat">
                      <span className="pet-stat-value">{service.breed}</span>
                      <span className="pet-stat-label">Breed</span>
                    </div>
                    <div className="pet-stat">
                      <span className="pet-stat-value">{service.color}</span>
                      <span className="pet-stat-label">Color</span>
                    </div>
                    <div className="pet-stat">
                      <span className="pet-stat-value">{service.inquiries}</span>
                      <span className="pet-stat-label">Inquiries</span>
                    </div>
                  </div>
                  <div className="text-sm mb-4">
                    <p className="text-sm font-medium mb-1">Description:</p>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-info-gradient p-4 text-white">
                    <div className="text-sm font-medium mb-1">Status</div>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          service.availability ? "bg-green-300" : "bg-red-300"
                        }`}
                      ></span>
                      <span>
                        {service.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary-gradient p-4 text-white">
                    <div className="text-sm font-medium mb-1">Inquiries</div>
                    <div className="text-2xl font-bold">
                      {service.inquiries}
                    </div>
                    {service.inquiries > 0 && (
                      <div className="text-xs text-white/80 mt-1">
                        {service.inquiries} pending{" "}
                        {service.inquiries === 1 ? "inquiry" : "inquiries"}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <Badge
                      className="bg-success-gradient text-white flex items-center gap-1 hover:bg-success-gradient"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>AI Receptionist Available</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Link href={`/dashboard/stud-services/${service.id}`}>
                <Button className="bg-primary-gradient hover-lift" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Service
                </Button>
              </Link>
              <Link
                href={`/dashboard/stud-services/${service.id}/receptionist`}
              >
                <Button className="bg-secondary-gradient hover-lift" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Receptionist
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stud Services</h1>
          <p className="text-muted-foreground">
            Manage your stud services and inquiries
          </p>
        </div>
        <Link href="/dashboard/stud-services/create">
          <Button>
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
      <div className="grid gap-6">
        {studServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{service.dogName}'s Stud Service</CardTitle>
                <div className="text-sm font-medium">${service.fee}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Breed:</span>{" "}
                    {service.breed}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Color:</span>{" "}
                    {service.color}
                  </div>
                  <div className="text-sm mb-4">
                    <p className="text-muted-foreground mb-1">Description:</p>
                    <p>{service.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="text-sm font-medium mb-1">Status</div>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          service.availability ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span>
                        {service.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <div className="text-sm font-medium mb-1">Inquiries</div>
                    <div className="text-2xl font-bold">
                      {service.inquiries}
                    </div>
                    {service.inquiries > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {service.inquiries} pending{" "}
                        {service.inquiries === 1 ? "inquiry" : "inquiries"}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
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
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Service
                </Button>
              </Link>
              <Link
                href={`/dashboard/stud-services/${service.id}/receptionist`}
              >
                <Button variant="secondary" size="sm">
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MultiServiceKennelTemplate() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    kennelName: "Bulldog Haven",
    tagline: "Complete Bulldog Care & Services",
    aboutUs: "Bulldog Haven is a full-service facility dedicated to all aspects of Bulldog care, breeding, and training. Our state-of-the-art kennel offers a wide range of services for Bulldog owners and enthusiasts, from breeding and boarding to training and grooming.",
    facilities: "Our 5-acre property features climate-controlled indoor facilities, spacious outdoor play areas, a training center, grooming salon, and veterinary care station. All designed specifically with Bulldogs' unique needs in mind.",
    services: [
      {
        name: "Breeding Program",
        description: "Health-focused breeding of French and English Bulldogs with champion bloodlines",
        price: "Puppies starting at $3,500"
      },
      {
        name: "Boarding",
        description: "Luxury boarding with 24/7 supervision and breed-specific care",
        price: "$65/night"
      },
      {
        name: "Training",
        description: "Specialized training programs for Bulldogs of all ages",
        price: "From $85/session"
      },
      {
        name: "Grooming",
        description: "Complete grooming services tailored to Bulldog needs",
        price: "From $55"
      },
      {
        name: "Daycare",
        description: "Supervised play and socialization with other Bulldogs",
        price: "$35/day"
      }
    ],
    staff: [
      {
        name: "Dr. James Wilson",
        title: "Owner & Head Breeder",
        bio: "Veterinarian with 15 years of experience specializing in Bulldogs",
        image: "/assets/staff/james.jpg"
      },
      {
        name: "Maria Rodriguez",
        title: "Head Trainer",
        bio: "Certified dog trainer with expertise in brachycephalic breeds",
        image: "/assets/staff/maria.jpg"
      },
      {
        name: "Kevin Chen",
        title: "Grooming Specialist",
        bio: "Award-winning groomer with 8 years of Bulldog-specific experience",
        image: "/assets/staff/kevin.jpg"
      }
    ],
    testimonials: [
      {
        name: "The Anderson Family",
        text: "We've used Bulldog Haven for boarding, training, and grooming for our two Frenchies. The specialized care they provide is unmatched.",
        service: "Multiple Services"
      },
      {
        name: "Sarah Johnson",
        text: "Our puppy from Bulldog Haven is healthy, well-socialized, and exactly what we were looking for. The ongoing support has been incredible.",
        service: "Breeding Program"
      }
    ],
    contactInfo: {
      email: "info@bulldoghaven.com",
      phone: "(555) 456-7890",
      location: "Portland, OR",
      hours: "Monday-Saturday: 7am-7pm, Sunday: 9am-5pm"
    }
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Template settings saved successfully");
    } catch (error) {
      toast.error("Failed to save template settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Service Kennel Template</h2>
          <p className="text-muted-foreground">
            Designed for kennels offering multiple services beyond breeding
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open("/preview/multi-service-kennel", "_blank")}>
          Preview Template
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set your multi-service kennel name and basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kennelName">Kennel Name</Label>
                <Input
                  id="kennelName"
                  value={settings.kennelName}
                  onChange={(e) => handleChange("kennelName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="A short slogan for your multi-service kennel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutUs">About Us</Label>
                <Textarea
                  id="aboutUs"
                  value={settings.aboutUs}
                  onChange={(e) => handleChange("aboutUs", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities Description</Label>
                <Textarea
                  id="facilities"
                  value={settings.facilities}
                  onChange={(e) => handleChange("facilities", e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How clients can reach you and your business hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.contactInfo.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.contactInfo.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={settings.contactInfo.location}
                  onChange={(e) => handleContactChange("location", e.target.value)}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Input
                  id="hours"
                  value={settings.contactInfo.hours}
                  onChange={(e) => handleContactChange("hours", e.target.value)}
                  placeholder="e.g., Monday-Friday: 9am-5pm"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Template Settings"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

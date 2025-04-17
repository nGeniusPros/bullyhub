"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProfessionalBreederTemplate() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    kennelName: "Elite Bulldogs",
    tagline: "Champion Bloodlines, Exceptional Quality",
    aboutUs: "Elite Bulldogs is a professional breeding program dedicated to producing the highest quality French and English Bulldogs with exceptional temperaments, health, and conformation. With over 15 years of experience, our breeding program focuses on health testing, genetic diversity, and adherence to breed standards.",
    mission: "Our mission is to improve the Bulldog breed through careful selection, comprehensive health testing, and responsible breeding practices. We are committed to producing dogs that excel in both the show ring and as loving family companions.",
    featuredDogs: [
      {
        name: "Champion Elites Royal Flush",
        description: "Multi-champion French Bulldog with exceptional structure and temperament",
        image: "/assets/dogs/featured-1.jpg"
      },
      {
        name: "Grand Champion Elites Midnight Star",
        description: "Award-winning English Bulldog with perfect conformation",
        image: "/assets/dogs/featured-2.jpg"
      }
    ],
    services: [
      "Show-quality puppies",
      "Stud services",
      "Breeding consultations",
      "Show handling services",
      "Health testing and certification"
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        text: "We couldn't be happier with our puppy from Elite Bulldogs. The health testing, socialization, and support have been exceptional.",
        location: "New York, NY"
      },
      {
        name: "Michael Chen",
        text: "As a show handler, I've worked with many breeders, but Elite Bulldogs stands out for their commitment to breed improvement and health.",
        location: "Los Angeles, CA"
      }
    ],
    contactInfo: {
      email: "contact@elitebulldogs.com",
      phone: "(555) 123-4567",
      location: "Seattle, WA"
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
          <h2 className="text-2xl font-bold">Professional Breeder Template</h2>
          <p className="text-muted-foreground">
            Perfect for established breeders with show dogs and champion bloodlines
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open("/preview/professional-breeder", "_blank")}>
          Preview Template
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set your kennel name and basic information
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
                  placeholder="A short slogan for your kennel"
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
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={settings.mission}
                  onChange={(e) => handleChange("mission", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How potential clients can reach you
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

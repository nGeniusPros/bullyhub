"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ShowKennelTemplate() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    kennelName: "Champion Bulldogs",
    tagline: "Excellence in the Show Ring",
    aboutUs: "Champion Bulldogs is dedicated to breeding and showing the finest French and English Bulldogs in the country. Our dogs have won numerous titles at national and international competitions, and we take pride in our commitment to breed excellence and preservation.",
    showAchievements: "Our dogs have earned over 25 championship titles, including Best in Show at the National Bulldog Specialty and multiple Group placements at AKC events.",
    featuredChampions: [
      {
        name: "GCH Champion's Royal Flush",
        titles: "Grand Champion, Best in Specialty Show",
        achievements: "15 Best of Breed wins, 5 Group placements",
        image: "/assets/dogs/champion-1.jpg"
      },
      {
        name: "CH Champion's Rising Star",
        titles: "Champion, Award of Merit Winner",
        achievements: "10 Best of Breed wins, 3 Group placements",
        image: "/assets/dogs/champion-2.jpg"
      }
    ],
    upcomingShows: [
      {
        name: "National Bulldog Specialty",
        date: "June 15-17, 2025",
        location: "Chicago, IL"
      },
      {
        name: "Western Regional Championship",
        date: "August 22-24, 2025",
        location: "Denver, CO"
      }
    ],
    showServices: [
      "Professional handling",
      "Show preparation",
      "Show prospect evaluation",
      "Handler training",
      "Show strategy consultation"
    ],
    testimonials: [
      {
        name: "Robert Williams",
        text: "Champion Bulldogs has produced some of the finest show dogs I've had the pleasure to judge. Their commitment to breed standard is exemplary.",
        title: "AKC Judge"
      },
      {
        name: "Elizabeth Chen",
        text: "As a fellow exhibitor, I've always admired the quality and presentation of Champion Bulldogs' entries. Their dogs are consistently outstanding.",
        title: "Professional Handler"
      }
    ],
    contactInfo: {
      email: "info@championbulldogs.com",
      phone: "(555) 987-6543",
      location: "Portland, OR"
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
          <h2 className="text-2xl font-bold">Show Kennel Template</h2>
          <p className="text-muted-foreground">
            Designed for kennels focused on showing and competition
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open("/preview/show-kennel", "_blank")}>
          Preview Template
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set your show kennel name and basic information
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
                  placeholder="A short slogan for your show kennel"
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
                <Label htmlFor="showAchievements">Show Achievements</Label>
                <Textarea
                  id="showAchievements"
                  value={settings.showAchievements}
                  onChange={(e) => handleChange("showAchievements", e.target.value)}
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
                How potential clients and fellow exhibitors can reach you
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

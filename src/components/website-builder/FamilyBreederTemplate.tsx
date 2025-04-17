"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function FamilyBreederTemplate() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    kennelName: "Happy Tails Bulldogs",
    tagline: "Healthy, Happy Bulldogs for Loving Homes",
    aboutUs: "Happy Tails Bulldogs is a small, family-run breeding program focused on raising healthy, well-socialized French Bulldogs in our home. Our dogs are first and foremost beloved family members, and we strive to produce puppies with excellent temperaments and health that will bring joy to their new families.",
    ourFamily: "We're the Johnson family - Mark, Lisa, and our children Emma and Jack. We've been passionate about Bulldogs for over 10 years and started our small breeding program to share our love for the breed with other families.",
    puppyRaising: "Our puppies are raised in our home with our family, including our children. They are well-socialized with people, other dogs, and household sounds. We follow Puppy Culture protocols and focus on early neurological stimulation and enrichment.",
    availablePuppies: {
      hasLitter: true,
      litterDescription: "We currently have a litter of 5 French Bulldog puppies born on March 15, 2025. They will be ready for their new homes around May 10, 2025.",
      reservationProcess: "We require an application and interview process, followed by a $500 non-refundable deposit to reserve a puppy."
    },
    healthTesting: "All our breeding dogs undergo health testing including OFA hip and elbow evaluations, cardiac exams, BOAS assessment, and genetic testing for breed-specific conditions.",
    testimonials: [
      {
        name: "The Smith Family",
        text: "Our Frenchie from Happy Tails is the perfect addition to our family. She came to us well-socialized and healthy, and the support from the Johnsons has been amazing.",
        location: "Portland, OR"
      },
      {
        name: "David and Maria",
        text: "The care and attention that Happy Tails puts into raising their puppies is evident. Our boy is healthy, confident, and has the best temperament.",
        location: "Seattle, WA"
      }
    ],
    contactInfo: {
      email: "happytailsbulldogs@example.com",
      phone: "(555) 234-5678",
      location: "Vancouver, WA"
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
          <h2 className="text-2xl font-bold">Family Breeder Template</h2>
          <p className="text-muted-foreground">
            Perfect for small, family-focused breeding programs
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open("/preview/family-breeder", "_blank")}>
          Preview Template
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set your family kennel name and basic information
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
                  placeholder="A short slogan for your family kennel"
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
                <Label htmlFor="ourFamily">Our Family</Label>
                <Textarea
                  id="ourFamily"
                  value={settings.ourFamily}
                  onChange={(e) => handleChange("ourFamily", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="puppyRaising">How We Raise Our Puppies</Label>
                <Textarea
                  id="puppyRaising"
                  value={settings.puppyRaising}
                  onChange={(e) => handleChange("puppyRaising", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthTesting">Health Testing</Label>
                <Textarea
                  id="healthTesting"
                  value={settings.healthTesting}
                  onChange={(e) => handleChange("healthTesting", e.target.value)}
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
                How potential puppy families can reach you
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

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function KennelWebsiteSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    kennelName: "Bulldog Haven",
    subdomain: "bulldoghaven",
    template: "professional-breeder",
    description: "We are a small family kennel specializing in healthy, well-socialized French Bulldogs.",
    contactEmail: "contact@bulldoghaven.com",
    contactPhone: "(555) 123-4567",
    location: "Seattle, WA",
    socialLinks: {
      facebook: "https://facebook.com/bulldoghaven",
      instagram: "https://instagram.com/bulldoghaven",
    },
    published: true,
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Website settings saved successfully");
    } catch (error) {
      toast.error("Failed to save website settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kennel Website Settings</CardTitle>
        <CardDescription>
          Configure your public-facing kennel website
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="subdomain"
                value={settings.subdomain}
                onChange={(e) => handleChange("subdomain", e.target.value)}
                required
                className="flex-1"
              />
              <span className="text-muted-foreground">.petpals.com</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This will be your website address: {settings.subdomain}.petpals.com
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Website Template</Label>
            <Select
              value={settings.template}
              onValueChange={(value) => handleChange("template", value)}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional-breeder">Professional Breeder</SelectItem>
                <SelectItem value="show-kennel">Show Kennel</SelectItem>
                <SelectItem value="family-breeder">Family Breeder</SelectItem>
                <SelectItem value="multi-service-kennel">Multi-Service Kennel</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              <a href="/dashboard/website-templates" className="text-primary underline">
                Preview templates
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Kennel Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => handleChange("contactPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={settings.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/yourkennelname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleSocialChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourkennelname"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="published"
              checked={settings.published}
              onChange={(e) => handleChange("published", e.target.checked.toString())}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="published" className="text-sm font-medium">
              Publish website (make it visible to the public)
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Preview Website
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

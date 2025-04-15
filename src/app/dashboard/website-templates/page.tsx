"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useKennelWebsite } from "@/hooks/useKennelWebsite";
import Link from "next/link";

// Import existing components for compatibility
import TemplatePreview from "@/components/website-builder/TemplatePreview";

// Template metadata (expand as needed)
const TEMPLATES = [
  {
    id: "professional-breeder",
    name: "Professional Breeder",
    description: "Ideal for established kennels with extensive breeding programs.",
  },
  {
    id: "show-kennel",
    name: "Show Kennel",
    description: "Perfect for competition-focused kennels with champion dogs.",
  },
  {
    id: "family-breeder",
    name: "Family Breeder",
    description: "Great for smaller, home-based kennels focused on companion animals.",
  },
  {
    id: "multi-service-kennel",
    name: "Multi-Service Kennel",
    description: "For kennels offering breeding, training, boarding, and more.",
  },
];

// Main Website Builder Page
export default function WebsiteTemplatesPage() {
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(true);
  // We need to track user profile for authentication
  const [, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional-breeder");
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [kennelName, setKennelName] = useState("");
  const [kennelAbout, setKennelAbout] = useState("");
  const [kennelEmail, setKennelEmail] = useState("");
  const [kennelPhone, setKennelPhone] = useState("");
  const [kennelAddress, setKennelAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [siteNameAvailable, setSiteNameAvailable] = useState(true);
  const [siteNameChecking, setSiteNameChecking] = useState(false);

  const { fetchKennelWebsites, createKennelWebsite, updateKennelWebsite, checkSiteNameAvailability } = useKennelWebsite();
  // We need to track kennel websites for the user
  const [, setKennelWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) {
            throw error;
          }

          setUserProfile(profile);

          // Fetch kennel websites
          const websites = await fetchKennelWebsites();
          setKennelWebsites(websites);

          // Select the first website if available
          if (websites && websites.length > 0) {
            setSelectedWebsite(websites[0]);
            populateFormFromWebsite(websites[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [supabase, fetchKennelWebsites]);

  // Populate form with selected website data
  const populateFormFromWebsite = (website: any) => {
    setSiteName(website.siteName);
    setSelectedTemplate(website.templateType);
    setKennelName(website.content?.kennelName || "");
    setKennelAbout(website.content?.about || "");
    setKennelEmail(website.content?.contact?.email || "");
    setKennelPhone(website.content?.contact?.phone || "");
    setKennelAddress(website.content?.contact?.address || "");
    setLogoUrl(website.logoUrl || "");
    setUseCustomDomain(!!website.domain);
    setCustomDomain(website.domain || "");
  };

  // Handle site name change and check availability
  const handleSiteNameChange = async (value: string) => {
    setSiteName(value);

    if (value.length > 2) {
      setSiteNameChecking(true);
      const isAvailable = await checkSiteNameAvailability(value);
      setSiteNameAvailable(isAvailable);
      setSiteNameChecking(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      // Validate form
      if (!siteName) {
        toast.error("Site name is required");
        return;
      }

      if (!siteNameAvailable && !selectedWebsite) {
        toast.error("Site name is already taken");
        return;
      }

      // Get user ID for breeder ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Prepare website data
      const websiteData = {
        templateType: selectedTemplate as any,
        siteName: siteName,
        domain: useCustomDomain ? customDomain : undefined,
        logoUrl: logoUrl,
        breederId: user.id,
        published: false,
        content: {
          kennelName: kennelName,
          about: kennelAbout,
          contact: {
            email: kennelEmail,
            phone: kennelPhone,
            address: kennelAddress,
          },
        },
      };

      let result: any;

      if (!selectedWebsite) {
        // Create new website
        result = await createKennelWebsite(websiteData);
        if (result) {
          toast.success("Kennel website created successfully");
          setSelectedWebsite(result);

          // Refresh the list of websites
          const websites = await fetchKennelWebsites();
          setKennelWebsites(websites);
        }
      } else {
        // Update existing website
        result = await updateKennelWebsite(selectedWebsite.id, websiteData);
        if (result) {
          toast.success("Kennel website updated successfully");
          setSelectedWebsite(result);

          // Refresh the list of websites
          const websites = await fetchKennelWebsites();
          setKennelWebsites(websites);
        }
      }
    } catch (error) {
      console.error("Error saving website settings:", error);
      toast.error("Failed to save website settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Templates</h1>
        <p className="text-muted-foreground">
          Configure your kennel website settings and template
        </p>
      </div>

      <Card className="bg-card-gradient-primary">
        <CardHeader>
          <CardTitle>Website Configuration</CardTitle>
          <CardDescription>
            Customize your kennel website appearance and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="bg-card-gradient-primary">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="domain">Domain</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kennel-name">Kennel Name</Label>
                  <Input
                    id="kennel-name"
                    placeholder="Your Kennel Name"
                    value={kennelName}
                    onChange={(e) => setKennelName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    placeholder="https://example.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to your logo image. Recommended size: 200x200px.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Template Tab */}
            <TabsContent value="template" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="template-type">Template Type</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>

                <div className="mt-4">
                  <Label>Template Preview</Label>
                  <div className="mt-2 border rounded-lg p-4">
                    <TemplatePreview templateId={selectedTemplate} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="about">About Your Kennel</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell visitors about your kennel..."
                    value={kennelAbout}
                    onChange={(e) => setKennelAbout(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={kennelEmail}
                      onChange={(e) => setKennelEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input
                      id="phone"
                      placeholder="(123) 456-7890"
                      value={kennelPhone}
                      onChange={(e) => setKennelPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Your kennel's address"
                    value={kennelAddress}
                    onChange={(e) => setKennelAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Domain Tab */}
            <TabsContent value="domain" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="site-name">Subdomain</Label>
                  <div className="flex items-center">
                    <Input
                      id="site-name"
                      placeholder="your-kennel"
                      value={siteName}
                      onChange={(e) => handleSiteNameChange(e.target.value)}
                      className={!siteNameAvailable && !selectedWebsite ? "border-red-500" : ""}
                    />
                    <span className="ml-2">.petpals.com</span>
                  </div>
                  {siteNameChecking && (
                    <p className="text-xs text-muted-foreground">Checking availability...</p>
                  )}
                  {!siteNameAvailable && !selectedWebsite && (
                    <p className="text-xs text-red-500">This subdomain is already taken</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="custom-domain"
                    checked={useCustomDomain}
                    onCheckedChange={setUseCustomDomain}
                  />
                  <Label htmlFor="custom-domain">Use custom domain</Label>
                </div>

                {useCustomDomain && (
                  <div className="grid gap-2">
                    <Label htmlFor="custom-domain-input">Custom Domain</Label>
                    <Input
                      id="custom-domain-input"
                      placeholder="yourkennel.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll need to configure DNS settings with your domain provider.
                      <Link href="/docs/dns-configuration" className="text-primary ml-1 inline-flex items-center">
                        Learn more
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="btn-gradient-3color"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

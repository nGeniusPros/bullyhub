import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useKennelWebsite } from "@/hooks/useKennelWebsite";
import { toast } from "sonner";
import { KennelWebsite } from "@/types";
import { Loader2, Globe, PlusCircle, ExternalLink, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface KennelWebsiteSettingsProps {
  userProfile: any;
}

// Template metadata
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

const KennelWebsiteSettings: React.FC<KennelWebsiteSettingsProps> = ({ userProfile }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [kennelWebsites, setKennelWebsites] = useState<KennelWebsite[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<KennelWebsite | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteNameAvailable, setSiteNameAvailable] = useState(true);
  const [siteNameChecking, setSiteNameChecking] = useState(false);
  const [templateType, setTemplateType] = useState<string>("professional-breeder");
  const [kennelName, setKennelName] = useState("");
  const [kennelAbout, setKennelAbout] = useState("");
  const [kennelEmail, setKennelEmail] = useState("");
  const [kennelPhone, setKennelPhone] = useState("");
  const [kennelAddress, setKennelAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    loading,
    error,
    fetchKennelWebsites,
    createKennelWebsite,
    updateKennelWebsite,
    publishKennelWebsite,
    unpublishKennelWebsite,
    checkSiteNameAvailability,
  } = useKennelWebsite();

  // Fetch kennel websites on component mount
  useEffect(() => {
    const loadKennelWebsites = async () => {
      if (userProfile) {
        const websites = await fetchKennelWebsites();
        setKennelWebsites(websites);
        
        // Select the first website if available
        if (websites && websites.length > 0) {
          setSelectedWebsite(websites[0]);
          populateFormFromWebsite(websites[0]);
        }
      }
    };
    
    loadKennelWebsites();
  }, [userProfile, fetchKennelWebsites]);

  // Populate form with selected website data
  const populateFormFromWebsite = (website: KennelWebsite) => {
    setSiteName(website.siteName);
    setTemplateType(website.templateType);
    setKennelName(website.content?.kennelName || "");
    setKennelAbout(website.content?.about || "");
    setKennelEmail(website.content?.contact?.email || "");
    setKennelPhone(website.content?.contact?.phone || "");
    setKennelAddress(website.content?.contact?.address || "");
    setLogoUrl(website.logoUrl || "");
    setUseCustomDomain(!!website.domain);
    setCustomDomain(website.domain || "");
  };

  // Reset form for creating a new website
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedWebsite(null);
    setSiteName("");
    setTemplateType("professional-breeder");
    setKennelName("");
    setKennelAbout("");
    setKennelEmail("");
    setKennelPhone("");
    setKennelAddress("");
    setLogoUrl("");
    setUseCustomDomain(false);
    setCustomDomain("");
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

  // Handle save website
  const handleSaveWebsite = async () => {
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
      
      // Prepare website data
      const websiteData = {
        templateType: templateType as any,
        siteName: siteName,
        domain: useCustomDomain ? customDomain : undefined,
        logoUrl: logoUrl,
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
      
      let result;
      
      if (isCreatingNew) {
        // Create new website
        result = await createKennelWebsite(websiteData);
        if (result) {
          toast.success("Kennel website created successfully");
          setIsCreatingNew(false);
          setSelectedWebsite(result);
          
          // Refresh the list of websites
          const websites = await fetchKennelWebsites();
          setKennelWebsites(websites);
        }
      } else if (selectedWebsite) {
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
      console.error("Error saving website:", error);
      toast.error("Failed to save website");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle publish/unpublish website
  const handlePublishToggle = async () => {
    if (!selectedWebsite) return;
    
    try {
      setIsPublishing(true);
      
      if (selectedWebsite.published) {
        // Unpublish
        const result = await unpublishKennelWebsite(selectedWebsite.id);
        if (result) {
          toast.success("Website unpublished successfully");
          setSelectedWebsite({...selectedWebsite, published: false});
        }
      } else {
        // Publish
        const result = await publishKennelWebsite(selectedWebsite.id);
        if (result) {
          toast.success("Website published successfully");
          setSelectedWebsite({...selectedWebsite, published: true, publishedAt: new Date().toISOString()});
        }
      }
      
      // Refresh the list of websites
      const websites = await fetchKennelWebsites();
      setKennelWebsites(websites);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle website selection
  const handleWebsiteSelect = (website: KennelWebsite) => {
    setIsCreatingNew(false);
    setSelectedWebsite(website);
    populateFormFromWebsite(website);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card-gradient-primary">
        <CardHeader>
          <CardTitle>Kennel Website</CardTitle>
          <CardDescription>
            Create and manage your public-facing kennel website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Website Selection Sidebar */}
            <div className="w-full md:w-1/4 space-y-4">
              <h3 className="text-lg font-medium">Your Websites</h3>
              <div className="space-y-2">
                {kennelWebsites.map((website) => (
                  <div
                    key={website.id}
                    className={`p-3 rounded-md cursor-pointer transition-all ${
                      selectedWebsite?.id === website.id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-white/50 border border-gray-200 hover:bg-primary/5"
                    }`}
                    onClick={() => handleWebsiteSelect(website)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{website.siteName}</span>
                      {website.published && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <Check className="w-3 h-3 mr-1" /> Live
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {website.templateType.replace(/-/g, " ")}
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCreateNew}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Website
                </Button>
              </div>
            </div>
            
            {/* Website Settings Form */}
            <div className="w-full md:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {(selectedWebsite || isCreatingNew) ? (
                    <Tabs
                      defaultValue="general"
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="space-y-4"
                    >
                      <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="domain">Domain</TabsTrigger>
                        <TabsTrigger value="publishing">Publishing</TabsTrigger>
                      </TabsList>
                      
                      {/* General Tab */}
                      <TabsContent value="general" className="space-y-4">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="template-type">Template Type</Label>
                            <Select
                              value={templateType}
                              onValueChange={setTemplateType}
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
                              {TEMPLATES.find(t => t.id === templateType)?.description}
                            </p>
                          </div>
                          
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
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSaveWebsite}
                              disabled={isSaving}
                              className="btn-gradient-3color"
                            >
                              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save Changes
                            </Button>
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
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSaveWebsite}
                              disabled={isSaving}
                              className="btn-gradient-3color"
                            >
                              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save Changes
                            </Button>
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
                                  Learn more <ExternalLink className="w-3 h-3 ml-1" />
                                </Link>
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleSaveWebsite}
                              disabled={isSaving}
                              className="btn-gradient-3color"
                            >
                              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Publishing Tab */}
                      <TabsContent value="publishing" className="space-y-4">
                        {selectedWebsite ? (
                          <div className="grid gap-4">
                            <div className="bg-white/50 rounded-lg border p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Website Status</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedWebsite.published 
                                      ? "Your website is currently published and visible to the public." 
                                      : "Your website is currently unpublished and not visible to the public."}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  {selectedWebsite.published ? (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center mr-4">
                                      <Check className="w-3 h-3 mr-1" /> Published
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center mr-4">
                                      <AlertTriangle className="w-3 h-3 mr-1" /> Unpublished
                                    </span>
                                  )}
                                  <Button
                                    variant={selectedWebsite.published ? "destructive" : "default"}
                                    onClick={handlePublishToggle}
                                    disabled={isPublishing}
                                    className={selectedWebsite.published ? "" : "btn-gradient-3color"}
                                  >
                                    {isPublishing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {selectedWebsite.published ? "Unpublish" : "Publish"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            {selectedWebsite.published && (
                              <div className="bg-white/50 rounded-lg border p-4">
                                <h3 className="font-medium">Your Website URL</h3>
                                <div className="mt-2 flex items-center">
                                  <Globe className="w-4 h-4 mr-2 text-primary" />
                                  <a 
                                    href={`https://${selectedWebsite.siteName}.petpals.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {selectedWebsite.siteName}.petpals.com
                                  </a>
                                </div>
                                
                                {selectedWebsite.domain && (
                                  <div className="mt-2 flex items-center">
                                    <Globe className="w-4 h-4 mr-2 text-primary" />
                                    <a 
                                      href={`https://${selectedWebsite.domain}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {selectedWebsite.domain}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="bg-white/50 rounded-lg border p-4">
                              <h3 className="font-medium">Preview Your Website</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                See how your website looks before publishing it.
                              </p>
                              <div className="mt-3">
                                <Link href={`/site-preview/${selectedWebsite.templateType}?id=${selectedWebsite.id}`}>
                                  <Button variant="outline">
                                    Preview Website
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/50 rounded-lg border p-4 text-center py-8">
                            <h3 className="font-medium">Save your website first</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              You need to save your website before you can publish it.
                            </p>
                            <div className="mt-4">
                              <Button 
                                onClick={handleSaveWebsite}
                                disabled={isSaving}
                                className="btn-gradient-3color"
                              >
                                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Website
                              </Button>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="bg-white/50 rounded-lg border p-8 text-center">
                      <h3 className="text-xl font-medium mb-2">No Website Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first kennel website to showcase your dogs and services.
                      </p>
                      <Button 
                        onClick={handleCreateNew}
                        className="btn-gradient-3color"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create New Website
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KennelWebsiteSettings;

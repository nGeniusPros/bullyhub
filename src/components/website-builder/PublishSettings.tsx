import React, { useState, useEffect } from "react";
import { useKennelWebsite } from "@/hooks/useKennelWebsite";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PublishSettingsProps {
  templateId: string;
  customization: any;
  websiteId?: string;
  onBack: () => void;
  onPublish?: (websiteId: string) => void;
}

/**
 * Publish and settings step for the website builder.
 * Handles domain connection, SSL, publish/update workflow, and backup/restore.
 */
const PublishSettings: React.FC<PublishSettingsProps> = ({
  templateId,
  customization,
  websiteId,
  onBack,
  onPublish,
}) => {
  const [siteName, setSiteName] = useState(
    customization?.siteName || ""
  );
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [siteNameAvailable, setSiteNameAvailable] = useState(true);
  const [siteNameChecking, setSiteNameChecking] = useState(false);

  const {
    loading,
    error,
    createKennelWebsite,
    updateKennelWebsite,
    publishKennelWebsite,
    checkSiteNameAvailability,
  } = useKennelWebsite();

  // Website details derived from customization
  const websiteName = customization?.siteName || templateId?.replace(/-/g, " ") || "Your Website";

  // Check site name availability when it changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!siteName) {
        setSiteNameAvailable(false);
        return;
      }

      setSiteNameChecking(true);
      const isAvailable = await checkSiteNameAvailability(siteName, websiteId);
      setSiteNameAvailable(isAvailable);
      setSiteNameChecking(false);
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [siteName, websiteId, checkSiteNameAvailability]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      if (!siteName) {
        toast.error("Error", { description: "Please enter a site name" });
        return;
      }

      if (!siteNameAvailable) {
        toast.error("Error", { description: "Site name is not available" });
        return;
      }

      let siteId = websiteId;

      // If we don't have a website ID, create a new website
      if (!siteId) {
        const newWebsite = await createKennelWebsite({
          templateType: templateId as any,
          siteName: siteName,
          domain: useCustomDomain ? customDomain : undefined,
          logoUrl: customization?.logoUrl,
          colorScheme: customization?.colorScheme,
          content: customization?.content,
          published: false,
        });

        if (!newWebsite) {
          throw new Error("Failed to create website");
        }

        siteId = newWebsite.id;
      } else {
        // Update existing website
        await updateKennelWebsite(siteId, {
          siteName: siteName,
          domain: useCustomDomain ? customDomain : undefined,
          colorScheme: customization?.colorScheme,
          content: customization?.content,
        });
      }

      // Publish the website
      await publishKennelWebsite(siteId);

      toast.success("Success", {
        description: "Your website has been published successfully!"
      });

      // Call the onPublish callback if provided
      if (onPublish) {
        onPublish(siteId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish website";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="container py-8 space-y-6">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4 gradient-text">
        Publish {websiteName}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card-gradient-primary rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3">Domain Settings</h3>
          <p className="text-muted-foreground mb-4">
            Choose a subdomain for your kennel website or connect a custom domain.
          </p>
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200 space-y-4">
            <div>
              <Label htmlFor="site-name">Subdomain</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="site-name"
                  placeholder="your-kennel"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="rounded-r-none"
                />
                <div className="bg-muted px-3 py-2 rounded-r-md border border-l-0 border-input">
                  .petpals.com
                </div>
              </div>
              {siteNameChecking ? (
                <p className="text-xs text-muted-foreground mt-1">Checking availability...</p>
              ) : !siteNameAvailable && siteName ? (
                <p className="text-xs text-destructive mt-1">This subdomain is not available</p>
              ) : siteName ? (
                <p className="text-xs text-green-600 mt-1">Subdomain is available</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">Enter a subdomain for your kennel website</p>
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
              <div className="pt-2">
                <Label htmlFor="custom-domain-input">Custom Domain</Label>
                <Input
                  id="custom-domain-input"
                  placeholder="yourkennel.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You'll need to configure DNS settings with your domain provider.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card-gradient-secondary rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3">Publishing Options</h3>
          <p className="text-muted-foreground mb-4">
            Publish your website and manage updates.
          </p>
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200 space-y-4">
            <p className="text-sm">
              Your website will be published at:
              <strong className="ml-1">
                {siteName ? siteName : "your-kennel"}.petpals.com
              </strong>
            </p>

            {useCustomDomain && customDomain && (
              <p className="text-sm">
                Your website will also be available at:
                <strong className="ml-1">{customDomain}</strong>
              </p>
            )}

            <div className="pt-2">
              <p className="text-sm font-medium">What happens when you publish:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                <li>Your website will be publicly accessible</li>
                <li>Your kennel information will be displayed</li>
                <li>Visitors can contact you through the website</li>
                <li>You can update your website anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isPublishing || loading}
        >
          &larr; Back to Customization
        </Button>
        <Button
          variant="default"
          onClick={handlePublish}
          disabled={isPublishing || loading || !siteNameAvailable || !siteName}
          className="bg-gradient-success-3color hover:bg-gradient-success-3color-hover"
        >
          {isPublishing || loading ? "Publishing..." : "Publish Website"}
        </Button>
      </div>
    </section>
  );
};

export default PublishSettings;

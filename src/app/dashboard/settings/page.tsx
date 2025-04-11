"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import KennelWebsiteSettings from "@/components/settings/KennelWebsiteSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("kennel-website");
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

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
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and kennel website settings
        </p>
      </div>

      <Tabs
        defaultValue="kennel-website"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-card-gradient-primary">
          <TabsTrigger value="kennel-website">Kennel Website</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="kennel-website" className="space-y-4">
          <KennelWebsiteSettings userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <AccountSettings userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsSettings userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

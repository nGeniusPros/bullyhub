import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface NotificationsSettingsProps {
  userProfile: any;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({ userProfile }) => {
  const supabase = createBrowserSupabaseClient();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (userProfile) {
        try {
          const { data, error } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", userProfile.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (data) {
            setUserSettings(data);

            // Set notification preferences from data
            const prefs = data.notification_preferences || {};
            setEmailNotifications(prefs.email_notifications !== false);
            setMarketingEmails(prefs.marketing_emails !== false);
            setAppNotifications(prefs.app_notifications !== false);
            setReminderNotifications(prefs.reminder_notifications !== false);
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      }
    };

    fetchUserSettings();
  }, [userProfile, supabase]);

  // Handle save notification settings
  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);

      if (!userProfile) {
        toast.error("User profile not found");
        return;
      }

      const notificationPreferences = {
        email_notifications: emailNotifications,
        marketing_emails: marketingEmails,
        app_notifications: appNotifications,
        reminder_notifications: reminderNotifications,
      };

      if (userSettings) {
        // Update existing settings
        const { error } = await supabase
          .from("user_settings")
          .update({
            notification_preferences: notificationPreferences,
          })
          .eq("id", userSettings.id);

        if (error) {
          throw error;
        }
      } else {
        // Create new settings
        const { error } = await supabase
          .from("user_settings")
          .insert({
            user_id: userProfile.id,
            notification_preferences: notificationPreferences,
          });

        if (error) {
          throw error;
        }
      }

      toast.success("Notification settings saved successfully");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card-gradient-primary">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your account via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive marketing and promotional emails
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-notifications">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
              <Switch
                id="app-notifications"
                checked={appNotifications}
                onCheckedChange={setAppNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder-notifications">Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for appointments, vaccinations, etc.
                </p>
              </div>
              <Switch
                id="reminder-notifications"
                checked={reminderNotifications}
                onCheckedChange={setReminderNotifications}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveNotifications}
                disabled={isSaving}
                className="btn-gradient-3color"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSettings;

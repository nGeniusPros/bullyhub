"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function NotificationsSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      marketing: true,
      appointments: true,
      reminders: true,
      updates: false,
    },
    push: {
      appointments: true,
      reminders: true,
      messages: true,
      updates: true,
    },
    sms: {
      appointments: false,
      reminders: false,
      marketing: false,
    },
  });

  const handleToggle = (category: string, notification: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [notification]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save notification settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Configure which email notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and special offers
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={settings.email.marketing}
                onCheckedChange={(value) => handleToggle("email", "marketing", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-appointments">Appointments</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about appointment confirmations and changes
                </p>
              </div>
              <Switch
                id="email-appointments"
                checked={settings.email.appointments}
                onCheckedChange={(value) => handleToggle("email", "appointments", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-reminders">Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminder emails for upcoming appointments and tasks
                </p>
              </div>
              <Switch
                id="email-reminders"
                checked={settings.email.reminders}
                onCheckedChange={(value) => handleToggle("email", "reminders", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about system updates and maintenance
                </p>
              </div>
              <Switch
                id="email-updates"
                checked={settings.email.updates}
                onCheckedChange={(value) => handleToggle("email", "updates", value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Configure which push notifications you receive on your devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-appointments">Appointments</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications about appointment confirmations and changes
                </p>
              </div>
              <Switch
                id="push-appointments"
                checked={settings.push.appointments}
                onCheckedChange={(value) => handleToggle("push", "appointments", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-reminders">Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications for upcoming appointments and tasks
                </p>
              </div>
              <Switch
                id="push-reminders"
                checked={settings.push.reminders}
                onCheckedChange={(value) => handleToggle("push", "reminders", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-messages">Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications for new messages
                </p>
              </div>
              <Switch
                id="push-messages"
                checked={settings.push.messages}
                onCheckedChange={(value) => handleToggle("push", "messages", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications about system updates and maintenance
                </p>
              </div>
              <Switch
                id="push-updates"
                checked={settings.push.updates}
                onCheckedChange={(value) => handleToggle("push", "updates", value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SMS Notifications</CardTitle>
            <CardDescription>
              Configure which SMS notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-appointments">Appointments</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications about appointment confirmations and changes
                </p>
              </div>
              <Switch
                id="sms-appointments"
                checked={settings.sms.appointments}
                onCheckedChange={(value) => handleToggle("sms", "appointments", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-reminders">Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications for upcoming appointments and tasks
                </p>
              </div>
              <Switch
                id="sms-reminders"
                checked={settings.sms.reminders}
                onCheckedChange={(value) => handleToggle("sms", "reminders", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-marketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications about new features and special offers
                </p>
              </div>
              <Switch
                id="sms-marketing"
                checked={settings.sms.marketing}
                onCheckedChange={(value) => handleToggle("sms", "marketing", value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Notification Settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}

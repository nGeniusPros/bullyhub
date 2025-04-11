import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from "@/contexts/DatabaseContext";
import { toast } from "sonner";
import { PlusCircle, Trash2, Upload, X } from "lucide-react";

interface CustomizationDashboardProps {
  templateId: string;
  customization: any;
  setCustomization: (data: any) => void;
  onBack: () => void;
  onProceed: () => void;
}

/**
 * Customization dashboard for the selected website template.
 * Allows limited customization: section order, text editing, image upload, color scheme selection.
 * TODO: Implement drag-and-drop, text editing, image upload, and color scheme selection.
 */
const CustomizationDashboard: React.FC<CustomizationDashboardProps> = ({
  templateId,
  customization,
  setCustomization,
  onBack,
  onProceed,
}) => {
  return (
    <section className="container py-8 space-y-6">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-4 gradient-text">
        Customize Your Website: {templateId.replace(/-/g, " ")}
      </h2>
      <div className="bg-card-gradient-primary rounded-xl p-6 text-center border shadow-sm hover:shadow-md transition-all duration-300">
        <div className="py-8">
          [Customization dashboard for <b>{templateId}</b> will appear here.]
          <br />
          <span className="text-xs text-muted-foreground">
            (Section reordering, text editing, image upload, and color scheme selection coming soon.)
          </span>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]" onClick={onBack}>
          &larr; Back
        </button>
        <button className="px-4 py-2 rounded-md bg-gradient-primary-3color text-white hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]" onClick={onProceed}>
          Proceed to Publish &rarr;
        </button>
      </div>
    </section>
  );
};

export default CustomizationDashboard;

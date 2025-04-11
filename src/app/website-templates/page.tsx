"use client";
import React, { useState } from "react";
import InternalLayout from "@/components/layout/InternalLayout";

// Placeholder imports for modular components (to be implemented)
import TemplatePreview from "@/components/website-builder/TemplatePreview";
import FeatureComparisonChart from "@/components/website-builder/FeatureComparisonChart";
import CustomizationDashboard from "@/components/website-builder/CustomizationDashboard";
import PublishSettings from "@/components/website-builder/PublishSettings";

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
  // Step: 0 = Select Template, 1 = Customize, 2 = Publish
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  // Customization state (to be expanded)
  const [customization, setCustomization] = useState<any>({});

  // Handler for template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep(1);
  };

  // Handler for moving to publish step
  const handleProceedToPublish = () => setStep(2);

  // Handler for returning to previous step
  const handleBack = () => setStep((prev) => Math.max(0, prev - 1));

  return (
    <InternalLayout>
      <h1 className="text-2xl font-bold mb-1">Kennel Website Template System</h1>
      <p className="text-muted-foreground mb-4">
        Build a professional website for your kennel using your data from the PetPals Dog Hub app.
      </p>

      {/* Step Navigation */}
      <div className="container flex justify-center gap-4 my-6">
        <button
          className={`px-4 py-2 rounded ${step === 0 ? "bg-primary text-white" : "bg-muted"}`}
          onClick={() => setStep(0)}
        >
          1. Select Template
        </button>
        <button
          className={`px-4 py-2 rounded ${step === 1 ? "bg-primary text-white" : "bg-muted"}`}
          disabled={!selectedTemplate}
          onClick={() => selectedTemplate && setStep(1)}
        >
          2. Customize
        </button>
        <button
          className={`px-4 py-2 rounded ${step === 2 ? "bg-primary text-white" : "bg-muted"}`}
          disabled={!selectedTemplate}
          onClick={() => selectedTemplate && setStep(2)}
        >
          3. Publish
        </button>
      </div>

      {/* Step 1: Template Selection */}
      {step === 0 && (
        <section className="container py-4 space-y-6">
          <h2 className="text-xl font-semibold mb-2">Choose Your Kennel Website Template</h2>
          <div className="bg-white rounded shadow border p-4">
            <FeatureComparisonChart templates={TEMPLATES} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className={`border rounded-lg p-6 hover:shadow-lg transition cursor-pointer ${
                  selectedTemplate === tpl.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleTemplateSelect(tpl.id)}
              >
                <h3 className="text-2xl font-semibold mb-2">{tpl.name}</h3>
                <p className="mb-4">{tpl.description}</p>
                {/* Responsive Preview */}
                <TemplatePreview templateId={tpl.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 2: Customization Dashboard */}
      {step === 1 && selectedTemplate && (
        <CustomizationDashboard
          templateId={selectedTemplate}
          customization={customization}
          setCustomization={setCustomization}
          onBack={handleBack}
          onProceed={handleProceedToPublish}
        />
      )}

      {/* Step 3: Publish/Settings */}
      {step === 2 && selectedTemplate && (
        <PublishSettings
          templateId={selectedTemplate}
          customization={customization}
          onBack={handleBack}
        />
      )}

      {/* Integration Points & Documentation */}
      {/* 
        Integration Points:
        - TemplatePreview: Renders a live, responsive preview of the selected template, populated with sample or real data.
        - FeatureComparisonChart: Displays a comparison of features for each template.
        - CustomizationDashboard: Allows users to reorder sections, edit text, upload images, and select color schemes (limited to pre-defined options).
        - PublishSettings: Handles domain connection, SSL, publish/update workflow, and backup/restore.
        - Data Integration: All templates and customization dashboards should pull data from the app's backend via secure API endpoints (Kennel Settings, Dog Database, Litter Management, Service Settings, etc.).
        - Form Integration: Ensure inquiry/application forms are embedded and linked to app's lead capture.
        - Security: All publishing actions must be secure, with SSL and user data protection.
        - Responsiveness: All previews and templates must be fully responsive.
        - Documentation: Each component should be documented for maintainability and future expansion.
      */}
    </InternalLayout>
  );
}

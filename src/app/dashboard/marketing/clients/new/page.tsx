"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/marketing/client-form";

export default function NewClient() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/marketing/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
      </div>

      <ClientForm
        onSuccess={() => router.push("/dashboard/marketing/clients")}
        onCancel={() => router.push("/dashboard/marketing/clients")}
      />
    </div>
  );
}

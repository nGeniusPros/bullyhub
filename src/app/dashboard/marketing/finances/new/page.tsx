"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FinancialRecordForm } from "@/components/marketing/financial-record-form";

export default function NewFinancialRecord() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/marketing/finances")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Financial Record</h1>
      </div>

      <FinancialRecordForm
        onSuccess={() => router.push("/dashboard/marketing/finances")}
        onCancel={() => router.push("/dashboard/marketing/finances")}
      />
    </div>
  );
}

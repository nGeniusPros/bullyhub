"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientManagement() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Client Management
        </h1>
        <p className="text-muted-foreground">
          This page is temporarily under maintenance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This feature is temporarily unavailable. Please check back later.</p>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="mt-4"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ClientManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">
          Manage your clients, prospects, and communication history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Client Management</h3>
            <p className="text-sm text-muted-foreground">
              This page requires client-side functionality. Please use the client-side version.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

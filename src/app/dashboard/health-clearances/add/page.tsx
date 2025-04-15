import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddHealthClearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Health Clearance</h1>
        <p className="text-muted-foreground">
          Record a new health clearance or certification for your dog
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Health Clearance Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This form requires client-side functionality. Please use the client-side version.</p>
        </CardContent>
      </Card>
    </div>
  );
}

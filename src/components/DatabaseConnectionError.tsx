"use client";

import { useDatabase } from "@/contexts/DatabaseContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export function DatabaseConnectionError() {
  const { isConnected, isLoading, error, retryConnection } = useDatabase();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Checking Database Connection</CardTitle>
          <CardDescription>
            Please wait while we verify the database connection...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Database Connection Error</CardTitle>
          <CardDescription>
            We're having trouble connecting to our database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {error || "Could not connect to the database. Please try again later."}
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              This could be due to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Missing or incorrect environment variables</li>
              <li>Network connectivity issues</li>
              <li>Database server is down or unreachable</li>
              <li>Firewall or security settings blocking the connection</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={retryConnection} className="w-full">
            Retry Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

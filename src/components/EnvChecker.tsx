"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ENV } from "@/lib/env-config";

export function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([]);
  const [envInfo, setEnvInfo] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    // Log environment information for debugging
    console.log("ENV config:", ENV);
    console.log("ENV.isConfigured():", ENV.isConfigured());
    console.log("ENV.getMissingVars():", ENV.getMissingVars());

    // Collect information about environment variables
    const info: { [key: string]: string | undefined } = {
      NEXT_PUBLIC_SUPABASE_URL: ENV.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY,
    };
    setEnvInfo(info);

    const missing = ENV.getMissingVars();

    if (missing.length > 0) {
      console.error("Missing environment variables:", missing);
      setMissingVars(missing);
    }
  }, []);

  // Only show the component in development mode or if there are missing variables
  const isDev = process.env.NODE_ENV === "development";

  // In production, only show if there are missing variables
  if (process.env.NODE_ENV === "production" && missingVars.length === 0) {
    return null;
  }

  // In development, you can control whether to show it even when all variables are set
  const showInDevelopment = true; // Set to false if you don't want to see it in development

  if (missingVars.length === 0 && isDev && !showInDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-auto max-w-md">
      <div className="bg-background border rounded-lg shadow-lg overflow-hidden">
        <div
          className={`px-4 py-2 cursor-pointer flex justify-between items-center ${
            missingVars.length > 0
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted"
          }`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="text-sm font-medium">
            {missingVars.length > 0
              ? "⚠️ Missing Environment Variables"
              : "✅ Environment Variables"}
          </h3>
          <span className="text-xs">
            {isDev ? "(Development)" : "(Production)"}
          </span>
        </div>
        <div className={`px-4 py-2 ${isCollapsed ? "hidden" : ""}`}>
          {missingVars.length > 0 ? (
            <>
              <p className="text-sm">
                The following environment variables are missing:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm">
                {missingVars.map((varName) => (
                  <li key={varName} className="text-destructive">
                    {varName}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs">
                Please check your .env.local file and ensure these variables are
                set.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">Environment variables status:</p>
              <ul className="list-none mt-2 text-sm space-y-1">
                {Object.entries(envInfo).map(([varName, value]) => (
                  <li key={varName} className="flex items-start">
                    <span className="mr-2">{value ? "✅" : "❌"}</span>
                    <div>
                      <div className="font-mono text-xs">{varName}</div>
                      {value && varName === "NEXT_PUBLIC_SUPABASE_URL" && (
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {value}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Environment: {process.env.NODE_ENV || "unknown"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

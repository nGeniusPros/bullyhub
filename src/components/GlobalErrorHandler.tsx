"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      
      toast({
        title: "Error",
        description: event.reason?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Prevent the default browser behavior (console error)
      event.preventDefault();
    };

    // Handler for uncaught exceptions
    const handleError = (event: ErrorEvent) => {
      console.error("Uncaught error:", event.error);
      
      toast({
        title: "Error",
        description: event.error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Prevent the default browser behavior (console error)
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}

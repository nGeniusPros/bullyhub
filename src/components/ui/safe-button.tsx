"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Slot } from "@radix-ui/react-slot";

interface SafeButtonProps extends React.ComponentProps<typeof Button> {
  onClickAsync?: () => Promise<void>;
  loadingText?: string;
  errorText?: string;
  successText?: string;
  asChild?: boolean;
}

export function SafeButton({
  children,
  onClick,
  onClickAsync,
  disabled,
  loadingText = "Loading...",
  errorText = "An error occurred",
  successText,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: SafeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const Comp = asChild ? Slot : "button";

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's a regular onClick handler, call it
    if (onClick) {
      onClick(e);
      return;
    }

    // If there's an async handler, handle it with loading state
    if (onClickAsync) {
      try {
        setIsLoading(true);
        await onClickAsync();
        if (successText) {
          toast({
            title: "Success",
            description: successText,
          });
        }
      } catch (error) {
        console.error("Button click error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : errorText,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

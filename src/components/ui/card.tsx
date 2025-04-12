import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "info" | "activity" | "3color"
}

function Card({
  className,
  variant = "primary",
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "card flex flex-col gap-6 py-6 shadow-sm hover:shadow-md transition-all duration-300",
        variant === "primary" && "card-gradient card-gradient-primary",
        variant === "secondary" && "card-gradient card-gradient-secondary",
        variant === "success" && "card-gradient card-gradient-success",
        variant === "info" && "card-gradient card-gradient-info",
        variant === "activity" && "activity-card-gradient",
        variant === "3color" && "card-gradient card-gradient-primary card-gradient-3color",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "primary" | "secondary" | "success" | "info" | "activity" | "3color" | boolean
  variant?: "primary" | "secondary" | "success" | "info" | "activity" | "3color"
}

function CardHeader({
  className,
  gradient,
  variant = "primary",
  ...props
}: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "card-header",
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        (gradient === "primary" || gradient === true || variant === "primary") && "gradient",
        (gradient === "secondary" || variant === "secondary") && "gradient-card-secondary",
        (gradient === "success" || variant === "success") && "gradient-card-success",
        (gradient === "info" || variant === "info") && "gradient-card-info",
        (gradient === "activity" || variant === "activity") && "activity-card-header-3color",
        (gradient === "3color" || variant === "3color") && "gradient-card-primary card-gradient-3color",
        className
      )}
      {...props}
    />
  )
}

interface CardComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardTitle({ className, ...props }: CardComponentProps) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: CardComponentProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: CardComponentProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: CardComponentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: CardComponentProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
}

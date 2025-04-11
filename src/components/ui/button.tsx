import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#29ABE2] to-[#6A3DE8] text-primary-foreground shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-gradient-to-r from-[#FFDA63] to-[#FF8C00] text-secondary-foreground shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        success:
          "bg-gradient-to-r from-[#8FBC8F] to-[#2E8B57] text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        info:
          "bg-gradient-to-r from-[#6A3DE8] to-[#29ABE2] text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        primary3color:
          "bg-gradient-primary-3color text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        secondary3color:
          "bg-gradient-secondary-3color text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        success3color:
          "bg-gradient-success-3color text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        info3color:
          "bg-gradient-info-3color text-white shadow-xs hover:shadow-md hover:translate-y-[-1px]",
        ghost:
          "hover:bg-[rgba(41,171,226,0.2)] hover:text-[#29ABE2] dark:hover:bg-[rgba(41,171,226,0.3)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

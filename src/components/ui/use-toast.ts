// Adapted from shadcn/ui
// https://ui.shadcn.com/docs/components/toast
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = Omit<ToastT, "id"> & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({
  title,
  description,
  variant = "default",
  ...props
}: ToastProps) {
  return sonnerToast(title as string, {
    description,
    ...props,
    className: variant === "destructive" ? "destructive" : "",
  });
}

import { toast } from "@/components/ui/use-toast";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
}

export function useToast() {
  const showToast = ({ title, description, type = "info" }: ToastOptions) => {
    const variant = type === "error" ? "destructive" : "default";
    
    toast({
      title,
      description,
      variant,
    });
  };

  return { showToast };
}

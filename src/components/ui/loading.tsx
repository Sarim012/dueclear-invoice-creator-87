
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = "Loading...", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

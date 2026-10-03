import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthErrorProps = {
  message: string;
  className?: string;
};

/** Consistent error display for auth forms */
export function AuthError({ message, className }: AuthErrorProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-2 text-sm text-danger", className)} role="alert">
      <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
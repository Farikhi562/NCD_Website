import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClass } from "./Field";

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  id: string;
  label: string;
};

/**
 * Server-safe search field. Uses type="search" so browsers supply the clear
 * button and Esc-to-clear. Result announcements (aria-live) are added by the
 * module that owns the results.
 */
export function SearchInput({ id, label, className, ...props }: SearchInputProps) {
  return (
    <div role="search" className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search className="pointer-events-none absolute top-3 left-3 size-4 text-text-secondary" aria-hidden />
      <input id={id} type="search" className={cn(controlClass, "pl-10", className)} {...props} />
    </div>
  );
}

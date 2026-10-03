import { cn } from "@/lib/utils";
import { Field, controlClass } from "./Field";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  helper?: string;
  error?: string;
};

/** Native select: keyboard-operable by default. Swap for a Radix select only when needed. */
export function Select({ id, label, helper, error, required, className, children, ...props }: SelectProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(controlClass, className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

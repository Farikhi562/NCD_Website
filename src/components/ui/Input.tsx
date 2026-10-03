import { cn } from "@/lib/utils";
import { Field, controlClass } from "./Field";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  helper?: string;
  error?: string;
};

export function Input({ id, label, helper, error, required, className, ...props }: InputProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(controlClass, className)}
        {...props}
      />
    </Field>
  );
}

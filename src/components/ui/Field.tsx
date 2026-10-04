import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

/** Visible label + helper/error text. Placeholder is never a label (design.md §16). */
export function Field({ id, label, required, helper, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-small font-medium text-text-primary">
        {label}
        {required && <span className="ml-2 font-normal text-text-secondary">Required</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="type-small flex items-center gap-2 text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="type-small text-text-secondary">{helper}</p>
      ) : null}
    </div>
  );
}

export const controlClass =
  "h-10 w-full rounded-md border border-text-muted bg-ncd-elevated px-3 type-small text-text-primary placeholder:text-text-muted disabled:text-text-disabled aria-[invalid=true]:border-danger";

/** Input with optional leading icon */
type InputWithIconProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
};

export function InputWithIcon({ id, label, helper, error, required, icon, className, ...props }: InputWithIconProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} required={required}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden="true">
            {icon}
          </div>
        )}
        <input
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          className={cn(controlClass, icon ? "pl-10" : "", className)}
          {...props}
        />
      </div>
    </Field>
  );
}

type TextAreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
};

/** Multi-line field for the short application questions (design.md §16). */
export function TextArea({ id, label, helper, error, required, className, ...props }: TextAreaProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error} required={required}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(controlClass, "min-h-28 py-2 leading-relaxed", className)}
        {...props}
      />
    </Field>
  );
}

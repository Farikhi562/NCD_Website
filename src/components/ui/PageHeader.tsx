import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
  className?: string;
};

/** Title and primary action sit inside the first screen (design.md §13). */
export function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="reading">
          <h1 className="type-h1">{title}</h1>
          <p className="type-lead mt-4 text-text-secondary">{description}</p>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

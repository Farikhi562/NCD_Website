import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { modules } from "@/config/content";

export function ModuleIndex() {
  return (
    <section aria-labelledby="inside-title" className="border-b border-border">
      <Container className="py-16 md:py-24">
        <h2 id="inside-title" className="type-h2">Inside NCD</h2>
        <ul className="mt-8 border-t border-border md:mt-12">
          {modules.map((m) => (
            <li key={m.name} className="border-b border-border">
              <Link
                href={m.href}
                className="group grid min-h-14 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-2 py-4 transition-colors duration-150 ease-ncd hover:bg-ncd-surface md:grid-cols-[220px_1fr_auto] md:gap-x-8 md:px-4 md:py-6"
              >
                <span className="type-h4">{m.name}</span>
                <ArrowRight className="size-4 text-text-secondary group-hover:text-text-primary md:order-3" aria-hidden />
                <span className="type-small col-span-2 text-text-secondary md:col-span-1 md:order-2 md:text-[15px]">{m.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

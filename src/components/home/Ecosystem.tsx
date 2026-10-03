import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ecosystem } from "@/config/content";

/**
 * The one memorable thing besides the hero (design.md §1, §30).
 * HTML only, an ordered list in the DOM. Vertical below lg, horizontal with a
 * return path at lg+. Reveal is a single opacity step per node (see globals.css).
 */
export function Ecosystem() {
  return (
    <section id="ecosystem" aria-labelledby="ecosystem-title">
      <Container className="py-16 md:py-24">
        <h2 id="ecosystem-title" className="type-h2">How NCD works</h2>
        <p className="type-lead mt-4 max-w-[60ch] text-text-secondary">
          Each stage feeds the next, and what the last one produces goes back to the first.
        </p>

        <ol className="mt-12 flex flex-col lg:mt-16 lg:grid lg:grid-cols-7 lg:gap-6">
          {ecosystem.map((stage) => (
            <li
              key={stage.name}
              className="ecosystem-node relative border-l border-border pb-8 pl-6 last:pb-0 lg:border-t lg:border-l-0 lg:pt-6 lg:pb-0 lg:pl-0"
            >
              <span
                aria-hidden
                className="absolute top-1.5 -left-[5px] size-2 rounded-full bg-border-strong lg:-top-[5px] lg:left-0"
              />
              <h3 className="type-h4">{stage.name}</h3>
              <p className="type-small mt-2 text-text-secondary">{stage.text}</p>
            </li>
          ))}
        </ol>

        <div
          aria-hidden
          className="relative mt-8 hidden h-8 rounded-b-lg border-x border-b border-border lg:block"
          style={{ width: "calc(6 * (100% - 9rem) / 7 + 9rem)" }}
        >
          <ArrowUp className="absolute -top-2 -left-2 size-4 bg-ncd-black text-text-secondary" />
        </div>
      </Container>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/config/content";

/** Typographic hero (design.md §1, DD-10). No imagery, no stats. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-border">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="type-display">
            {hero.title}
            <br />
            {hero.headline}
          </h1>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-12">
            <ButtonLink href="/about" size="lg">Explore NCD</ButtonLink>
            <ButtonLink href="/projects" variant="secondary" size="lg">View Projects</ButtonLink>
          </div>
        </div>
        <ul className="type-lead flex flex-col lg:col-span-5 lg:self-end lg:border-l lg:border-border lg:pl-8">
          {hero.lines.map((line) => (
            <li key={line} className="border-t border-border-subtle py-3 text-text-secondary first:border-t-0 first:pt-0 last:pb-0">
              {line}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/Container";
import { getPulse } from "@/lib/pulse";

/** Live counts only. A null value means nothing is recorded yet (spec.md §8.11). */
export async function Pulse() {
  const items = await getPulse();
  const recorded = items.some((i) => i.value !== null);

  return (
    <section aria-labelledby="pulse-title" className="border-b border-border bg-ncd-dark">
      <Container className="py-12 md:py-16">
        <h2 id="pulse-title" className="type-h3">Current pulse</h2>
        <dl className="mt-8 grid gap-0 sm:grid-cols-3 sm:gap-8">
          {items.map((item) => (
            <div key={item.label} className="border-t border-border py-4 sm:pt-4">
              <dt className="type-small text-text-secondary">{item.label}</dt>
              <dd className="mt-2">
                {item.value === null ? (
                  <span className="type-body text-text-secondary">Not yet documented</span>
                ) : (
                  <span className="num type-h2">{item.value}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {!recorded && (
          <p className="type-small mt-6 max-w-[60ch] text-text-secondary">
            Numbers show up here once NCD records them. Nothing on this page is estimated.
          </p>
        )}
      </Container>
    </section>
  );
}

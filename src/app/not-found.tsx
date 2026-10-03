import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <>
      <main id="main" className="flex-1">
        <Container className="py-12 md:py-16">
          <h1 className="type-h1">Page not found</h1>
          <div className="mt-8">
            <EmptyState
              title="This page doesn't exist."
              description="The link may be wrong, or the page may have moved."
              action={
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/">Go home</ButtonLink>
                  <ButtonLink href="/projects" variant="secondary">View Projects</ButtonLink>
                </div>
              }
            />
          </div>
        </Container>
      </main>
    </>
  );
}
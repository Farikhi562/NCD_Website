"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-12 md:py-16">
      <ErrorState
        description="We couldn't load this page."
        actions={
          <>
            <Button onClick={reset}>Try again</Button>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>Go home</Link>
          </>
        }
      />
    </Container>
  );
}

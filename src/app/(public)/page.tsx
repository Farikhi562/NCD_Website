import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Pulse } from "@/components/home/Pulse";
import { ModuleIndex } from "@/components/home/ModuleIndex";
import { Ecosystem } from "@/components/home/Ecosystem";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Section order follows spec.md §8.11: Hero, Pulse, modules, Ecosystem, Footer.
// Phase 1 groups People / Projects / Competitions / Activities / Knowledge into one index
// because none of them has data yet.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Pulse />
      <ModuleIndex />
      <Ecosystem />
    </>
  );
}

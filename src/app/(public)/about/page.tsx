import type { Metadata } from "next";
import { Info } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";

const title = "About";
const description = "What NCD is, what it values and how it is organised.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <ModulePage title={title} description={description} icon={Info} empty={{ title: "About is being written.", description: "NCD's vision, values, leadership and structure will appear here once leadership confirms the wording." }} />;
}

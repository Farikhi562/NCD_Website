import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/navigation/WorkspaceShell";

export const metadata: Metadata = {
  title: { default: "Workspace", template: "%s · NCD Workspace" },
  description: "NCD Workspace: where members work in NCD.",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}

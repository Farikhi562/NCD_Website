import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description: "NCD members directory.",
};

export default function PeopleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
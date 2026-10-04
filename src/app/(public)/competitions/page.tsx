import type { Metadata } from "next";
import { Trophy, Box, Wifi, Hand } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Competitions",
  description: "Competition Radar and Competition Briefs for what NCD is tracking.",
  alternates: { canonical: "/competitions" },
};

const competitions = [
  {
    id: "ugp-gbic",
    name: "UGP-GBIC",
    description: "Universitas Gunadarma Programming - Global Business Innovation Challenge",
    category: "Technology / Digital Business",
    status: "Active",
    teams: [
      {
        name: "Team 1",
        product: "SCALE",
        field: "Technology / Digital Business",
        icon: Box,
        members: ["Dian Aulia Febrianti", "Muhamad Fauzan Al Farikhi", "Mirza Danisywar Noor Wahyu", "Syawalludin Fitroh Rahman", "Annisa Saskia"],
      },
      {
        name: "Team 2",
        product: "NFC WiFi",
        field: "Technology / Digital Business",
        icon: Wifi,
        members: ["Mochamad Triandra Andantyo", "Ghazali Syaqih Husein", "Putri Aura Wening", "Muhammad Iqbal Fajri", "Chantika Shinta Sonia"],
      },
      {
        name: "Team 3",
        product: "Sarung Tangan dari Tape Singkong",
        field: "Manufacturing / Craft",
        icon: Hand,
        members: ["Deryl Jonathan Yofan", "Rayyan Fathan Addani", "Nedri Febrianto", "Sri Gunarti Wijiastuti", "Sheva Putra Firdaus"],
      },
    ],
  },
];

export default function Page() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Competitions", href: "/competitions" }
      ]} />
      <PageHeader
        title="Competitions"
        description="Competition Radar and Competition Briefs for what NCD is tracking."
        className="mb-8"
      />

      {competitions.map((competition) => (
        <section key={competition.id} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="type-h2 font-medium">{competition.name}</h2>
              <p className="type-body text-text-secondary mt-1">{competition.description}</p>
            </div>
            <Badge tone="success">{competition.status}</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {competition.teams.map((team) => (
              <Card key={team.name} className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric">
                    <team.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="type-h4 font-medium">{team.name}</h3>
                    <p className="type-caption text-text-muted">{team.field}</p>
                  </div>
                </div>

                <div className="mb-4 p-4 rounded-lg bg-ncd-surface/50 border border-border">
                  <dt className="type-caption text-text-muted mb-1">Product / Idea</dt>
                  <dd className="type-h4 font-medium text-text-primary">{team.product}</dd>
                </div>

                <div className="space-y-2">
                  <dt className="type-caption text-text-muted">Members</dt>
                  <ul className="space-y-1">
                    {team.members.map((member) => (
                      <li key={member} className="type-small text-text-secondary flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-border" />
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-lg border border-dashed border-border-strong bg-ncd-dark p-8 md:p-12 text-center">
        <Trophy className="mb-4 size-6 text-text-muted mx-auto" aria-hidden />
        <p className="type-h4 text-text-primary mb-2">Competition Radar</p>
        <p className="type-body text-text-secondary max-w-[60ch] mx-auto">
          More competitions tracked by NCD will appear here. Each entry includes a Competition Brief with problem analysis, requirements, eligibility, and readiness assessment.
        </p>
      </div>
    </Container>
  );
}
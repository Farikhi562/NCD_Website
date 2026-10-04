import type { Metadata } from "next";
import { Users, Award, Building2, Target, Heart, Lightbulb, Users as UsersIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { getMembers, getLeadership, getDivisions, getDivisionLeads } from "@/lib/people";

export const metadata: Metadata = {
  title: "About",
  description: "NCD vision, mission, values, leadership, and organization structure",
  alternates: { canonical: "/about" },
};

const values = [
  { name: "Growth", description: "Progress is measured against your own start, never against others.", icon: Target },
  { name: "Collaboration", description: "Team and squad over individual stars. We build together.", icon: Users },
  { name: "Ownership", description: "Every item shows who is responsible (PIC) and when it was last updated.", icon: Lightbulb },
  { name: "Learning", description: "Failure is a legitimate state. We learn from what doesn't work.", icon: Heart },
  { name: "Contribution", description: "Authorship is visible on knowledge and projects.", icon: Award },
];

const divisionInfo = [
  {
    name: "People & Culture",
    description: "Manages member development, onboarding, networking, and personal growth.",
    programs: ["NCD Discover", "NCD Connect", "NCD Grow", "Growth Map"],
    lead: "Not Assigned",
    icon: Users,
    color: "bg-ncd-electric/20 text-ncd-electric",
  },
  {
    name: "Competition & Strategy",
    description: "Manages Competition Radar, Competition Brief, Competition Day, and Retrospective.",
    programs: ["Competition Radar", "Competition Brief", "Competition Day", "Retrospective"],
    lead: "Not Assigned",
    icon: Award,
    color: "bg-success/20 text-success",
  },
  {
    name: "Project & Development",
    description: "Manages Project Lab, Project Clinic, Squad formation, and Demo Day.",
    programs: ["Project Lab", "Project Clinic", "Squad Formation", "Demo Day"],
    lead: "Not Assigned",
    icon: Building2,
    color: "bg-warning/20 text-warning",
  },
];

const supportSystems = [
  { name: "NCD Kas", description: "Shared fund and transparent recording system" },
  { name: "NCD Website", description: "Digital home and digital infrastructure of NCD" },
  { name: "Documentation", description: "Activity documentation, knowledge base, and archive" },
  { name: "Knowledge Base", description: "Sharing materials, tutorials, insights, post-mortems" },
];

export default async function Page() {
  const [members, leadership, divisions, divisionLeads] = await Promise.all([
    getMembers(),
    getLeadership(),
    getDivisions(),
    getDivisionLeads(),
  ]);

  const divisionInfo = divisions.map((div) => ({
    ...div,
    lead: { name: divisionLeads[div.name] || "Not Assigned" },
  }));

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" }
      ]} />
      <PageHeader
        title="About"
        description="NCD vision, mission, values, leadership, and organization structure"
        className="mb-8"
      />

      {/* Vision & Mission */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-4">Vision</h2>
        <p className="type-body text-text-secondary max-w-2xl">
          To become a cross-disciplinary student development platform that encourages members to learn, collaborate, build work, and grow through competition experience.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-4">Mission</h2>
        <ol className="list-decimal list-inside space-y-3 type-body text-text-secondary max-w-2xl">
          <li>Introduce members and their skills to each other.</li>
          <li>Build learning and sharing habits.</li>
          <li>Form projects and join competitions across majors and cohorts.</li>
          <li>Evaluate and document every experience for the next generation.</li>
        </ol>
        <p className="type-caption text-text-muted mt-4">*Mission is a proposal and may change per leadership decision.</p>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Values</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {values.map((value) => (
            <Card key={value.name} className="p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric mx-auto mb-3">
                <value.icon className="size-6" />
              </div>
              <h3 className="type-h4 font-medium mb-2 text-ncd-electric">{value.name}</h3>
              <p className="type-small text-text-secondary">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Leadership — Period I</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {leadership.map((person) => (
            <Card key={person.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar name={person.full_name || "Unknown"} src={person.avatar_url} className="h-16 w-16" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="type-h4 font-medium">{person.full_name}</h3>
                    <Badge tone="info">{person.org_role || person.role}</Badge>
                  </div>
                  <p className="type-body text-text-secondary mb-2">
                    {person.org_role === "Chairperson — Period I"
                      ? "Sets strategic direction and makes organizational decisions."
                      : "Coordinates execution, monitoring, and program delivery."}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <UsersIcon className="size-3" />
                    <span>Leadership</span>
                    <span className="text-border">·</span>
                    <span>Team: {person.team}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Divisions */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Three Permanent Divisions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {divisionInfo.map((division) => (
            <Card key={division.name} className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${division.color}`}>
                  <division.icon className="size-5" />
                </div>
                <div>
                  <h3 className="type-h4 font-medium">{division.name}</h3>
                  <p className="type-caption text-text-muted">Division Lead: {division.lead.name}</p>
                </div>
              </div>
              <p className="type-body text-text-secondary mb-4">{division.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {division.programs.map((program) => (
                  <Badge key={program} tone="neutral" className="text-xs">
                    {program}
                  </Badge>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <UsersIcon className="size-3" />
                  <span>Division Lead: {division.lead.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Support Systems */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Support Systems</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportSystems.map((system) => (
            <Card key={system.name} className="p-6">
              <h3 className="type-h4 font-medium mb-2">{system.name}</h3>
              <p className="type-small text-text-secondary">{system.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Organization Structure Note */}
      <section>
        <Card className="p-6 border-border-strong">
          <h3 className="type-h4 font-medium mb-3">Organization Structure</h3>
          <div className="space-y-2 type-body text-text-secondary">
            <p><strong>Leadership:</strong> Chairperson & Vice Chairperson</p>
            <p><strong>Divisions (3):</strong> People & Culture · Competition & Strategy · Project & Development</p>
            <p><strong>Support Systems (4):</strong> NCD Kas · NCD Website · Documentation · Knowledge Base</p>
            <p><strong>Competition Squads:</strong> Temporary, formed per competition/project</p>
            <p><strong>Total Members:</strong> 20 (15 UGP-GBIC participants + 5 non-competition members)</p>
          </div>
        </Card>
      </section>
    </Container>
  );
}
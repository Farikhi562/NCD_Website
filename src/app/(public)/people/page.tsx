import type { Metadata } from "next";
import { Users, Award, Building2, Users as UsersIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export const metadata: Metadata = {
  title: "People",
  description: "NCD members, leadership, and division structure",
  alternates: { canonical: "/people" },
};

const leadership = [
  {
    name: "Mirza Danisywar Noor Wahyu",
    role: "Ketua Periode I",
    division: "Leadership",
    description: "Menentukan arah strategis dan keputusan organisasi",
    avatar: "MDNW",
  },
  {
    name: "Muhamad Fauzan Al Farikhi",
    role: "Wakil Ketua Periode I",
    division: "Leadership",
    description: "Koordinasi eksekusi, monitoring, dan eksekusi program",
    avatar: "MFAF",
  },
];

const members = [
  {
    name: "Dian Aulia Febrianti",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "DAF",
  },
  {
    name: "Derly Jonathan Yoffan",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "DJY",
  },
  {
    name: "Syawalludin Firoh Rahman",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "SFR",
  },
  {
    name: "Annisa Saskia",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "AS",
  },
  {
    name: "Sri Gunarti Wijiastuti",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "SGW",
  },
  {
    name: "Mochamad Triandra Andantyo",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "MTA",
  },
  {
    name: "Ghazali Syaqih Husein",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "GSH",
  },
  {
    name: "Putri Aura Wening",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "PAW",
  },
  {
    name: "Muhammad Iqbal Fajri",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "MIF",
  },
  {
    name: "Chantika Shinta Sgonia",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "CSS",
  },
  {
    name: "Nedri Febrianto",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "NF",
  },
  {
    name: "Sheva Putra Firdaus",
    role: "Anggota",
    division: "TBD",
    description: "Anggota NCD",
    avatar: "SPF",
  },
];

const divisions = [
  {
    name: "People & Culture",
    description: "Mengelola pengembangan anggota, onboarding, networking, dan pertumbuhan personal.",
    programs: ["NCD Discover", "NCD Connect", "NCD Grow", "Growth Map"],
    lead: { name: "Belum Dipilih", avatar: "TBD" },
    icon: Users,
    color: "bg-ncd-electric/20 text-ncd-electric",
  },
  {
    name: "Competition & Strategy",
    description: "Mengelola Competition Radar, Competition Brief, Competition Day, dan Retrospective.",
    programs: ["Competition Radar", "Competition Brief", "Competition Day", "Retrospective"],
    lead: { name: "Belum Dipilih", avatar: "TBD" },
    icon: Award,
    color: "bg-success/20 text-success",
  },
  {
    name: "Project & Development",
    description: "Mengelola Project Lab, Project Clinic, Squad formation, dan Demo Day.",
    programs: ["Project Lab", "Project Clinic", "Squad Formation", "Demo Day"],
    lead: { name: "Belum Dipilih", avatar: "TBD" },
    icon: Building2,
    color: "bg-warning/20 text-warning",
  },
];

const supportSystems = [
  { name: "NCD Kas", description: "Dana bersama dan sistem pencatatan transparan", icon: "💰" },
  { name: "NCD Website", description: "Digital home dan infrastruktur digital NCD", icon: "🌐" },
  { name: "Documentation", description: "Dokumentasi kegiatan, knowledge base, dan arsip", icon: "📚" },
  { name: "Knowledge Base", description: "Materi sharing, tutorial, insight, post-mortem", icon: "🧠" },
];

export default function Page() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "People", href: "/people" }
      ]} />
      <PageHeader
        title="People"
        description="NCD leadership, division structure, and members"
        className="mb-8"
      />

      {/* Leadership Section */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Leadership Periode I</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {leadership.map((person) => (
            <Card key={person.name} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar name={person.name} className="h-16 w-16" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="type-h4 font-medium">{person.name}</h3>
                    <Badge tone="info">{person.role}</Badge>
                  </div>
                  <p className="type-body text-text-secondary mb-2">{person.description}</p>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <UsersIcon className="size-3" />
                    <span>Leadership</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Members Section */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Members</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <Card key={member.name} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar name={member.name} className="h-12 w-12" />
                <div className="flex-1 min-w-0">
                  <h3 className="type-h4 font-medium truncate">{member.name}</h3>
                  <Badge tone="neutral" className="text-xs mt-1">{member.role}</Badge>
                  <p className="type-caption text-text-muted mt-1 truncate">{member.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Divisions Section */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Three Permanent Divisions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {divisions.map((division) => (
            <Card key={division.name} className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${division.color}`}>
                  <division.icon className="size-5" />
                </div>
                <div>
                  <h3 className="type-h4 font-medium">{division.name}</h3>
                  <p className="type-caption text-text-muted">Ketua: {division.lead.name}</p>
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
                  <span>Ketua Divisi: {division.lead.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Support Systems Section */}
      <section className="mb-12">
        <h2 className="type-h3 font-medium mb-6">Support Systems</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportSystems.map((system) => (
            <Card key={system.name} className="p-6 text-center">
              <div className="text-4xl mb-3">{system.icon}</div>
              <h3 className="type-h4 font-medium mb-2">{system.name}</h3>
              <p className="type-small text-text-secondary">{system.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="type-h3 font-medium mb-6">Our Values</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { name: "Growth", description: "Progress vs own start, never vs others" },
            { name: "Collaboration", description: "Team & squad over individual stars" },
            { name: "Ownership", description: "Every item shows PIC & last updated" },
            { name: "Learning", description: "Failure is a legitimate state" },
            { name: "Contribution", description: "Authorship visible on knowledge & projects" },
          ].map((value) => (
            <Card key={value.name} className="p-6 text-center">
              <h3 className="type-h4 font-medium mb-2 text-ncd-electric">{value.name}</h3>
              <p className="type-small text-text-secondary">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
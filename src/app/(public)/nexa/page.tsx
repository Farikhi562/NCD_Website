import type { Metadata } from "next";
import { Users, BrainCircuit, Globe, Code2, Palette, GitBranch, ArrowUpRight, Building, Briefcase, Sparkles, MessageSquare, Camera } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export const metadata: Metadata = {
  title: "NEXA Tech Labs",
  description: "NEXA Tech Labs — AI Product Studio. NCD is a community under NEXA Tech Labs.",
  alternates: { canonical: "/nexa" },
};

const nexaCoreTeam = [
  {
    name: "Muhamad Fauzan Al Farikhi",
    role: "CEO & Founder",
    responsibilities: [
      "Company direction",
      "Product strategy",
      "AI systems",
      "Business development",
      "Overall leadership",
    ],
    avatarUrl: "/images/muhamad-fauzan-al-farikhi.png",
    order: 1,
  },
  {
    name: "Mirza Danisywar Noor Wahyu",
    role: "CMO",
    responsibilities: [
      "Marketing strategy",
      "Brand communication",
      "Growth",
      "Sales support",
      "Market positioning",
    ],
    avatarUrl: "/images/mirza-danisywar-noor-wahyu.png",
    order: 2,
  },
  {
    name: "Mochamad Triandra Andantyo",
    role: "CTO",
    responsibilities: [
      "Technical architecture",
      "Engineering direction",
      "Software development",
      "Infrastructure",
      "Technical standards",
    ],
    avatarUrl: "/images/mochamad-triandra-andantyo.png",
    order: 3,
  },
  {
    name: "Muhammad Tsaqib Adha",
    role: "Head of AI & Systems",
    responsibilities: [
      "AI systems",
      "Applied AI research",
      "Intelligent automation",
      "Systems engineering",
      "AI feature development",
      "Technical experimentation",
    ],
    avatarUrl: null,
    order: 4,
  },
  {
    name: "Rangga Dwi Prasetyo",
    role: "Finance",
    responsibilities: [
      "Financial management",
      "Budgeting",
      "Financial records",
      "Project financial tracking",
    ],
    avatarUrl: "/images/rangga-dwi-prasetyo.png",
    order: 5,
  },
  {
    name: "Yusuf Maulana Wahyudi",
    role: "Marketing & Social Media",
    responsibilities: [
      "Social media management",
      "Content",
      "Campaigns",
      "Community communication",
      "Brand presence",
    ],
    avatarUrl: "/images/yusuf-maulana-wahyudi.png",
    order: 6,
  },
  {
    name: "Muhammad Iqbal Fajri",
    role: "Project Manager",
    responsibilities: [
      "Project planning",
      "Timeline",
      "Coordination",
      "Task tracking",
      "Delivery management",
      "Team coordination",
    ],
    avatarUrl: "/images/muhammad-iqbal-fajri.png",
    order: 7,
  },
  {
    name: "Syawalludin Fitroh Rahman",
    role: "UI/UX Designer",
    responsibilities: [
      "Product interface",
      "UX research",
      "Interaction design",
      "Visual systems",
      "Design consistency",
    ],
    avatarUrl: "/images/syawalludin-fitroh-rahman.png",
    order: 8,
  },
].sort((a, b) => a.order - b.order);

const clientProjects = [
  {
    client: "Dimsum Mentai Kmyrn",
    project: "POS System",
    value: 5_500_000,
    description:
      "A point-of-sale system developed to support day-to-day restaurant operations, transaction management, and a more structured digital workflow.",
    category: "Restaurant Technology",
  },
  {
    client: "Citcha Studi",
    project: "Photobooth Application",
    value: 600_000,
    description:
      "A digital application developed for photobooth operations and customer interaction.",
    category: "Digital Experience",
  },
];

const totalClientValue = clientProjects.reduce((sum, p) => sum + p.value, 0);

const capabilities = [
  {
    title: "AI & Intelligent Systems",
    description: "Applied AI, automation, AI-powered workflows, and intelligent product features.",
    icon: BrainCircuit,
  },
  {
    title: "Digital Products",
    description: "Web applications, software products, dashboards, and digital platforms.",
    icon: Code2,
  },
  {
    title: "Business Systems",
    description: "Operational tools and digital systems for UMKM and small businesses.",
    icon: Briefcase,
  },
  {
    title: "Product Design",
    description: "UI/UX and product experience design.",
    icon: Palette,
  },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com/company/nexa-tech-labs", icon: MessageSquare },
  { name: "GitHub", href: "https://github.com/nexa-tech-labs", icon: GitBranch },
  { name: "Instagram", href: "https://instagram.com/nexa.techlabs", icon: Camera },
];

const nexaWebsite = "https://nexa.techlabs.id";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
}

export default function NexaPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "NEXA Tech Labs", href: "/nexa" }
      ]} />

      {/* Hero */}
      <section className="mb-16">
        <PageHeader
          title="NEXA Tech Labs"
          description="AI Product Studio — Building practical digital systems for students, UMKM, and modern workflows."
          className="mb-8"
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6 border-border-strong bg-ncd-surface/50">
              <h3 className="type-h4 font-medium mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-ncd-electric" />
                What is NEXA Tech Labs?
              </h3>
              <p className="type-body text-text-secondary">
                NEXA Tech Labs is an AI product studio building practical digital systems for students, UMKM, and modern workflows. We explore and develop useful products across AI, software engineering, business automation, digital platforms, and applied technology.
              </p>
            </Card>

            <Card className="p-6 border-border-strong bg-ncd-surface/50">
              <h3 className="type-h4 font-medium mb-4 flex items-center gap-2">
                <Users className="size-5 text-ncd-electric" />
                NCD under NEXA Tech Labs
              </h3>
              <p className="type-body text-text-secondary">
                NCD is a community under NEXA Tech Labs, providing a space for students and young builders to collaborate, learn, compete, and build real-world projects together.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="font-mono text-xs text-text-muted space-y-1">
                  <div>NEXA Tech Labs → Parent Organization</div>
                  <div className="pl-4 border-l border-border ml-2">NCD → Community under NEXA Tech Labs</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-border-strong">
              <h3 className="type-h4 font-medium mb-4">Core Team</h3>
              <p className="type-body text-text-secondary mb-4">
                The 8 people driving NEXA Tech Labs across product, engineering, AI, design, and operations.
              </p>
              <div className="space-y-4">
                {nexaCoreTeam.map((member, index) => (
                  <div key={member.name} className="flex items-start gap-4 p-4 rounded-lg bg-ncd-surface/50 border border-border hover:border-border-strong transition-colors">
                    <Avatar
                      name={member.name}
                      src={member.avatarUrl}
                      size={40}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="type-label bg-ncd-electric/20 text-ncd-electric px-2 py-0.5 rounded">{index + 1}</span>
                        <h4 className="type-h4 font-medium">{member.name}</h4>
                      </div>
                      <p className="type-small font-medium text-ncd-electric mb-2">{member.role}</p>
                      <ul className="type-small text-text-secondary space-y-1">
                        {member.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-text-muted">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="mb-16">
        <h2 className="type-h3 font-medium mb-6">What We Build</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <Card key={cap.title} className="p-6 h-full border-border hover:border-border-strong transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric mb-4">
                <cap.icon className="size-5" />
              </div>
              <h3 className="type-h4 font-medium mb-2">{cap.title}</h3>
              <p className="type-small text-text-secondary">{cap.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Selected Client Work */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-h3 font-medium">Selected Client Work</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="type-caption text-text-muted">Total Recorded Client Project Value</p>
              <p className="type-h4 font-mono font-medium text-text-primary">{formatRupiah(totalClientValue)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {clientProjects.map((project) => (
            <Card key={project.client} className="p-6 border-border hover:border-border-strong transition-colors">
              <div className="mb-4">
                <p className="type-caption text-text-muted uppercase tracking-wider mb-1">Client Project</p>
                <h3 className="type-h4 font-medium text-text-primary">{project.client}</h3>
              </div>
              <p className="type-h3 font-medium mb-2">{project.project}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="type-body font-mono font-medium text-text-primary">{formatRupiah(project.value)}</span>
                <Badge tone="neutral" className="type-caption">{project.category}</Badge>
              </div>
              <p className="type-small text-text-secondary">{project.description}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6 border-border-strong bg-ncd-surface/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="type-caption text-text-muted">Total Recorded Client Project Value</p>
              <p className="type-h3 font-mono font-medium text-text-primary">{formatRupiah(totalClientValue)}</p>
            </div>
            <p className="type-small text-text-secondary max-w-sm">
              Sum of confirmed project values. Not revenue, profit, or company valuation.
            </p>
          </div>
        </Card>
      </section>

      {/* Connect with NEXA */}
      <section className="mb-16">
        <h2 className="type-h3 font-medium mb-6">Connect with NEXA Tech Labs</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors">
                <social.icon className="size-5" />
              </div>
              <div>
                <p className="type-small font-medium text-text-primary">{social.name}</p>
                <p className="type-caption text-text-muted truncate max-w-[180px]">{social.href}</p>
              </div>
            </a>
          ))}
          <a
            href={nexaWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-ncd-surface/50 hover:border-border-strong hover:bg-ncd-hover transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ncd-electric/20 text-ncd-electric group-hover:bg-ncd-electric group-hover:text-text-primary transition-colors">
              <Globe className="size-5" />
            </div>
            <div>
              <p className="type-small font-medium text-text-primary">NEXA Tech Labs Website</p>
              <p className="type-caption text-text-muted truncate max-w-[180px]">{nexaWebsite}</p>
            </div>
            <ArrowUpRight className="size-4 text-text-muted ml-auto group-hover:text-ncd-electric transition-colors" />
          </a>
        </div>
      </section>

      {/* Relationship Summary Card */}
      <section>
        <Card className="p-6 border-border-strong bg-ncd-surface/50">
          <h3 className="type-h4 font-medium mb-4 flex items-center gap-2">
            <Building className="size-5 text-ncd-electric" />
            NEXA Tech Labs × NCD
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="type-small font-medium text-text-primary">Parent Organization</p>
              <p className="type-body text-text-secondary">NEXA Tech Labs — AI Product Studio</p>
            </div>
            <div className="space-y-2">
              <p className="type-small font-medium text-text-primary">Community</p>
              <p className="type-body text-text-secondary">NCD (NEXA Community Development)</p>
            </div>
            <div className="space-y-2">
              <p className="type-small font-medium text-text-primary">Relationship</p>
              <p className="type-body text-text-secondary">NCD operates under NEXA Tech Labs</p>
            </div>
          </div>
        </Card>
      </section>
    </Container>
  );
}
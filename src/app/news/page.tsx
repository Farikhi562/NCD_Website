import type { Metadata } from "next";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and announcements from NCD",
  alternates: { canonical: "/news" },
};

const newsArticles = [
  {
    slug: "offline-ncd-meeting-october-2026",
    title: "Offline NCD Meeting: Organization Structure & Period I Work Program",
    excerpt: "Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.",
    category: "Organization",
    date: "2026-10-12",
    readTime: "5 min read",
    author: "NCD Secretariat",
    content: `
      <p class="mb-4">On 12 October 2026, NCD (NEXA Community Development) held the Offline NCD Meeting for Period I at Bagi Kopi Margonda, Depok. This meeting was attended by the entire Period I leadership and marked a historic moment as the first offline meeting of the new leadership.</p>

      <h3 class="type-h3 font-medium mt-8 mb-4">Meeting Agenda</h3>
      <ol class="list-decimal list-inside space-y-3 type-body text-text-secondary mb-8">
        <li><strong>Opening and Welcome</strong> by Chairperson, Mirza Danisywar Noor Wahyu.</li>
        <li><strong>Organization Structure</strong> discussion for the three permanent NCD divisions.</li>
        <li><strong>Period I Leadership</strong> alignment and roles.</li>
        <li><strong>Work Program Presentation</strong> by Vice Chairperson, Muhamad Fauzan Al Farikhi.</li>
        <li><strong>Vision & Mission Presentation</strong> by Chairperson.</li>
        <li><strong>Discussion and Alignment</strong>.</li>
      </ol>

      <h3 class="type-h3 font-medium mt-8 mb-4">Organization Structure</h3>
      <p class="mb-4">The meeting discussed the three permanent divisions of NCD:</p>
      <ul class="list-disc list-inside space-y-2 type-body text-text-secondary mb-8">
        <li><strong>People & Culture:</strong> Member development, onboarding, networking, and personal growth.</li>
        <li><strong>Competition & Strategy:</strong> Competition Radar, Competition Brief, Competition Day, and Retrospective.</li>
        <li><strong>Project & Development:</strong> Project Lab, Project Clinic, Squad formation, and Demo Day.</li>
      </ul>
      <p class="mb-4">Division leads remain <strong>Not Assigned</sup> as of this meeting. Selection will continue in follow-up sessions.</p>

      <h3 class="type-h3 font-medium mt-8 mb-4">Period I Work Program</h3>
      <p class="mb-4">Vice Chairperson Muhamad Fauzan Al Farikhi presented the Period I work program outline organized by division:</p>
      <ul class="list-disc list-inside space-y-2 type-body text-text-secondary mb-8">
        <li><strong>People & Culture:</strong> NCD Discover (onboarding), NCD Connect (networking), NCD Grow (skill sharing), Growth Map implementation.</li>
        <li><strong>Competition & Strategy:</strong> Competition Radar setup, Competition Brief template, Competition Day series, Retrospective framework.</li>
        <li><strong>Project & Development:</strong> Project Lab launch, Project Clinic schedule, Squad formation guide, Demo Day preparation.</li>
      </ul>

      <h3 class="type-h3 font-medium mt-8 mb-4">Period I Vision & Mission</h3>
      <p class="mb-4">Chairperson Mirza Danisywar Noor Wahyu presented the Period I vision and mission:</p>
      <blockquote class="border-l-4 border-ncd-electric pl-4 my-4 italic text-text-secondary">
        "To become a cross-disciplinary student development platform that encourages members to learn, collaborate, build work, and grow through competition experience."
      </blockquote>
      <p class="mb-4">Four mission pillars:</p>
      <ol class="list-decimal list-inside space-y-2 type-body text-text-secondary mb-8">
        <li>Introduce members and their skills to each other.</li>
        <li>Build learning and sharing habits.</li>
        <li>Form projects and join competitions across majors and cohorts.</li>
        <li>Evaluate and document every experience for the next generation.</li>
      </ol>

      <h3 class="type-h3 font-medium mt-8 mb-4">Meeting Details</h3>
      <dl className="grid gap-3 md:grid-cols-2 type-body text-text-secondary mb-8">
        <div>
          <dt className="type-caption text-text-muted">Date</dt>
          <dd className="type-body font-medium">{formatDate("2026-10-12")}</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Time</dt>
          <dd className="type-body font-medium">13:30 – finish</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Location</dt>
          <dd className="type-body font-medium">Bagi Kopi Margonda, Depok</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Participants</dt>
          <dd className="type-body font-medium">Period I Leadership & Division Lead Candidates</dd>
        </div>
      </dl>

      <p className="type-body text-text-secondary">
        Full meeting documentation (minutes, photos, and decisions) is available in the NCD internal archive. Members unable to attend can access the meeting recording through the internal platform.
      </p>
    `,
  },
];

export default function NewsPage() {
  return (
    <Container className="py-8 md:py-12">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "News", href: "/news" }
      ]} />
      <PageHeader
        title="News"
        description="Latest announcements and updates from NCD"
        className="mb-8"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsArticles.map((article) => (
          <article key={article.slug}>
            <Link href={`/news/${article.slug}`}>
              <Card className="h-full flex flex-col overflow-hidden group">
                <div className="relative h-40 bg-gradient-to-br from-ncd-electric/20 to-ncd-violet/20 flex items-center justify-center">
                  <span className="type-display font-medium text-ncd-electric/50">NEWS</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge tone="info">{article.category}</Badge>
                    <time className="type-caption text-text-muted">{formatDate(article.date)}</time>
                  </div>
                  <h2 className="type-h4 font-medium mb-2 line-clamp-2 group-hover:text-ncd-electric transition-colors">
                    {article.title}
                  </h2>
                  <p className="type-small text-text-secondary mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-text-muted type-caption mt-auto pt-4 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </article>
        ))}
      </div>

      {newsArticles.length === 0 && (
        <div className="mt-8 text-center">
          <p className="type-body text-text-secondary">No news articles yet.</p>
        </div>
      )}
    </Container>
  );
}
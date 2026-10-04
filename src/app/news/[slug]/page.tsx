import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const newsArticles: Record<string, {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
}> = {
  "offline-ncd-meeting-october-2026": {
    slug: "offline-ncd-meeting-october-2026",
    title: "Offline NCD Meeting: Organization Structure & Period I Work Program",
    excerpt: "Offline NCD meeting discussing organization structure, Period I leadership, work program, vision, and mission.",
    category: "Organization",
    date: "2026-10-12",
    readTime: "5 min read",
    author: "NCD Secretariat",
    content: `
      <p class="mb-4">On 12 October 2026, NCD (NEXA Community Development) held the Offline NCD Meeting for Period I at the NEXA Tech Labs office. This meeting was attended by the entire Period I leadership and marked a historic moment as the first offline meeting of the new leadership.</p>

      <h3 class="type-h3 font-medium mt-8 mb-4">Meeting Agenda</h3>
      <ol class="list-decimal list-inside space-y-3 type-body text-text-secondary mb-8">
        <li><strong>Opening and Welcome</strong> by Chairperson, Mirza Danisywar Noor Wahyu.</li>
        <li><strong>Division Lead Election</strong> for the three permanent NCD divisions.</li>
        <li><strong>Work Program Presentation</strong> by Vice Chairperson, Muhamad Fauzan Al Farikhi.</li>
        <li><strong>Vision & Mission Presentation</strong> by Chairperson.</li>
        <li><strong>Discussion and Closing</strong>.</li>
      </ol>

      <h3 class="type-h3 font-medium mt-8 mb-4">Division Lead Election Results</h3>
      <p class="mb-4">Division lead elections were conducted democratically through internal voting. Results are as follows:</p>
      <ul class="list-disc list-inside space-y-2 type-body text-text-secondary mb-8">
        <li><strong>People & Culture:</strong> Not Assigned</li>
        <li><strong>Competition & Strategy:</strong> Not Assigned</li>
        <li><strong>Project & Development:</strong> Not Assigned</li>
      </ul>
      <p class="mb-4">Division lead elections will continue in a follow-up meeting next week. Candidates are currently conducting interviews and presenting their vision for each division.</p>

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
          <dd className="type-body font-medium">09:00 – 15:00 WIB</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Location</dt>
          <dd className="type-body font-medium">NEXA Tech Labs Office, Bandung</dd>
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
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = newsArticles[resolvedParams.slug];
  
  if (!article) {
    return { title: "Not Found" };
  }
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = newsArticles[resolvedParams.slug];

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-8 md:py-12 max-w-3xl">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "News", href: "/news" },
        { label: article.title, href: `/news/${article.slug}` }
      ]} />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="info">{article.category}</Badge>
            <time className="type-caption text-text-muted">{formatDate(article.date)}</time>
          </div>
          <h1 className="type-h1 font-medium mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-text-muted type-caption">
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.readTime}
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/news" className="inline-flex items-center gap-2 text-ncd-electric hover:underline type-body font-medium">
            <ArrowLeft className="size-4" />
            Back to News
          </Link>
        </div>
      </article>
    </Container>
  );
}
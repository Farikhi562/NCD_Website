import type { Metadata } from "next";
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
};

const newsArticles = [
  {
    slug: "meeting-luring-oktober-2026",
    title: "Meeting Luring NCD: Pemilihan Ketua Divisi dan Penyampaian Proker, Visi & Misi",
    excerpt: "Rapat kerja luring NCD Periode I untuk memilih ketua ketiga divisi serta menyampaikan program kerja, visi, dan misi kepengurusan Mirza–Fauzan.",
    category: "Organization",
    date: "2026-10-12",
    readTime: "5 min read",
    author: "NCD Secretariat",
    content: `
      <p class="mb-4">Pada tanggal 12 Oktober 2026, NCD (NEXA Community Development) menggelar Meeting Luring Periode I di kantor NEXA Tech Labs. Rapat ini dihadiri oleh seluruh calon anggota kepengurusan Periode I dan menjadi momen historis sebagai pertemuan luring pertama kepengurusan baru.</p>

      <h3 class="type-h3 font-medium mt-8 mb-4">Agenda Rapat</h3>
      <ol class="list-decimal list-inside space-y-3 type-body text-text-secondary mb-8">
        <li><strong>Pembukaan dan Sambutan</strong> oleh Ketua Umum Periode I, Mirza Danisywar Noor Wahyu.</li>
        <li><strong>Pemilihan Ketua Divisi</strong> untuk ketiga divisi permanen NCD.</li>
        <li><strong>Penyampaian Program Kerja (Proker)</strong> oleh Wakil Ketua, Muhamad Fauzan Al Farikhi.</li>
        <li><strong>Penyampaian Visi & Misi</strong> Periode I oleh Ketua Umum.</li>
        <li><strong>Diskusi dan Penutupan</strong>.</li>
      </ol>

      <h3 class="type-h3 font-medium mt-8 mb-4">Hasil Pemilihan Ketua Divisi</h3>
      <p class="mb-4">Pemilihan ketua divisi dilakukan secara demokratis melalui voting internal. Hasilnya adalah sebagai berikut:</p>
      <ul class="list-disc list-inside space-y-2 type-body text-text-secondary mb-8">
        <li><strong>People & Culture:</strong> Belum Dipilih</li>
        <li><strong>Competition & Strategy:</strong> Belum Dipilih</li>
        <li><strong>Project & Development:</strong> Belum Dipilih</li>
      </ul>
      <p class="mb-4">Pemilihan ketua divisi akan dilanjutkan dalam rapat lanjutan dalam minggu depan. Calon-kcalon sedang melakukan wawancara dan presentasi visi masing-masing divisi.</p>

      <h3 class="type-h3 font-medium mt-8 mb-4">Program Kerja Periode I</h3>
      <p class="mb-4">Wakil Ketua Muhamad Fauzan Al Farikhi menyampaikan outline program kerja Periode I yang dibagi per divisi:</p>
      <ul class="list-disc list-inside space-y-2 type-body text-text-secondary mb-8">
        <li><strong>People & Culture:</strong> NCD Discover (onboarding), NCD Connect (networking), NCD Grow (skill sharing), Growth Map implementation.</li>
        <li><strong>Competition & Strategy:</strong> Competition Radar setup, Competition Brief template, Competition Day series, Retrospective framework.</li>
        <li><strong>Project & Development:</strong> Project Lab launch, Project Clinic schedule, Squad formation guide, Demo Day preparation.</        </ul>

      <h3 class="type-h3 font-medium mt-8 mb-4">Visi & Misi Periode I</h3>
      <p class="mb-4">Ketua Umum Mirza Danisywar Noor Wahyu menyampaikan visi dan misi Periode I:</p>
      <blockquote class="border-l-4 border-ncd-electric pl-4 my-4 italic text-text-secondary">
        "Menjadi wadah pengembangan mahasiswa lintas bidang yang mendorong anggota untuk belajar, berkolaborasi, membangun karya, dan berkembang melalui pengalaman kompetisi."
      </blockquote>
      <p class="mb-4">Misi empat pilar:</p>
      <ol class="list-decimal list-inside space-y-2 type-body text-text-secondary mb-8">
        <li>Memperkenalkan anggota dan skill mereka satu sama lain.</li>
        <li>Membangun kebiasaan belajar dan berbagi (learning & sharing).</li>
        <li>Membentuk project dan mengikuti kompetisi lintas jurusan dan angkatan.</li>
        <li>Mengevaluasi dan mendokumentasikan setiap pengalaman untuk generasi berikutnya.</li>
      </ol>

      <h3 class="type-h3 font-medium mt-8 mb-4">Detail Acara</h3>
      <dl className="grid gap-3 md:grid-cols-2 type-body text-text-secondary mb-8">
        <div>
          <dt className="type-caption text-text-muted">Tanggal</dt>
          <dd className="type-body font-medium">{formatDate("2026-10-12")}</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Waktu</dt>
          <dd className="type-body font-medium">09:00 – 15:00 WIB</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Lokasi</dt>
          <dd className="type-body font-medium">Kantor NEXA Tech Labs, Bandung</dd>
        </div>
        <div>
          <dt className="type-caption text-text-muted">Peserta</dt>
          <dd className="type-body font-medium">Kepengurusan Periode I & Calon Ketua Divisi</dd>
        </div>
      </dl>

      <p className="type-body text-text-secondary">
        Dokumentasi lengkap rapat (notulis, foto, dan keputusan) tersedia di arsip internal NCD. Anggota yang tidak dapat hadir dapat mengakses rekaman rapat melalui platform internal.
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
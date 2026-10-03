# NCD Website — Product Requirements Document (PRD)

> Definisi produk NCD Website yang utuh dan mudah dibaca manusia.
> Dokumen pendamping: `spec.md` (source of truth requirement formal), `design.md` (visual & interaksi), `agents.md` (cara AI agent bekerja).

**Status:** Draft v0.1
**Dasar:** `spec.md` v0.1, `design.md` v0.1, `agents.md` v0.1 — semuanya dibaca penuh sebelum dokumen ini ditulis.
**Bahasa dokumen:** Indonesia, dengan istilah produk NCD dipertahankan apa adanya (Competition Radar, Project Lab, Growth Map, dst.). Bahasa dokumen ini **tidak** menentukan bahasa UI website (lihat D-07).

**Aturan baca dokumen ini**

| Tag | Arti |
|---|---|
| `DECISION NEEDED` | Keputusan belum diambil oleh pimpinan NCD. PRD ini **tidak** menyelesaikannya. |
| `UNDEFINED` | Tidak ada sumber yang mendefinisikannya. Tidak diisi dengan karangan. |
| `Unable to verify` | Tidak dapat diperiksa dari materi yang tersedia. |
| `spec §x` / `design §x` / `agents §x` | Rujukan ke dokumen sumber. Isi detail tidak disalin ulang. |
| `D-xx` | ID keputusan terbuka dari `spec.md` §21. |

**Prinsip penting:** sumber organisasi NCD (*Rancangan NCD satu semester, Oktober 2026 – April 2027*) menyebut dirinya "rancangan awal untuk didiskusikan", **bukan keputusan**. Seluruh isi PRD ini mewarisi status itu. Jika ada konflik, `spec.md` menang (urutan: `agents.md` §0).

---

## Daftar Isi

1. Documentation Architecture
2. Product Identity
3. Product Vision
4. Problem
5. Product Goals
6. Non-Goals
7. Product Loop & Ecosystem
8. User Types
9. Role & Authorization Model
10. Website Architecture
11. Public Website (per route)
12. Homepage
13. Modul Produk (About, People, Growth, Activities, Projects, Competitions, Squads, Knowledge, Retrospective, Archive, Transparency, Kas)
14. Authentication
15. Authenticated App
16. Admin
17. Navigation Model
18. Search
19. Data Behavior
20. Period & Handover
21. User Flows
22. Empty / Loading / Error / Permission States
23. Design Requirements (rujukan)
24. Responsive
25. Accessibility
26. Data Integrity
27. Security & Privacy
28. Content & Voice
29. Scope: MVP, V1, Future
30. Roadmap
31. Success Criteria
32. Acceptance Criteria
33. Open Decisions
34. Requirement Traceability
35. Current Product State
36. Requirements vs Implementation Gaps
37. Catatan Deviasi terhadap Brief PRD

---

## 1. Documentation Architecture

```
spec.md    → Product requirements dan source of truth (APA + MENGAPA)
prd.md     → Definisi produk lengkap yang mudah dibaca manusia
design.md  → Sistem visual dan UX (BAGAIMANA TAMPILAN + RASANYA)
agents.md  → Aturan implementasi untuk AI agent (BAGAIMANA MEMBANGUN)
```

| Dokumen | Peran |
|---|---|
| `spec.md` | Menentukan **apa dan mengapa**. Requirement formal, entitas data, matriks permission, keputusan terbuka. |
| `prd.md` | Menyatukan perilaku produk, scope fitur, user journey, dan acceptance criteria dalam satu dokumen level produk. **Tidak menggantikan** `spec.md`. |
| `design.md` | Menentukan presentasi visual dan interaksi (token, tipografi, spacing, radius, grid, navigasi, komponen). |
| `agents.md` | Menentukan cara AI agent bekerja: workflow, larangan, area terlindungi, definition of done. |

**Aturan turunan**

- PRD **merujuk**, tidak menyalin: token desain → `design.md` §3–§12; aturan engineering → `agents.md` §2–§11.
- Jika PRD dan `spec.md` bertentangan, `spec.md` benar dan PRD harus diperbaiki.
- Jika sebuah hal `DECISION NEEDED` di `spec.md`, ia tetap `DECISION NEEDED` di sini.
- PRD tidak menambah requirement yang tidak ada di `spec.md`. Pengecualian hanya berupa penjelasan, pengelompokan, dan acceptance criteria turunan dari requirement yang sudah ada.

---

## 2. Product Identity

**NCD — Growth Together.**

NCD adalah **digital infrastructure that documents, connects and grows the NCD ecosystem** (spec §1).

Organisasi: NCD = NEXA Community Development, divisi di bawah NEXA. Hubungan resmi antara "NEXA Community Development", "NEXA Tech Labs" (logo), dan "NEXA / Competition Division" (sampul dokumen NCD) adalah `DECISION NEEDED` (D-01). PRD ini menulis "NCD" saja.

**Posisi website dalam struktur NCD:** NCD Website adalah komponen **Support System** (bersama NCD Kas, Documentation, Knowledge Base), bukan program tersendiri (spec §1). Dokumen NCD menggambarkannya sebagai tempat perjalanan NCD bisa dilihat, didokumentasikan, dan diteruskan oleh kepengurusan berikutnya.

**NCD Website adalah**

- digital home / support system NCD
- tempat orang, knowledge, project, kompetisi, aktivitas, dan dokumentasi saling terhubung
- produk yang terasa seperti internal product yang dibuat dengan baik dan kebetulan punya wajah publik (design §1)

**NCD Website bukan**

| Bukan | Alasan |
|---|---|
| Company profile | spec §4 |
| Website organisasi kampus generik | spec §1, design §1 |
| Dashboard SaaS generik | design §1 |
| Social media | spec §4 (tanpa fitur social network di MVP) |
| Payment platform | NCD Kas adalah ledger pencatatan (spec §8.10) |
| Leaderboard | spec §4, NCD-DOC §12 |
| Aplikasi chat | spec §4 (default: tidak ada messaging; `UNDEFINED` jika diinginkan) |

**Catatan scope dari dokumen NCD (spec §1):** *"Ini masih konsep organisasi mahasiswa, bukan startup. Fiturnya sederhana dulu, tidak perlu rumit."* Kalimat ini membatasi MVP: modul dari brief dipertahankan, tetapi masing-masing diimplementasikan dalam bentuk paling sederhana yang berguna.

Skala: sekitar **25 anggota**, batas sementara **~30** (spec §5). Desain untuk data berskala manusia, tetapi arsitektur tetap extensible untuk periode dan angkatan berikutnya.

---

## 3. Product Vision

Website menjadi tempat di mana perjalanan NCD:

- **dapat dilihat** — oleh anggota, dan oleh publik sesuai keputusan visibility
- **dapat didokumentasikan** — proses, hasil, kegagalan, dan pembelajaran
- **dapat dipelajari** — knowledge yang bisa dipakai ulang
- **dapat diteruskan** — ke kepengurusan/periode berikutnya
- **menghubungkan** people, knowledge, projects, competitions, activities, dan documentation

**Growth Together** berarti pertumbuhan bersama. Pertumbuhan **bukan** kompetisi antar anggota. Website **tidak boleh** memiliki sistem ranking anggota dalam bentuk apa pun: UI, query, analytics, maupun penamaan (agents §8).

Rantai Growth Together dari dokumen NCD (spec Appendix A): *Build People → Build Skill → Build Project → Build Competition Experience → Build Knowledge.*

Poin yang dijaga: *NCD bukan cuma tempat mencari dan mengikuti lomba* (design §29). Website tidak boleh terdengar seperti papan pengumuman lomba.

---

## 4. Problem

Diambil dari spec §2.

| Area | Masalah |
|---|---|
| **People** | Anggota belum tentu saling mengenal; team chemistry belum terbentuk. |
| **Skills** | Skill dan minat tidak terlihat; orang berbeda-beda tetapi tidak ada yang tahu siapa bisa apa. |
| **Collaboration** | Anggota cenderung bekerja dalam lingkarannya masing-masing. |
| **Experience** | Pengalaman project dan competition tidak merata dan tidak terdokumentasi dengan baik. |
| **Knowledge** | Knowledge dan pengalaman proses hilang ketika kepengurusan berganti. |
| **Competition** | Berisiko hanya menjadi poster yang dikirim ke grup ("sekadar kirim poster lomba ke grup"). |
| **Documentation** | Aktivitas dan proses tidak punya arsip terstruktur. |
| **Transparency** | Informasi NCD Kas perlu pencatatan yang transparan sesuai permission. |
| **Continuity** | Kepengurusan berikutnya harus bisa mewarisi knowledge dan history. |
| **Passivity** | Tanpa sistem yang jelas, NCD berisiko aktif di awal lalu meredup (NCD-DOC §2, spec §2 item 6). |

---

## 5. Product Goals

Penomoran G1–G9 di bawah adalah penomoran PRD. Pemetaan ke goal `spec.md` §3 diberikan di kolom kanan agar tidak menimbulkan konflik.

| # | Goal | Isi | Modul / Route | Rujukan spec |
|---|---|---|---|---|
| **G1** | Discover People | Anggota memahami siapa anggota NCD: jurusan, angkatan, skill, minat, division, kontribusi. | People | spec G1, §8.2 |
| **G2** | Learn | Knowledge yang dapat digunakan ulang. | Knowledge | spec G7, §8.8 |
| **G3** | Connect | Menemukan orang berdasarkan skill, minat, pengalaman, dan konteks kerja. | People, Squads (team formation) | spec G1, F-19 |
| **G4** | Build | Project didokumentasikan sebagai perjalanan Idea → Problem → Research → Solution → Prototype → Test → Improve → Submit. | Projects | spec G4, §8.5 |
| **G5** | Compete | Competition Radar dan Competition Brief. | Competitions | spec G2, §8.6 |
| **G6** | Document | Activities, retrospectives, project records, competition records, achievements, sejarah organisasi. | Activities, Archive | spec G6, §8.4, §8.9 |
| **G7** | Grow | Growth Map tiap anggota, tanpa ranking. | Growth | spec §8.3 |
| **G8** | Transparency | Informasi transparansi sesuai keputusan visibility. | Transparency, Kas | spec G5, §8.10 |
| **G9** | Handover | Rekam jejak historis tetap berguna ketika periode berganti. | Archive, Period | spec G8, §13 |

Tambahan dari spec: **spec G3** (squad terlihat dan progresnya) dipenuhi oleh modul Squads; **spec G9** (kualitas produk serius, bukan template kampus) dipenuhi oleh kepatuhan pada `design.md`.

---

## 6. Non-Goals

Website **tidak** melakukan hal berikut.

| Non-goal | Sumber |
|---|---|
| Ranking anggota, "Top Member", "Most Active", "#1", skor, popularitas, leaderboard kontribusi | spec §4, NCD-DOC §12, design §31 |
| Statistik palsu (jumlah anggota/project/kompetisi yang tidak benar-benar ada) | agents §8 |
| Achievement palsu | spec §8.9, agents §2 |
| Payment gateway | spec §4, §8.10 |
| Sistem chat / messaging | spec §4 |
| Gamifikasi yang tidak perlu | spec §4 |
| Social network generik | spec §4 |
| Otomasi berlebihan | spec §4 |
| Ledakan fitur ala startup | NCD-DOC §16 (spec §1) |
| Manajemen event seluruh NEXA (mis. NEXA Gathering) | spec §4; penempatan di situs `DECISION NEEDED` (D-17) |
| Target angka, kuota, atau persentase progress-to-goal sebelum didefinisikan pimpinan | spec §17 |
| Tracking per-anggota pada halaman internal | spec §17 |

NCD adalah organisasi mahasiswa / community ecosystem. MVP harus sederhana dan berguna.

---

## 7. Product Loop & Ecosystem

### 7.1 Conceptual backbone

```
PEOPLE → LEARN → CONNECT → BUILD → COMPETE → DOCUMENT → GROW → KNOWLEDGE → PEOPLE
```

Loop ini adalah tulang punggung konseptual produk. Contoh perjalanan:

| Tahap | Contoh di website |
|---|---|
| People | Anggota menemukan orang dengan skill tertentu. |
| Connect | Squad dibentuk dari anggota lintas division/jurusan/angkatan. |
| Build | Squad mengerjakan project. |
| Compete | Squad mengikuti competition. |
| Document | Proses disimpan sebagai activity, project record, competition record. |
| Retrospective | Hasil dievaluasi dengan pertanyaan yang sama untuk semua. |
| Knowledge | Pembelajaran disimpan di Knowledge Base. |
| Grow | Anggota berkembang terhadap dirinya sendiri (Growth Map). |
| People | Knowledge tersebut membantu anggota lain. |

### 7.2 Hubungan tiap tahap ecosystem dengan website

Deskripsi per tahap mengikuti NCD-DOC §20 (spec §8.11).

| Tahap | Makna (NCD-DOC §20) | Muncul di website sebagai | Route |
|---|---|---|---|
| **People** | Saling mengenal anggota, skill, minat, pengalaman, target | Profil anggota | `/people` |
| **Learn** | Belajar dan berbagi satu sama lain | Knowledge Base, aktivitas kategori Learning | `/knowledge`, `/activities` |
| **Connect** | Anggota lintas jurusan dan angkatan membangun hubungan | Pencarian orang berdasarkan skill/minat, squad | `/people`, `/app/squads` |
| **Build** | Membentuk project dan menerapkan skill | Project Lab / case study | `/projects` |
| **Compete** | Membawa project ke kompetisi | Competition Radar + Brief | `/competitions` |
| **Document** | Mencatat proses, hasil, kegagalan, pembelajaran | Activities, retrospective, dokumentasi | `/activities`, `/app/documentation` |
| **Grow** | Pengalaman menjadi knowledge bagi anggota dan kepengurusan berikutnya | Growth Map, Archive | `/app/growth`, `/archive` |

Visualisasi ecosystem adalah salah satu identitas visual utama (design §1, §30). Dibuat dengan HTML/SVG, dapat diakses sebagai ordered list di DOM, bukan gambar.

---

## 8. User Types

Sizing dan kebutuhan dari spec §5.

| User | Deskripsi | Tujuan utama |
|---|---|---|
| **PUBLIC** (Visitor) | Siapa pun di luar NCD, tanpa login: mahasiswa lain, anggota NEXA, penyelenggara lomba, calon anggota. | Memahami NCD; melihat konten publik: project, activities, competitions, knowledge, organisasi. |
| **MEMBER** | Anggota NCD (lintas jurusan, lintas angkatan). | Melihat anggota, menemukan skill, membaca knowledge, melihat competition, mengikuti squad, melihat growth sendiri, melihat transparency sesuai permission. |
| **PIC** | Person in Charge. | Mengelola konten/pekerjaan yang menjadi tanggung jawabnya. |
| **DIVISION_LEAD** | Ketua salah satu division. | Mengelola konten division. |
| **LEADERSHIP** | Ketua dan Wakil Ketua NCD. | Oversight organisasi. |
| **ADMIN** | System administration. | Konfigurasi, media, akses. |

### 8.1 PIC — ditegaskan

**PIC bukan peringkat global.** PIC adalah **assignment** berdasarkan task, project, competition, dokumentasi, atau area tertentu (NCD-DOC §18, spec §6). PIC tidak harus anggota yang paling mahir. Contoh area dalam dokumen NCD: Technical, Design, Research, Competition, Documentation — itu **contoh**, bukan daftar tertutup; apakah daftarnya tetap adalah `DECISION NEEDED` (D-12).

### 8.2 Division

Tiga division permanen (spec Appendix A):

1. People & Culture
2. Competition & Strategy
3. Project & Development

Support System (NCD Kas, NCD Website, Documentation, Knowledge Base) **bukan** division. Competition Squad bersifat temporer.

### 8.3 ADMIN

Siapa pemegang ADMIN dan apakah LEADERSHIP boleh bertindak sebagai ADMIN: **`DECISION NEEDED`** (D-04). Dokumen NCD tidak mendefinisikan peran admin teknis. PRD ini tidak menunjuk siapa pun.

---

## 9. Role & Authorization Model

Role sistem: `PUBLIC`, `MEMBER`, `PIC`, `DIVISION_LEAD`, `LEADERSHIP`, `ADMIN`.

| Role | Konsep di dokumen NCD | Catatan |
|---|---|---|
| `PUBLIC` | — | Tidak terautentikasi. |
| `MEMBER` | Anggota NCD | ~25–30 orang. |
| `PIC` | PIC per task/area | Assignment dengan scope, bukan rank. |
| `DIVISION_LEAD` | Ketua divisi | Per division, terikat period. |
| `LEADERSHIP` | Ketua + Wakil Ketua | Terikat period. Ketua = arah/keputusan; Wakil = koordinasi/eksekusi/monitoring. |
| `ADMIN` | **UNDEFINED** | D-04. |

**Prinsip**

1. **Satu orang, banyak assignment.** Contoh: MEMBER + PIC + DIVISION_LEAD.
2. **Role = assignment dengan scope** (global, division, project, competition, squad, area), bukan flat global role.
3. **PIC bukan hierarki global.** PIC hanya berlaku untuk item yang di-assign.
4. **Leadership ≠ Admin.** Leadership mengelola konten organisasi; Admin mengelola sistem. Apakah Leadership dapat bertindak sebagai Admin: `DECISION NEEDED` (D-04).
5. **Role terikat period.** Riwayat role harus bertahan ketika period berganti.
6. **Otorisasi server-side.** Role diambil dari database untuk user terautentikasi; **client tidak boleh menentukan role sendiri** (header, cookie, form field, query param, local storage).
7. **Dua lapis:** RLS di database **dan** pengecekan di kode server. Salah satu saja tidak cukup (agents §6.2).
8. **Deny by default.** Tabel baru: RLS aktif tanpa policy permisif sampai ditambahkan dengan sengaja.
9. **Perubahan role adalah aksi istimewa** dan dicatat (spec §11 rule 5).

**Matriks permission** lengkap (dengan sel bertanda ⚠ yang belum diputuskan) ada di `spec.md` §11 dan **tidak disalin ulang** di sini. Ringkasan perilaku:

| Hal | Perilaku |
|---|---|
| Konten publik | Dapat dibaca PUBLIC jika ditandai publik. Visibilitas People, Competitions, Squads, dan Kas bagi PUBLIC masih bertanda ⚠. |
| Konten internal | MEMBER ke atas. Tidak pernah dilayani tanpa autentikasi dan tidak pernah di-index. |
| Growth Map | Pemilik. Akses Division Lead/Leadership: `DECISION NEEDED` (D-13). |
| Kas | Kebijakan paling ketat; policy RLS khusus; baca dan tulis dipisah; penulis `DECISION NEEDED` (D-03). |
| Scope Division Lead | Hanya konten division-nya (spec §11 rule 2). Edit lintas division perlu Leadership. |
| Scope PIC | Hanya item yang di-assign (spec §11 rule 3). |
| Pengelolaan period & About | Leadership. |

---

## 10. Website Architecture

Tiga experience terpisah:

```
PUBLIC WEBSITE  →  AUTHENTICATED APP  →  ADMIN
      /                  /app               /admin
```

| Experience | Siapa | Layout | Sumber |
|---|---|---|---|
| **Public website** | Siapa pun | Top navigation + content container maks 1280px | design §13 |
| **Authenticated app** | MEMBER ke atas | Sidebar persisten + main content | design §13 |
| **Admin** | ADMIN (+ peran yang diizinkan, D-04) | Shell terpisah dengan label konteks "Admin" yang persisten (bukan palet berbeda) | design §13 |

**Catatan penting:** keberadaan sebuah route di pohon route **tidak berarti** halaman itu masuk MVP. Fasa ditentukan di §29 dan spec §14 (agents §4).

### 10.1 Pohon route

```
PUBLIC                     AUTHENTICATED (/app)        ADMIN (/admin)
/                          /app/dashboard              /admin/overview
├── about                  ├── people                  ├── members
├── people                 ├── activities              ├── activities
├── activities             ├── projects                ├── projects
├── projects               ├── competitions            ├── competitions
├── competitions           ├── squads                  ├── knowledge
├── knowledge              ├── knowledge               ├── documentation
├── transparency           ├── growth                  ├── kas
└── archive                ├── documentation           ├── media
                           └── kas                     └── settings
```

Route auth: `/login` (dan alur terkait, lihat §14).

---

## 11. Public Website (per route)

Berlaku untuk semua halaman data-driven: **loading** = skeleton yang meniru layout; **empty** = informasi, bukan lucu; **error** = jelas, singkat, tidak menyalahkan, ada recovery (design §23–§25). Teks state per modul ada di §22. Responsive umum: lihat §24.

**Tidak ada route publik yang memerlukan login**, kecuali bagian yang visibility-nya dibatasi per record; record yang tidak diizinkan tidak ditampilkan kepada PUBLIC.

### 11.1 `/` — Home

| Aspek | Isi |
|---|---|
| Purpose | Entry point utama; menjelaskan NCD, ecosystem, dan pintu masuk ke modul. |
| Target user | PUBLIC; juga MEMBER yang belum login. |
| Content | Hero tipografis, Current Pulse (jika ada data), People, Projects, Competitions, Activities, Knowledge, Ecosystem, Footer. Rinci di §12. |
| Primary action | **Explore NCD** |
| Secondary action | **View Projects** |
| Data source | Hero/ecosystem: konten statis. Pulse dan featured: query database langsung. |
| Visibility | Publik; hanya record yang ditandai publik. |
| Empty/Loading/Error | Section tanpa data memakai honest empty state atau disembunyikan; tidak diisi data palsu. Skeleton per section (Suspense per section). |
| Auth | Tidak. |
| Responsive | Hero tipografis di semua ukuran; Pulse jadi daftar vertikal; Ecosystem vertikal di mobile, horizontal/siklus di desktop (design §27). |

### 11.2 `/about`

| Aspek | Isi |
|---|---|
| Purpose | Menjelaskan NCD: organisasi, nilai, dan filosofi Growth Together. |
| Target user | PUBLIC, calon anggota, penyelenggara. |
| Content | Vision, mission, values, leadership, struktur organisasi, divisions, support systems, penjelasan singkat Growth Together (spec §8.1). |
| Primary action | Menelusuri ke modul terkait (Explore). |
| Secondary action | Login. |
| Data source | Konten organisasi; dikelola Leadership. |
| Visibility | Publik. |
| Empty/Error | Bagian yang belum dikonfirmasi tidak ditampilkan sebagai final. |
| Auth | Tidak. |
| Responsive | Kolom baca 720–820px; struktur organisasi disusun ulang untuk mobile. |

**Aturan konten:** mission ditandai "usulan, bisa diubah" di sumber; leadership names dan nilai adalah draft yang harus dikonfirmasi sebelum launch. Foto leadership: butuh consent dan keputusan (D-24); **tidak** disalin dari PDF tanpa persetujuan.

### 11.3 `/people`

| Aspek | Isi |
|---|---|
| Purpose | *Membuat orang dan kemampuan mereka terlihat satu sama lain.* |
| Target user | MEMBER (utama); PUBLIC hanya jika diaktifkan. |
| Content | MemberCard: nama, jurusan, angkatan, division, skill tag yang dipublikasikan anggota. |
| Primary action | Membuka profil / memfilter berdasarkan skill, division, minat. |
| Secondary action | — |
| Data source | `members`, `profiles`, `member_skills`, `divisions`. |
| Visibility | **`DECISION NEEDED` (D-06).** Halaman publik bahkan bisa **dimatikan** sampai anggota memberi consent. Default konservatif: publik hanya nama, jurusan, angkatan, division, skill tag yang dipilih anggota. |
| Empty | "Not yet documented" / "No members found" dengan nada informatif. |
| Auth | Tidak untuk field publik; field member-only memerlukan login. |
| Responsive | Kartu 1 kolom (mobile), 2 (tablet), 3–4 (desktop). |
| Larangan | Tanpa ranking, skor, top member, most active, popularitas, leaderboard kontribusi. |

Indexing halaman People: default `noindex` sampai keputusan consent (spec §18).

### 11.4 `/activities`

| Aspek | Isi |
|---|---|
| Purpose | Timeline dokumentasi aktivitas NCD. |
| Target user | PUBLIC, MEMBER. |
| Content | Date, Activity, Category, Participants, Documentation, Outcome. |
| Primary action | Membaca/membuka detail aktivitas. |
| Secondary action | Filter berdasarkan kategori. |
| Data source | `activities`, `activity_members`. |
| Visibility | Publik untuk aktivitas yang ditandai publik. |
| Empty | "No activities yet" (informatif). |
| Auth | Tidak. |
| Responsive | Timeline vertikal; tanggal mono di atas item pada mobile (design §30). |

### 11.5 `/projects`

| Aspek | Isi |
|---|---|
| Purpose | Showcase project sebagai case study / portfolio. |
| Target user | PUBLIC, MEMBER. |
| Content | ProjectCard: nama, deskripsi singkat, tag, status, team, period. Detail = case study. |
| Primary action | "View project →" |
| Secondary action | Filter berdasarkan tag/status. |
| Data source | `projects`, `project_members`, `project_tags`. |
| Visibility | Per project: publik atau internal (project yang belum disubmit bisa rahasia). Default `DECISION NEEDED` (D-10). |
| Empty | "No projects yet. Projects created by NCD will appear here." |
| Auth | Tidak untuk project publik. |
| Responsive | Kartu 1/2/3–4 kolom; kolom baca untuk case study. |

### 11.6 `/competitions`

| Aspek | Isi |
|---|---|
| Purpose | Competition Radar: database kompetisi yang aktif dan selalu diperbarui. |
| Target user | MEMBER (utama); PUBLIC ⚠. |
| Content | Competition, Organizer, Category, Deadline, Eligibility, Requirements, Status, PIC. |
| Primary action | Membuka detail + Brief. |
| Secondary action | Filter. |
| Data source | `competitions`, `competition_briefs`. |
| Visibility | Publik ⚠ (spec §11); keputusan belum final. |
| Empty | "No competitions found." |
| Auth | Tergantung keputusan visibility. |
| Responsive | Tabel di `md+`; layout bertumpuk (stacked) di mobile (design §18). |

### 11.7 `/knowledge`

| Aspek | Isi |
|---|---|
| Purpose | Knowledge Base = memory NCD. |
| Target user | PUBLIC (artikel publik), MEMBER. |
| Content | KnowledgeCard: title, category, author, updated, reading time. |
| Primary action | **Search** (interaksi utama); membaca artikel. |
| Secondary action | Filter kategori. |
| Data source | `knowledge_articles`, `knowledge_categories`. |
| Visibility | Per artikel. Default `DECISION NEEDED` (D-11 terkait; visibility knowledge masuk keputusan terbuka). |
| Empty | "No articles yet." Search tanpa hasil: sebut query, sarankan hapus filter, tawarkan browse kategori. |
| Auth | Tidak untuk artikel publik. |
| Responsive | Kolom baca 720–820px. |

### 11.8 `/transparency`

| Aspek | Isi |
|---|---|
| Purpose | Permukaan transparansi (public/member-facing sesuai keputusan visibility). |
| Target user | MEMBER; PUBLIC hanya bagian yang diputuskan. |
| Content | Potensi: informasi NCD Kas, laporan kegiatan, dokumentasi penggunaan dana jika relevan (NCD-DOC §16-A). |
| Primary action | Membaca laporan / ringkasan. |
| Data source | Database; Kas via policy khusus. |
| Visibility | **`DECISION NEEDED` (D-03).** Seluruh ledger **tidak** otomatis publik. |
| Empty | "Not available" / "Not yet documented". |
| Auth | Tergantung keputusan. |
| Responsive | Ledger: stacked rows di mobile. |

Tension yang diakui `spec.md` §7: ada `/transparency` publik dan `/app/kas` ber-akses ketat; dokumen NCD hanya menyebut kas "bisa dilihat anggota". Tidak diselesaikan di PRD.

### 11.9 `/archive`

| Aspek | Isi |
|---|---|
| Purpose | Memory NCD lintas period. |
| Target user | PUBLIC (konten publik), MEMBER. |
| Content | Per period: People, Activities, Projects, Competitions, Knowledge, Retrospectives, Achievements. |
| Primary action | Memilih period dan menelusuri isinya. |
| Data source | Semua entitas ber-`period_id`. |
| Visibility | Mengikuti visibility tiap record. |
| Empty | "No archived period yet" per period. Daftar period sederhana pada MVP; halaman arsip penuh di V1. |
| Responsive | Breadcrumb di halaman period. |

Detail di §13.10 dan §20.

---

## 12. Homepage `/`

Urutan section (spec §8.11): **Hero → Current Pulse → People → Projects → Competitions → Activities → Knowledge → Ecosystem → Footer.**

### 12.1 Hero

- Perlakuan **tipografis** (Display, hanya di sini). Memperkenalkan NCD, Growth Together, ecosystem, dan tujuan.
- Copy dari brief (design §29): **NCD — Growth Together.** *Meet people. Learn together. Build things. Compete. Document what happened. Grow from it.*
- CTA: **Explore NCD** (primary), **View Projects** (secondary).
- Bukan hero template SaaS. Tanpa stock photo manusia. Bentuk final hero (komposisi tipografis + grid, atau visual aktivitas live): `DECISION NEEDED` (DD-10).

### 12.2 Ecosystem

- Visual utama: People → Learn → Connect → Build → Compete → Document → Grow.
- Satu dari dua identitas visual utama NCD. **Jangan** menjadikan seluruh website penuh visualisasi.
- Maksimal **satu** momen animasi terorkestrasi di homepage (design §26).

### 12.3 Current Pulse

- Angka hanya ditampilkan jika **dihitung dari database** (live query).
- Contoh angka di brief ("127 members", "24 projects", "18 competitions") adalah **format**, bukan data. Dilarang ditampilkan kecuali benar-benar tersedia.
- Tanpa data: honest empty state (`Not yet documented`).
- Pada mobile: daftar vertikal.

### 12.4 Featured Content

Dapat menampilkan project, competition, knowledge, activities — **hanya jika data benar-benar tersedia dan ditandai publik**. Tidak ada kartu pengisi.

---

## 13. Modul Produk

### 13.1 About / Organization Profile (spec §8.1, F-02)

Menampilkan vision, mission, nilai, leadership, struktur, dan Growth Together.

**Values:** Growth · Collaboration · Ownership · Learning · Contribution.

Konsekuensi nilai terhadap produk (design §2):

| Nilai | Konsekuensi |
|---|---|
| Growth | Progress dibandingkan dengan titik awal sendiri, tidak pernah antar anggota. |
| Collaboration | View tim/squad menekankan grup, peran, handoff — bukan bintang individu. |
| Ownership | Setiap item menampilkan siapa yang bertanggung jawab (PIC) dan kapan terakhir diperbarui. |
| Learning | Kegagalan adalah state yang sah; ditampilkan tanpa gaya mempermalukan. |
| Contribution | Penulis terlihat pada knowledge dan project. |

Konten masih draft; jangan dinyatakan sebagai keputusan final. Deskripsi peran leadership adalah *kriteria jabatan, bukan penilaian pribadi*.

### 13.2 People & Member Profile (spec §8.2, F-05, F-06)

Field pemetaan dari NCD-DOC §12: **jurusan, angkatan, skill, minat, pengalaman, target pribadi, minat kompetisi**, plus division/role NCD.

Profil dapat berisi: Identity · Division · Major · Cohort · Skills · Interests · Experience · Projects · Competitions · Knowledge · Growth.

Tiga tingkat informasi:

| Tingkat | Isi | Status |
|---|---|---|
| **Public information** | Hanya yang disetujui untuk publik. Default konservatif: nama, jurusan, angkatan, division, skill tag yang dipilih anggota. | D-06 |
| **Member-only information** | Informasi internal (mis. pengalaman, minat kompetisi). | Pembagian per-field `DECISION NEEDED` |
| **Owner-only information** | Informasi pribadi, mis. Growth Map/target pribadi, sampai ada keputusan visibility. | D-13 |

Perilaku data:

- Anggota mengedit field profil miliknya sendiri; perubahan assignment organisasi lewat Division Lead / Leadership (spec §8.2).
- Skill: apakah self-declared atau verified `DECISION NEEDED`; vocabulary dan level `UNDEFINED` (D-19).
- Tanpa ranking, skor, badge kompetitif, atau metrik kontribusi yang dipakai membandingkan anggota.
- Foto hanya yang dibuat/disetujui anggota; avatar fallback = inisial pada permukaan netral (design §20).

### 13.3 Growth Map (spec §8.3, F-15 — V1)

**Definisi:** perkembangan seseorang **terhadap dirinya sendiri**, bukan perbandingan antar anggota.

Pertanyaan yang dijawab: *"Saya mulai dari mana, dan semester ini berkembang ke mana?"*

```
Starting Point → Semester / Period Target → Progress → Reflection
```

- Per anggota: titik awal, target semester, refleksi akhir semester.
- **Tidak ada:** ranking, leaderboard, grafik perbandingan, skor rata-rata anggota, pengurutan lintas anggota.
- Struktur "target" (teks bebas atau skill + level) `UNDEFINED`; visibilitas (pemilik + mungkin Division Lead/Leadership) `DECISION NEEDED` (D-13).
- Nasib data Growth Map setelah period berakhir (arsip, anonim, atau privat) `DECISION NEEDED` (spec §13).

### 13.4 Activities & Documentation (spec §8.4, F-10)

Timeline dokumentasi. Field minimal: **Date · Activity · Category · Participants · Documentation · Outcome.**

Kategori proposal (dari brief): **Learning · Connect · Project · Competition · Organization** — `DECISION NEEDED` (final belum; pemetaan tiap program, mis. Discover dan Demo Day, belum jelas).

Program dari dokumen NCD yang menjadi kandidat aktivitas: NCD Discover, NCD Connect, NCD Grow, Competition Day, Retrospective, Project Clinic, Demo Day, dan (opsional) NEXA Gathering (D-17).

**Activity adalah bagian dari archive:** dokumentasi mentah harus bisa dipakai kemudian sebagai arsip (§13.10). Setiap activity ber-`period_id`.

### 13.5 Projects / Project Lab (spec §8.5, F-09)

Project **bukan hanya** project kompetisi: dapat berupa portfolio, experiment, research, learning, atau competition.

**Lifecycle:** Idea → Problem → Research → Solution → Prototype → Test → Improve → Submit.

| Tampilan | Isi |
|---|---|
| **Project card** | name, description, tags, status, team, period |
| **Project detail (case study)** | Overview · Problem · Research · Solution · Build · Team · Timeline · Outcome · Retrospective |

- **Status:** vocabulary `UNDEFINED` di dokumen NCD. Proposal minimum UI (perlu konfirmasi): `Draft · In progress · Completed · Archived`. Jangan menampilkan status di luar daftar yang disetujui (D-10).
- **Visibilitas berbeda per project** berdasarkan status/kerahasiaan (mis. entri kompetisi belum disubmit). Default `DECISION NEEDED`.
- **Project Clinic** (review pra-submit; output catatan perbaikan untuk squad): apakah catatan clinic disimpan/ditampilkan di situs `DECISION NEEDED` (V1 jika disetujui).
- Konfliks tidak diselesaikan: lifecycle (alur kerja) dan status (state record) adalah dua hal berbeda.

### 13.6 Competitions (spec §8.6, F-07, F-08)

**Competition Radar** — database aktif. Field (NCD-DOC §13): **Competition (nama) · Organizer · Category (bidang) · Deadline · Eligibility · Requirements · Status · PIC.** *Organizer* dan *Requirements* wajib disimpan meski kolom daftar brief hanya subset.

**Competition Brief** — satu per kompetisi, agar NCD tidak sekadar meneruskan poster:

1. Apa kompetisinya?
2. Masalah apa yang dibawa?
3. Siapa yang cocok?
4. Apa kebutuhannya?
5. Kapan deadline-nya?
6. Seberapa tingkat kesiapannya (readiness level)?

Poster saja bukan Brief yang valid.

**Competition flow:** Find → Filter → Analyze → Team Formation → Plan → Submit → Evaluate.

**Competition detail:** Overview · Problem · Requirements · Eligibility · Timeline · Judging · Required Skills · Team · Status. (*Judging* memetakan "sistem penilaian" dalam NCD-DOC §13.)

| Hal | Status |
|---|---|
| Daftar kategori (proposal brief: All / AI / Business / Design / Programming / Research) | `DECISION NEEDED` (D-09) |
| Daftar status (kandidat: Watching · Open · In progress · Submitted · Closed) | `DECISION NEEDED` (D-09) |
| Skala readiness | `UNDEFINED` (D-09) |
| Zona waktu deadline (default usulan Asia/Jakarta) | `DECISION NEEDED` (D-21) |

Daftar di atas **bukan** vocabulary final dan tidak boleh di-hardcode seolah final.

### 13.7 Squads (spec §8.7, F-14, F-19 — V1)

| | Division | Squad |
|---|---|---|
| Sifat | Struktur organisasi **permanen** | Tim **temporer** |
| Dibentuk untuk | — | Project atau competition |
| Anggota | Satu division | Lintas division, jurusan, angkatan |

**Squad lifecycle:** Competition / Project → Squad formed → Collaboration → Evaluation → Documentation → Knowledge → **Squad archived**.

- **Squad tidak dihapus** setelah selesai; diarsipkan.
- Squad dapat terhubung ke **project tanpa competition**; model data harus memperbolehkan keduanya.
- Squad tidak dibawa ke period berikutnya (squad temporer); anggota tetap sebagai member.
- Tampilan: nama squad, competition/project terkait, status, anggota, peran, progres. Contoh peran (bukan daftar tetap): Technical, Business, Design, Presentation (D-14).
- **Dua sumbu berbeda, tidak digabung diam-diam:** *lifecycle* (status squad) dan *progress stage* (tahap kerja: Research · Problem · Prototype · Testing · Pitch · Submission · Retrospective). Cara progres diperbarui (manual vs turunan) `DECISION NEEDED` (D-14).
- **Team Formation helper:** memfilter anggota berdasarkan skill/minat untuk squad (F-19), memakai data pemetaan anggota.

### 13.8 Knowledge Base (spec §8.8, F-11)

Memory NCD. Isi yang disebut dokumen NCD: materi sharing, tutorial, insight competition, technical knowledge, proposal dan pitching knowledge, post-mortem. Brief menambah: business knowledge, design knowledge, research, hasil retrospective.

**Artikel:** Title · Category · Author · Updated Date · Reading Time · Content · Related Knowledge · Related Projects · Related Competitions.

- **Search = interaksi utama; readability = prioritas kedua.**
- Kategori (proposal brief: Technical, Competition, Business, Design, Research, General) `DECISION NEEDED` (D-11).
- Format penulisan (Markdown vs rich text) `DECISION NEEDED`; konten user disanitasi apa pun formatnya.
- Visibilitas publik vs member-only per artikel; default `DECISION NEEDED`.

### 13.9 Retrospective (spec §8.8, F-16 — V1)

Bagian penting dari **learning loop**:

```
Work → Evaluation → Retrospective → Knowledge → Future improvement
```

- Retrospective dilakukan setelah competition/project dengan **enam pertanyaan yang sama** untuk semua (NCD-DOC §13).
- **Enam pertanyaan itu `UNDEFINED`** — tidak tertulis di dokumen NCD (D-08). PRD ini **tidak mengarang** pertanyaannya.
- **Data model harus configurable** (set pertanyaan yang dapat dikonfigurasi), bukan enam kolom hardcoded.
- Hasil retrospective menjadi sumber Knowledge Base dan ikut ke Archive.
- Kegagalan ditampilkan secara faktual, tanpa styling mempermalukan.

### 13.10 Archive (spec §8.9, §13, F-17)

Archive = memory NCD lintas period.

- Period pertama: **Oktober 2026 – April 2027** (dokumen NCD), diberi label `2026/2027` oleh brief. Tanggal pasti `UNDEFINED`.
- Isi per period: **People · Activities · Projects · Competitions · Knowledge · Retrospectives · Achievements.**
- **Data historis tidak hilang ketika period berubah.**
- **Achievement:** definisi `DECISION NEEDED` (D-15). Dokumen NCD menekankan *"Kemenangan bukan satu-satunya ukuran"* — achievement bisa berupa milestone proses, bukan hanya kemenangan. **Tidak ada achievement palsu.**
- Istilah UI: "semester" vs "periode/kepengurusan" `DECISION NEEDED` (D-16). Spec memakai **period** sebagai istilah netral.

### 13.11 Transparency (spec §7, §8.10)

Lihat §11.8. Intinya: permukaan transparansi sesuai keputusan visibility; visibility Kas **`DECISION NEEDED`**; ledger penuh **tidak** otomatis publik.

### 13.12 NCD Kas (spec §8.10, F-12, F-13)

**Kas bukan payment gateway. Kas adalah ledger.** Definisi dokumen NCD: *dana bersama + sistem pencatatan yang transparan.*

**Flow:** Dana masuk → Dicatat → Dana dipakai → Dicatat → Saldo diperbarui → Bisa dilihat anggota.

**Field (hanya ini):** Tanggal · Keterangan · Pemasukan · Pengeluaran · Saldo.

| Aturan | Rincian |
|---|---|
| Balance dihitung | Saldo berjalan **dihitung**; user tidak boleh mengetik saldo manual. |
| Tanpa data palsu | Tidak ada fake balance, fake transaction, fake target, fake iuran. |
| Iuran & target | **Tidak ditentukan** ("Nominal iuran dan target saldo belum ditentukan"). Tampil `Not available`; tidak ada nominal, target, atau default (D-18). |
| Sumber data | Database saja. Saldo tidak tersedia → `Not available`, bukan `Rp 0` (kecuali benar-benar nol). |
| Penulis entri | **Tidak ada peran bendahara** di dokumen NCD. Siapa yang boleh menulis `DECISION NEEDED` (D-03). |
| Integritas entri | Usulan (belum disetujui): append-only; koreksi lewat entri penyesuaian; audit log (D-18). |
| Lampiran bukti | Opsional; penyimpanan dan visibilitas `DECISION NEEDED`. |
| Akses | Paling ketat: RLS terpisah baca/tulis; write server-side dengan validasi. Admin boleh baca Kas atau tidak: keputusan sendiri. |
| UI | Polos: tanpa chart, gradient, animasi, UI perayaan; warna hanya pada angka bertanda `+`/`−`. Tidak ada optimistic UI untuk Kas. |

Penyimpanan uang memakai integer minor units atau `numeric`, tidak pernah floating-point (agents §6.4).

---

## 14. Authentication

Menggunakan **Supabase Auth**. Tidak ada custom password storage.

| Alur | Status | Sumber |
|---|---|---|
| Login (email + password) | MVP | spec F-04, §8.12 |
| Logout | MVP | spec F-04 |
| Forgot / reset password | MVP | spec F-04, §8.12 |
| Session & protected routes (`/app`, `/admin`) | MVP | spec F-04 |
| Magic link | **DECISION NEEDED** (D-20) — "jika diperlukan" | spec §8.12 |
| **Register** | **DECISION NEEDED** — kebijakan sign-up `UNDEFINED` (D-05) | spec §8.12 |

**Register — ditandai, bukan diasumsikan.** Brief PRD meminta alur Register (Full Name, Email, Password, Confirm Password). `spec.md` tidak memasukkan Register dalam F-04 dan menyatakan siapa yang boleh mendaftar `UNDEFINED`; usulan default spec: **invite-only / admin-approved**, sign-up terbuka tidak diasumsikan. Jika Register diadopsi, field di atas adalah titik awal. Implementasi aktual: **Unable to verify** (repositori tidak tersedia, lihat §35).

Perilaku wajib:

- Proteksi route di **server**, bukan hanya redirect client (agents §7).
- Field password mengizinkan paste dan password manager (design §28, WCAG 3.3.8).
- Error form diumumkan ke teknologi bantu (`role="alert"` / `aria-live`).
- `/app/*` dan `/admin/*`: `noindex` + disallow di robots.
- Role tidak pernah dibaca dari input client.

---

## 15. Authenticated App (`/app`)

Persisten **sidebar + main content**; di bawah `lg` sidebar menjadi sheet.

```
/app
├── dashboard   ├── activities    ├── knowledge
├── people      ├── projects      ├── growth
├── squads      ├── competitions  ├── documentation
                                  └── kas
```

**Tidak semua route muncul sebagai navigasi top-level.** Navigasi authenticated: **Overview · People · Projects · Competitions · Knowledge · Activities · Transparency**. Squads, Growth, Documentation, dan Kas dijangkau lewat Overview, contextual navigation, dan command/search; penempatan akhir `DECISION NEEDED` (DD-09, spec §7).

### 15.1 Dashboard / Overview `/app/dashboard`

Operational overview — **bukan** dashboard analytics perusahaan. Member melihat:

- aktivitas relevan
- project
- competition
- konteks squad (V1)
- knowledge
- growth milik sendiri (V1)
- transparency sesuai permission

Aturan: **data nyata**; tidak ada KPI palsu; tanpa target/kuota/persentase progress-to-goal (spec §17); tanpa perbandingan antar anggota. Dashboard ada di MVP (spec §14: Auth + `/app/dashboard`).

### 15.2 Perilaku modul di dalam app

| Modul | Perilaku tambahan dibanding publik |
|---|---|
| People | Field member-only terlihat; edit profil sendiri. |
| Projects | Termasuk project internal; PIC/Division Lead dapat menulis sesuai scope. |
| Competitions | Radar + Brief lengkap; PIC kompetisi dapat menulis. |
| Squads (V1) | Daftar & detail squad; team formation. |
| Growth (V1) | Hanya pemilik (dan akses lain setelah D-13). |
| Documentation | Rekaman mentah dan dokumen (library `documents`/`media_assets` di V1, F-23). |
| Kas | Baca untuk member sesuai keputusan; tulis hanya peran yang diizinkan. |

---

## 16. Admin (`/admin`)

Shell terpisah untuk **system management**:

```
/admin
├── overview   ├── projects      ├── documentation
├── members    ├── competitions  ├── kas
├── activities ├── knowledge     ├── media
                                 └── settings
```

- Admin ≠ Leadership; tidak otomatis sama (D-04).
- Dibedakan oleh label konteks "Admin" yang persisten, bukan palet berbeda (design §13).
- Admin minimal di MVP (members, konten, media — spec F-18); lebih kaya di V1.
- Perubahan role dan konfigurasi sensitif dilakukan server-side dan dicatat.
- Apakah Admin boleh membaca Kas adalah keputusan tersendiri.

---

## 17. Navigation Model

Sumber: spec §7, design §14. Navigasi mengikuti hierarki informasi; **tidak pernah menampilkan semua halaman sekaligus**.

| Konteks | Item |
|---|---|
| **Public** | Wordmark `NCD` · **People · Projects · Competitions · Knowledge · Activities** · di kanan: **About · Login** |
| **Authenticated** | **Overview · People · Projects · Competitions · Knowledge · Activities · Transparency** |
| **Admin** | **Overview · Members · Activities · Projects · Competitions · Knowledge · Documentation · Kas · Media · Settings** |

**Mobile:**

- Top bar ringkas: wordmark + search + menu.
- Menu membuka drawer/sheet terkelompok (maks ~7 item top-level).
- Bottom navigation hanya untuk app terautentikasi jika cocok, maksimal 4–5 tujuan (DD-08).
- **Tidak** ada hamburger raksasa berisi seluruh sitemap.

**State dan aksesibilitas:** active = indikator aksen + `aria-current="page"`; hover = surface-hover; fokus terlihat; skip-to-content sebagai elemen fokus pertama. Breadcrumb di halaman dalam (Competition detail, Project detail, artikel Knowledge, period Archive). Item navigasi disimpan di `config/` (agents §4).

Nama NCD tidak diganti di UI: Competition Radar, Competition Brief, Project Lab, Project Clinic, Competition Day, Retrospective, Growth Map, Knowledge Base, NCD Kas, Squad, PIC (design §29).

---

## 18. Search

Search adalah bagian penting website.

| Tahap | Cakupan | Status |
|---|---|---|
| **MVP** | Search di Knowledge Base (interaksi utama). | spec F-11 |
| **V1** | Command palette `Ctrl/⌘ + K` untuk mencari dan melompat ke destinasi; `/` memfokuskan search; `Esc` menutup overlay. | spec F-22, design §14 |
| **Target jangkauan** | knowledge, projects, competitions, people, activities. | Cakupan lintas-modul penuh = target V1; tidak diklaim ada di MVP. |

- Search tanpa hasil: menyebut query, menyarankan hapus filter, menawarkan browse kategori (design §23).
- Hasil diumumkan dengan sopan ke teknologi bantu (`aria-live="polite"`).
- Hasil search menghormati permission; record yang tidak boleh dilihat user tidak muncul.
- Pintasan keyboard tidak menimpa default browser/OS dan dapat ditemukan lewat tooltip.

Squads, Growth, Documentation, dan Kas dijangkau juga lewat command search (spec §7); karena itu fitur ini juga terkait keputusan DD-09.

---

## 19. Data Behavior

Entitas (spec §10): `profiles, members, divisions, roles, skills, member_skills, activities, activity_members, projects, project_members, project_tags, competitions, competition_briefs, competition_squads, squad_members, knowledge_articles, knowledge_categories, retrospectives, kas_accounts, kas_transactions, documents, media_assets, periods`.

**Prinsip perilaku data** (tanpa memfinalkan skema, sesuai spec §10 dan agents §6.1):

1. **Relasional dan terstruktur.** Detail yang belum didefinisikan ditandai `TODO` / `DECISION NEEDED`, bukan dikarang.
2. **Period-bound.** Semua record yang berubah antar waktu (role anggota, activities, projects, competitions, squads, retrospectives, kas entries) milik sebuah `period` (`period_id`).
3. **Tidak ada hard delete data historis.** Gunakan arsip / soft-delete.
4. **Ownership.** Tiap record menyimpan `created_by` dan (bila relevan) PIC penanggung jawab; tiap tipe konten menunjukkan pemilik dan timestamp terakhir diperbarui.
5. **Timestamp** disimpan UTC, ditampilkan sesuai keputusan zona waktu (D-21).
6. **Vocabulary yang belum final tidak di-hardcode** (status, kategori, skill, role, iuran, target).
7. **Retrospective configurable.**
8. **Roles = assignment ber-scope.**
9. **Kas:** saldo dihitung; entri append-only (usulan); write server-side.
10. **Mata uang:** format `id-ID`, `Rp 1.250.000`, mono/tabular.

**Alur data utama**

| Alur | Perilaku |
|---|---|
| Konten publik | DB → server query dengan RLS → halaman publik. Hanya record bertanda publik. |
| Konten member | Sesi → role & assignment dari DB → RLS + guard server → halaman `/app`. |
| Current Pulse | Query live; nol → state nol/honest empty. |
| Kas | Write hanya server-side oleh peran berwenang → saldo dihitung → read sesuai permission. |
| Profil | Pemilik mengedit field miliknya; assignment organisasi lewat Division Lead/Leadership. |
| Period change | Period baru + assignment baru; record lama tetap terhubung ke period lamanya. |

**Analytics** (spec §17): hanya dari record nyata, tanpa angka target, tanpa leaderboard; analytics produk (page views, dst.) `DECISION NEEDED` (D-22); default **tidak ada** sampai diputuskan. Skrip pihak ketiga/analytics adalah area terlindungi (agents §10).

---

## 20. Period & Handover

Website dirancang agar **bertahan melewati satu period**.

```
Period lama → Archive → Knowledge → Documentation → Leadership baru
```

**Siklus period (spec §13):**

1. Period dibuat oleh Leadership.
2. Semua record ber-period menempel padanya.
3. Di akhir period (fase akhir: Retrospective, Portfolio project, Laporan kegiatan, Evaluasi growth, Dokumentasi semester, Knowledge handover — NCD-DOC §23) Leadership menandai period **closed**: read-mostly, tetap dapat dibaca selamanya.
4. Period baru dimulai dengan assignment kepemimpinannya sendiri; anggota berlanjut sebagai member; squad tidak ikut berpindah.
5. Halaman Archive menampilkan People, Activities, Projects, Competitions, Knowledge, Retrospectives, Achievements per period.

**Period change = New Period + New Role Assignments + Historical Records Preserved.**

`DECISION NEEDED`: apa persisnya yang dihasilkan "handover" di situs (checklist? dokumen?) dan nasib data Growth Map personal setelah period (arsip/anonim/privat).

---

## 21. User Flows

### 21.1 Visitor discovers NCD
```
Home → Ecosystem → People / Projects / Competitions / Knowledge → Content detail
```
Pengalaman publik; hanya konten publik. Jika konten belum ada, tampil honest empty state, bukan data pengisi.

### 21.2 Member discovers competition
```
Login → Overview → Competitions → Filter → Competition detail
      → Competition Brief → Team formation → Squad
```
Squad dan Team Formation adalah V1; sebelum itu, alur berakhir di Competition Brief.

### 21.3 Member builds project
```
Idea → Project → Research → Prototype → Testing → Improvement
     → Outcome → Retrospective → Knowledge
```
Retrospective dan penautan ke Knowledge adalah V1.

### 21.4 Member growth
```
Starting Point → Target → Work → Reflection
```
Hanya terhadap diri sendiri; V1.

### 21.5 Period handover
```
Current Period → Documentation → Archive → New Leadership → Historical Context
```
Halaman Archive penuh adalah V1; MVP hanya daftar period sederhana (spec §14).

### 21.6 Unauthorized access (alur kontrol)
```
Request resource authenticated-only → Server memeriksa sesi dan role
   → tanpa sesi: redirect login | sesi ada tapi tidak berhak: permission-denied state
```
Kebijakan akhir (redirect vs deny vs tampil terkunci) mengikuti keputusan role visibility yang masih terbuka; lihat §22.

---

## 22. Empty / Loading / Error / Permission States

Setiap halaman data-driven wajib memiliki: **loading, empty, error, partial, populated, permission-denied, not-found** (spec §12).

| State | Aturan | Contoh |
|---|---|---|
| **Loading** | Skeleton yang meniru layout (tinggi, kolom, radius sama); bukan spinner satu halaman; Suspense per section; tanpa layout shift. | — |
| **Empty** | Informatif; judul (apa yang kosong) → satu kalimat (apa yang akan muncul) → aksi **hanya jika viewer berhak**. Tanpa wajah sedih/lelucon/permintaan maaf. | **No projects yet.** Projects created by NCD will appear here. |
| **Error** | Jelas, singkat, tidak menyalahkan, ada recovery. | **Something went wrong.** We couldn't load the projects. [Try again] |
| **Not available** | Field/section tertentu. | `Not available` · `Not yet documented` · `Coming soon` |
| **Permission denied** | Menjelaskan bahwa user tidak punya akses dan cara memperolehnya bila diketahui (mis. "Ask a Division Lead"); tidak membocorkan keberadaan konten lebih dari perlu. Apakah item terbatas disembunyikan atau tampil terkunci: `DECISION NEEDED`. | — |
| **404 / 500** | 404 menyebut halaman tidak ditemukan dan menautkan tujuan wajar; 500 mempertahankan shell, menawarkan "Try again" dan "Go home". | — |

Empty state wajib per modul: People, Projects, Competitions, Squads, Knowledge, Activities, Archive (per period), Kas (belum ada entri; saldo `Not available`, bukan `Rp 0` kecuali memang nol), dan search no-results.

**Tidak boleh menampilkan data palsu agar halaman terlihat penuh.**

---

## 23. Design Requirements

PRD **tidak membuat design system baru**. Semua visual mengikuti **`design.md`**.

Karakter: **dark-first, calm, precise, human, ambitious**, aksen terkendali.

Larangan (design §31): tanpa glassmorphism, tanpa gradient wash, tanpa dashboard neon, tanpa "pill-everything", tanpa estetika SaaS generik, tanpa estetika organisasi dengan stock photo.

Dua identitas visual utama: **(1) hero tipografis** dan **(2) visualisasi ecosystem**. Sisa situs dibuat tenang agar keduanya membawa identitas.

| Hal | Rujukan |
|---|---|
| Warna, surface, aksen, semantic | `design.md` §3, §4 |
| Tipografi, skala, mono | `design.md` §5–§7 |
| Spacing, radius, border, shadow | `design.md` §8–§11 |
| Grid, layout, breakpoint | `design.md` §12–§13 |
| Navigasi | `design.md` §14 |
| Komponen (button, input, card, tabel, badge, avatar, modal, drawer) | `design.md` §15–§22, §30 |
| States | `design.md` §23–§25 |
| Motion | `design.md` §26 |
| Aksesibilitas, konten | `design.md` §28, §29 |

Keputusan desain terbuka (DD-01 s.d. DD-10, mis. light theme, warna muted, bahasa UI, bottom nav, hero visual) tetap terbuka (`design.md` §32).

Catatan: acceptance criteria PRD ini tidak berbicara tentang warna/visual; verifikasi visual mengikuti `design.md` dan checklist `agents.md` §11.

---

## 24. Responsive

Lebar uji wajib: **375 · 390 · 430 · 768 · 1024 · 1280 · 1440** (design §13). Mobile **bukan** desktop yang diperkecil: pertimbangkan ulang urutan konten, kepadatan, dan navigasi per breakpoint (design §27).

| Experience | Perilaku |
|---|---|
| **Public** | Top nav → compact top bar + drawer di mobile. Homepage: hero tipografis di semua ukuran; Pulse jadi daftar vertikal; Ecosystem vertikal di mobile. Kartu 1/2/3–4 kolom. Kolom baca 720–820px. |
| **Authenticated** | Sidebar → sheet di bawah `lg`; bottom navigation opsional 4–5 tujuan (DD-08). Tabel pakai strategi per-tabel; Radar dan Activities **stacked** di mobile. Filter di sheet. |
| **Admin** | Shell terpisah dengan nav sendiri; sidebar → sheet di bawah `lg`; tabel padat memakai scroll horizontal berbingkai atau prioritas kolom (strategi dicatat per tabel); aksi destruktif/Kas memakai dialog konfirmasi (bottom sheet di mobile). |

Umum: touch target ≥ 44px; form satu kolom dengan label di atas input; modal → bottom sheet di mobile; hormati safe area; uji zoom 200% dan reflow 320 CSS px; tidak memaksa 8 kolom pada 390px. Ledger Kas di mobile: baris bertumpuk (tanggal+keterangan di atas, nominal bertanda dan saldo di bawah).

---

## 25. Accessibility

Target **WCAG 2.2 AA** (design §28). Minimal:

- HTML semantik (landmark, heading nyata, tabel/list/button yang benar)
- navigasi keyboard penuh, tanpa keyboard trap
- fokus terlihat (ring 2px lavender, offset 2px)
- `aria-current` pada navigasi aktif; `aria-sort` pada tabel yang dapat diurutkan
- skip-to-content
- label form yang dapat diakses (tidak hanya placeholder)
- error form yang dapat diakses (teks + ikon + `role="alert"`/`aria-live`)
- kontras cukup — dengan pembatasan token (`--text-muted`, violet, electric-as-text) di `design.md` §3
- status tidak dibedakan hanya dengan warna
- reduced motion (`prefers-reduced-motion: reduce`)
- `lang` per halaman; teks bercampur bahasa ditandai
- alternatif untuk interaksi drag

Hierarki: jika sebuah ide visual bertentangan dengan AA, ide visualnya yang berubah.

---

## 26. Data Integrity

Prinsip terkunci: **Real data or honest empty state.**

Dilarang (agents §2, §8):

- jumlah anggota palsu
- jumlah project palsu
- jumlah competition palsu
- angka keuangan palsu
- achievement palsu
- testimonial palsu
- organisasi / partner palsu
- kutipan palsu
- "lorem ipsum" pada apa pun yang bisa dirilis
- seed/demo data yang tampak nyata di produksi

Jika belum ada: `Not available` · `Not yet documented` · `Coming soon`.

Fixture untuk pengembangan harus jelas palsu (mis. `Test Member 01`, nominal bertanda `TEST`), hanya di dev/test, dikecualikan dari build/seed produksi.

Yang **boleh** dipakai sebagai konten setelah konfirmasi pimpinan: visi, misi (usulan), lima nilai, nama dan peran leadership, tiga division, program, support system, bulan roadmap — semuanya masih draft.

---

## 27. Security & Privacy

Sumber: spec §19, agents §6–§7.

| Kontrol | Aturan |
|---|---|
| Authentication | Supabase Auth; tanpa custom password storage. |
| RLS | Aktif untuk semua tabel non-publik; Kas dengan policy khusus minimal; setiap policy punya cek untuk kasus diizinkan **dan** ditolak. |
| Otorisasi | Server-side; role dari DB; deny by default. |
| Service role | `SUPABASE_SERVICE_ROLE_KEY` tidak pernah di client, `NEXT_PUBLIC_*`, log, atau error message. Tidak dipakai untuk "menembus" policy yang gagal. |
| Secrets | Tidak di Git; environment variables; `.env.example` hanya berisi nama placeholder. |
| Validasi | Semua input divalidasi di server. |
| Konten user | Disanitasi sebelum disimpan/dirender; tanpa `dangerouslySetInnerHTML` pada input tidak tersanitasi. |
| Storage | Private by default; publik hanya untuk aset yang ditandai publik. |
| Route terlindungi | `/app` dan `/admin` dicek di server. |
| Indexing | `noindex` + robots disallow untuk `/app/*` dan `/admin/*`; Kas dan Growth tidak pernah diindeks; People default `noindex` sampai ada keputusan. |
| Data pribadi | Minimalkan: hanya field yang tercantum di dokumen NCD; target pribadi privat secara default; foto/jurusan/skill butuh consent sebelum tampil publik (D-06, mekanisme consent `DECISION NEEDED`). |
| Audit | Log untuk write Kas, perubahan role, perubahan status publikasi (usulan; `DECISION NEEDED`). |
| Sensitive ops | Perubahan role, write Kas, publikasi, penghapusan: hanya server-side. |

Jika menemukan kerentanan atau secret bocor: berhenti dan laporkan (agents §7).

---

## 28. Content & Voice

Copy website: **singkat, langsung, manusiawi, percaya diri, spesifik** (design §29).

Hindari: jargon korporat, copy startup generik, kalimat inspirasional palsu, marketing berlebihan, filler ala LinkedIn; kata seperti *empower, unlock, leverage, synergy, next generation*.

| Hindari | Pakai |
|---|---|
| *Empowering the next generation of innovators.* | *People building things together.* |
| *Unlock your limitless potential.* | *Learn something. Build something. Share what you learned.* |

Website harus terdengar seperti NCD, bukan seperti AI yang baru menemukan kata "ecosystem".

Aturan tambahan: sentence case; satu istilah per konsep; error menjelaskan apa yang terjadi dan apa yang bisa dilakukan; empty state menjelaskan apa yang akan muncul dan siapa yang bisa menambah; tulisan tentang orang tanpa bahasa peringkat atau evaluasi pribadi. Bahasa UI (EN / ID / dwibahasa) `DECISION NEEDED` (D-07); sementara itu string UI disimpan di satu modul konten/config agar dapat diterjemahkan tanpa redesign.

---

## 29. Scope: MVP, V1, Future

**Kepatuhan pada `spec.md` §14–§16.** Brief PRD mengusulkan pembagian P0/P1/P2 yang sedikit berbeda dari `spec.md` (lihat §37). Sesuai instruksi ("jika `spec.md` memiliki MVP definition yang lebih spesifik, ikuti `spec.md`"), tabel ini mengikuti `spec.md`.

### P0 — MVP (spec §14)

| Fitur | ID spec |
|---|---|
| Home (hero, ecosystem, link ke modul) | F-01 |
| About | F-02 |
| Navigasi public + authenticated | F-03 |
| Authentication: login, logout, reset password; route `/app` & `/admin` terlindungi | F-04 |
| People: profil anggota dengan field pemetaan (subject to consent) | F-05 |
| Division & role display | F-06 |
| Competitions: Radar list + filter + detail | F-07 |
| Competition Brief | F-08 |
| Projects: list + case-study detail | F-09 |
| Activities: timeline dengan kategori | F-10 |
| Knowledge: list, detail, search, kategori | F-11 |
| Authenticated Overview `/app/dashboard` | spec §14 |
| NCD Kas: read untuk member berizin | F-12 |
| NCD Kas: write untuk peran berwenang | F-13 |
| Admin minimal (members, konten, media) | F-18 |
| Quality bar: aksesibilitas, responsif, SEO halaman publik, RLS tabel sensitif | spec §14 |

Catatan: Kas (F-12/F-13) ada di MVP menurut spec, namun tertahan oleh keputusan **D-03** (visibility dan penulis); implementasi tidak boleh dimulai sebelum diputuskan (agents §9, §10).

### P1 — V1 (spec §15)

Squads + Team Formation helper (F-14, F-19) · Growth Map (F-15) · Retrospective capture feeding Knowledge (F-16) · Archive per period (F-17; MVP hanya daftar period sederhana) · media/document library (F-23) · command palette (F-22) · admin lebih kaya · Project Clinic notes (jika disetujui).

### P2 — Future (spec §16)

Monitoring view Wakil (F-20, D-25) · Demo Day showcase (F-21, D-17) · handover tooling · analytics multi-period · notifikasi · integrasi dengan alat yang benar-benar dipakai NCD (`UNDEFINED`) · halaman tambahan skala NEXA jika NEXA ingin situs bersama.

Fitur lain hanya setelah kebutuhan tervalidasi. Status fitur tidak diubah dari penentuan `spec.md`.

---

## 30. Roadmap

Roadmap organisasi (NCD-DOC; spec Appendix A) — tanggal pasti belum ditetapkan:

| Bulan | Fokus NCD | Implikasi untuk website (spec §14) |
|---|---|---|
| Okt 2026 | Foundation | "Mulai website structure" |
| Nov 2026 | Connection & Learning | People, Knowledge mulai terisi |
| Des 2026 | Build | Projects & Activities |
| Jan 2027 | Compete | Competitions (Radar + Brief) |
| Feb 2027 | Improve | — |
| Mar 2027 | Reflect | Retrospective |
| Apr 2027 | Cadangan (reserve) | Archive / handover |

Dokumen NCD menggambarkan website tumbuh bersama semester: awal = struktur; tengah = menampilkan activity dan project; akhir = "Website jadi arsip periode." Karena itu MVP menargetkan kebutuhan **awal-tengah** (identitas, people, competitions, activities, projects, kas, knowledge), bukan penutup arsip. Pemetaan bulan ke fase rilis (MVP/V1/Future) **tidak ditentukan** oleh sumber dan tidak diklaim di sini; tanggal rilis `UNDEFINED`.

---

## 31. Success Criteria

Website berhasil jika:

1. Visitor memahami NCD dalam beberapa menit.
2. Member dapat menemukan orang berdasarkan konteks yang relevan.
3. Project dapat didokumentasikan sebagai case study.
4. Competition dapat dikelola sebagai informasi terstruktur.
5. Knowledge dapat ditemukan kembali.
6. Activities menjadi historical record.
7. Growth tidak berubah menjadi ranking.
8. Informasi keuangan tidak dibuat-buat.
9. Period historis tidak hilang.
10. Website tetap berguna ketika kepengurusan berganti.
11. UI terasa seperti serious digital product, bukan template organisasi mahasiswa.
12. Sistem tetap sederhana sesuai scope organisasi mahasiswa.

**Catatan:** **tidak ada target angka** (mis. jumlah anggota terpetakan, jumlah artikel). Dokumen NCD: *"Belum ada angka target karena belum ada data kapasitas anggota."* Kriteria di atas bersifat kualitatif dan diverifikasi lewat acceptance criteria di §32. Kemampuan ukur dari data nyata mengikuti spec §17 dan tidak pernah menjadi leaderboard.

---

## 32. Acceptance Criteria

Format Given / When / Then. Tidak ada kriteria yang hanya membahas warna/visual. Fitur V1 ditandai.

### AC-AUTH — Authentication

- **Given** pengguna terdaftar memiliki kredensial valid, **When** mereka mengirim form login, **Then** Supabase Auth mengautentikasi pengguna dan aplikasi membentuk sesi yang benar.
- **Given** kredensial tidak valid, **When** form login dikirim, **Then** pesan error yang dapat diakses ditampilkan, input pengguna dipertahankan, dan tidak ada sesi dibuat.
- **Given** pengguna lupa password, **When** mereka meminta reset, **Then** alur reset Supabase Auth dijalankan tanpa penyimpanan password custom.
- **Given** pengguna login, **When** mereka logout, **Then** sesi berakhir dan route terproteksi tidak lagi dapat diakses.
- **Given** kebijakan sign-up belum diputuskan (D-05), **When** fitur registrasi dibangun, **Then** perilakunya mengikuti keputusan tersebut dan tidak mengasumsikan sign-up terbuka.

### AC-AUTHZ — Unauthorized access & role

- **Given** visitor tidak terautentikasi, **When** mereka meminta resource khusus-autentikasi (`/app/*`, `/admin/*`), **Then** server menolak akses atau mengalihkan sesuai kebijakan auth aplikasi, dan konten tidak pernah dikirim ke klien.
- **Given** pengguna dengan role MEMBER, **When** mereka mengakses route `/admin`, **Then** akses ditolak di server dan state permission-denied ditampilkan.
- **Given** klien mengirim klaim role di header/cookie/form/query, **When** server memproses permintaan, **Then** klaim itu diabaikan dan role diambil dari database.
- **Given** pengguna memiliki beberapa assignment (mis. MEMBER + PIC), **When** mereka mengubah item di luar scope PIC-nya, **Then** operasi ditolak oleh RLS dan guard server.
- **Given** halaman `/app/*` atau `/admin/*`, **When** mesin pencari merayapi situs, **Then** halaman ber-`noindex` dan tidak diizinkan oleh robots.

### AC-HOME — Home

- **Given** visitor membuka `/`, **When** halaman dimuat, **Then** hero tipografis, ecosystem (sebagai ordered list yang dapat diakses), dan CTA "Explore NCD" / "View Projects" tersedia.
- **Given** database memiliki project publik, **When** Current Pulse ditampilkan, **Then** setiap angka berasal dari query langsung ke database.
- **Given** tidak ada data untuk sebuah metrik, **When** Current Pulse dirender, **Then** honest empty state ditampilkan dan tidak ada angka karangan.

### AC-ABOUT — About

- **Given** visitor membuka `/about`, **When** halaman dimuat, **Then** visi, misi, lima nilai, leadership, dan struktur ditampilkan, dengan misi dan konten yang belum dikonfirmasi tidak dinyatakan sebagai keputusan final.

### AC-PEOPLE — People & Profile

- **Given** visitor membuka halaman People, **When** visibilitas publik anggota diaktifkan, **Then** visitor hanya melihat field yang disetujui untuk publik.
- **Given** visibilitas publik People belum diputuskan/diaktifkan, **When** visitor membuka `/people`, **Then** data anggota tidak dikirim dan state yang sesuai ditampilkan.
- **Given** anggota login, **When** mereka melihat profil anggota lain, **Then** field member-only terlihat, field owner-only tidak.
- **Given** anggota membuka profil sendiri, **When** mereka mengedit field miliknya, **Then** perubahan disimpan dan hanya pemilik (atau role berwenang untuk assignment) yang dapat mengubahnya.
- **Given** halaman People atau Profil apa pun, **When** dirender, **Then** tidak ada ranking, skor, "Top", "Most active", atau metrik pembanding antar anggota.

### AC-GROWTH — Growth Map (V1)

- **Given** anggota membuka Growth Map miliknya, **When** halaman dimuat, **Then** ia melihat Starting Point, Target, Progress, dan Reflection miliknya sendiri.
- **Given** anggota lain tanpa hak akses yang diputuskan, **When** mereka mencoba membuka Growth Map orang lain, **Then** akses ditolak server-side.
- **Given** halaman Growth atau agregat mana pun, **When** dirender, **Then** tidak ada grafik perbandingan, rata-rata, atau pengurutan lintas anggota.

### AC-ACT — Activities

- **Given** aktivitas bertanda publik, **When** visitor membuka `/activities`, **Then** mereka melihat Date, Activity, Category, Participants, Documentation, Outcome untuk aktivitas tersebut.
- **Given** aktivitas dibuat, **When** disimpan, **Then** ia terhubung ke sebuah `period` dan dapat muncul di Archive period tersebut.
- **Given** belum ada aktivitas, **When** halaman dibuka, **Then** empty state informatif ditampilkan dan CTA "create" hanya muncul bagi viewer yang berhak.

### AC-PROJ — Projects

- **Given** project bertanda publik, **When** visitor membuka daftar Projects, **Then** kartu menampilkan name, description, tags, status, team, period.
- **Given** project berstatus rahasia/internal, **When** visitor (PUBLIC) meminta project itu, **Then** server tidak mengembalikannya.
- **Given** pengguna membuka detail project, **When** halaman dimuat, **Then** bagian Overview, Problem, Research, Solution, Build, Team, Timeline, Outcome, Retrospective tersedia (bagian kosong memakai `Not yet documented`).
- **Given** status project di luar daftar yang disetujui, **When** UI dirender, **Then** status tersebut tidak ditampilkan sebagai opsi sah.

### AC-COMP — Competitions

- **Given** PIC kompetisi atau Division Lead Competition & Strategy, **When** mereka membuat entri Radar, **Then** field nama, penyelenggara, bidang, deadline, eligibility, requirement, status, dan PIC dapat disimpan.
- **Given** sebuah kompetisi, **When** brief dibuat, **Then** brief mencakup kompetisinya apa, masalah, siapa yang cocok, kebutuhan, deadline, dan tingkat kesiapan; poster saja tidak dianggap brief.
- **Given** member membuka Radar, **When** memfilter berdasarkan kategori, **Then** daftar menyempit sesuai filter dan state "No competitions found" muncul jika kosong.
- **Given** viewport mobile, **When** Radar dirender, **Then** informasi tetap lengkap dalam layout bertumpuk tanpa memaksa semua kolom.
- **Given** member tanpa assignment PIC pada sebuah kompetisi, **When** mereka mencoba mengubahnya, **Then** operasi ditolak server-side.

### AC-SQUAD — Squads (V1)

- **Given** sebuah squad selesai, **When** period berjalan, **Then** squad diarsipkan dan tidak dihapus.
- **Given** squad dibuat untuk project tanpa competition, **When** disimpan, **Then** data model menerimanya.
- **Given** period baru dimulai, **When** assignment diatur ulang, **Then** squad lama tetap tercatat pada period sebelumnya dan tidak dibawa ke period baru.

### AC-KNOW — Knowledge

- **Given** member mengetik query di Knowledge, **When** mencari, **Then** hasil ditampilkan sesuai permission pengguna dan diumumkan ke teknologi bantu.
- **Given** query tanpa hasil, **When** halaman dirender, **Then** state menyebut query dan menawarkan hapus filter / browse kategori.
- **Given** artikel internal, **When** visitor PUBLIC memintanya, **Then** server tidak mengembalikannya.
- **Given** artikel dirender, **When** konten pengguna mengandung markup, **Then** konten disanitasi sebelum ditampilkan.

### AC-RETRO — Retrospective (V1)

- **Given** set pertanyaan retrospective dikonfigurasi, **When** retrospective diisi, **Then** jawaban tersimpan terhadap pertanyaan terkonfigurasi (bukan kolom hardcoded).
- **Given** pertanyaan belum didefinisikan (D-08), **When** fitur dibangun, **Then** tidak ada pertanyaan karangan yang di-hardcode.
- **Given** retrospective selesai, **When** disimpan, **Then** ia dapat ditautkan ke Knowledge dan ikut ke Archive period.

### AC-ARCH — Archive & Period

- **Given** period ditutup, **When** period baru dibuat, **Then** semua record period lama tetap ada dan dapat dibaca.
- **Given** pengguna membuka Archive sebuah period, **When** halaman dimuat, **Then** People, Activities, Projects, Competitions, Knowledge, Retrospectives, Achievements untuk period itu tersedia sesuai visibility.
- **Given** data historis, **When** operasi hapus dipicu, **Then** record diarsipkan/soft-delete, bukan dihapus permanen.
- **Given** belum ada achievement yang terdokumentasi, **When** Archive dirender, **Then** tidak ada achievement karangan; honest empty state ditampilkan.

### AC-TRANS — Transparency

- **Given** visibility Kas belum diputuskan (D-03), **When** visitor PUBLIC membuka `/transparency`, **Then** data ledger tidak ditampilkan.
- **Given** keputusan visibility telah ditetapkan, **When** halaman dimuat, **Then** hanya konten yang diizinkan oleh keputusan itu yang ditampilkan.

### AC-KAS — NCD Kas

- **Given** member tidak memiliki izin tulis, **When** mereka mencoba membuat transaksi Kas, **Then** operasi ditolak server-side dan tidak ada transaksi yang dibuat.
- **Given** peran berwenang membuat entri, **When** disimpan, **Then** server memvalidasi input dan saldo dihitung oleh sistem, bukan diketik pengguna.
- **Given** entri sudah dicatat, **When** koreksi diperlukan, **Then** koreksi dilakukan lewat entri penyesuaian dan tidak mengubah/menghapus entri asli (jika kebijakan append-only disetujui).
- **Given** belum ada entri atau saldo tidak diketahui, **When** halaman Kas dirender, **Then** empty state dan `Not available` ditampilkan, bukan `Rp 0` atau angka karangan.
- **Given** nominal iuran/target saldo belum ditetapkan, **When** halaman Kas dirender, **Then** keduanya tidak ditampilkan.

### AC-ADMIN — Admin

- **Given** pengguna tanpa peran yang diizinkan mengakses Admin, **When** mereka membuka `/admin/*`, **Then** akses ditolak server-side.
- **Given** perubahan role dilakukan, **When** disimpan, **Then** perubahan hanya dapat dilakukan oleh peran berwenang secara server-side dan tercatat.

### AC-SEARCH — Search (command palette = V1)

- **Given** pengguna membuka command palette (`Ctrl/⌘ + K`), **When** mengetik query, **Then** hasil hanya berisi item yang boleh dilihat pengguna.
- **Given** pengguna memakai keyboard saja, **When** menavigasi hasil dengan panah dan Enter, **Then** tujuan terbuka dan `Esc` menutup overlay.

### AC-DATA — Data integrity

- **Given** halaman mana pun menampilkan angka (Pulse, dashboard, ringkasan), **When** dirender di produksi, **Then** angka berasal dari database.
- **Given** data tidak tersedia, **When** dirender, **Then** muncul `Not available` / `Not yet documented` / `Coming soon` dan bukan nilai pengisi.

### AC-A11Y — Aksesibilitas (perilaku)

- **Given** pengguna keyboard-only, **When** membuka halaman mana pun, **Then** skip-to-content tersedia sebagai fokus pertama dan seluruh kontrol dapat dioperasikan dengan fokus terlihat.
- **Given** status ditampilkan, **When** dirender, **Then** status memiliki label teks, bukan hanya warna.
- **Given** pengguna mengaktifkan `prefers-reduced-motion`, **When** halaman dirender, **Then** transisi/animasi non-esensial dinonaktifkan dan informasi tetap sampai.

---

## 33. Open Decisions

Seluruhnya diambil dari `spec.md` §21. **Tidak diselesaikan di PRD ini.** Status semuanya: **DECISION NEEDED** (kecuali dinyatakan `UNDEFINED`). P0 memblokir MVP, P1 memblokir V1, P2 dapat menunggu.

| ID | Pri | Keputusan | Daftar periksa brief PRD |
|---|---|---|---|
| D-01 | P0 | Hubungan & penamaan NCD–NEXA (Community Development vs Competition Division; peran NEXA Tech Labs; apakah situs di bawah brand NEXA) | NEXA relationship |
| D-02 | P0 | Warna brand: teal/navy NEXA vs neutral gelap + violet; penggunaan logo | — |
| D-03 | P0 | Visibility Kas (publik / member / leadership) dan siapa yang boleh menulis entri | Kas public/member visibility |
| D-04 | P0 | Siapa ADMIN; apakah LEADERSHIP boleh bertindak sebagai ADMIN | ADMIN definition |
| D-05 | P0 | Membership & sign-up (invite-only? approval?) | Member registration policy |
| D-06 | P0 | Halaman People publik: model consent dan field publik | Public people visibility |
| D-07 | P0 | Bahasa UI (EN / ID / dwibahasa) | UI language |
| D-08 | P1 | Enam pertanyaan Retrospective (`UNDEFINED`) | Retrospective questions |
| D-09 | P1 | Daftar kategori, daftar status, skala readiness Competition | Competition categories, competition status |
| D-10 | P1 | Vocabulary status Project dan visibility default | Project status vocabulary, project visibility |
| D-11 | P1 | Daftar kategori Knowledge dan format penulisan | Knowledge categories |
| D-12 | P1 | Tipe PIC: daftar tertutup atau bebas | Role visibility (terkait) |
| D-13 | P1 | Struktur Growth Map dan siapa yang dapat melihatnya | Role visibility (terkait) |
| D-14 | P1 | Progress squad: manual vs turunan; daftar peran squad | — |
| D-15 | P1 | Definisi Achievements | Archive terminology (terkait) |
| D-16 | P1 | Penamaan period ("semester" vs "periode"); tanggal pasti period | Archive terminology |
| D-17 | P1 | Penempatan NEXA Gathering dan Demo Day di situs | — |
| D-18 | P2 | Kas: iuran, target saldo (diputuskan anggota dulu), lampiran, kebijakan append-only | — |
| D-19 | P2 | Vocabulary skill dan level | — |
| D-20 | P2 | Magic link auth | — |
| D-21 | P2 | Zona waktu default (usulan Asia/Jakarta) | — |
| D-22 | P2 | Tooling analytics produk dan privasi | — |
| D-23 | P2 | Domain / canonical host / hosting | — |
| D-24 | P2 | Penggunaan foto leadership dan consent | — |
| D-25 | P2 | Monitoring view untuk Wakil | — |

**Keputusan tersirat yang disebut spec di luar tabel §21** (tetap terbuka):

| Hal | Keterangan |
|---|---|
| Visibility knowledge (default publik vs member-only) | spec §8.8 |
| Visibility project (default) | spec §8.5 (juga bagian D-10) |
| Role visibility (siapa melihat konten role/assignment, Growth Map orang lain) | sel ⚠ di spec §11 |
| Permission-denied: disembunyikan vs tampil terkunci | spec §12 |
| Penempatan Squads / Growth / Kas di navigasi authenticated | spec §7, DD-09 |
| Apakah sistem Admin boleh membaca Kas | spec §11 rule 1 |
| Apakah Leadership dapat bertindak sebagai Admin | spec §6 |

**Keputusan desain terbuka:** DD-01 s.d. DD-10 (`design.md` §32).

Peran PRD: tidak ada dari keputusan di atas yang boleh dianggap selesai oleh pembaca PRD ini.

---

## 34. Requirement Traceability

Kolom **Status** di tabel ini dibedakan agar jujur terhadap bukti:

- **Spec status** = fase menurut `spec.md` (M / V1 / F) dan apakah ada blocker keputusan.
- **Implementation status** = status berdasarkan repositori aktual (Implemented / Partial / Planned / Future / Blocked / Decision Needed / Unable to verify). Repositori **tidak tersedia** saat PRD ini ditulis, sehingga tidak ada satu pun fitur yang dapat diberi status **Implemented** atau **Partial**. Lihat §35.

| Feature | Requirement Source | Priority | Status | Related Design | Related Route |
|---|---|---|---|---|---|
| Home / Current Pulse / Ecosystem | spec §8.11, F-01 | P0 | Planned · impl: Unable to verify | design §1, §26, §27, §30 | `/` |
| About | spec §8.1, F-02 | P0 | Planned · impl: Unable to verify · konten draft (D-01, D-24) | design §29 | `/about` |
| Navigation | spec §7, F-03 | P0 | Planned · penempatan akhir: Decision Needed (DD-09) | design §14 | semua |
| Authentication | spec §8.12, F-04 | P0 | Planned · impl: Unable to verify · Register & magic link: Decision Needed (D-05, D-20) | design §16, §28 | `/login`, `/app/*`, `/admin/*` |
| People | spec §8.2, F-05, F-06 | P0 | Planned · publik: Decision Needed (D-06) | design §17, §20 | `/people`, `/app/people` |
| Projects | spec §8.5, F-09 | P0 | Planned · status/visibility: Decision Needed (D-10) | design §17, §18 | `/projects`, `/app/projects` |
| Competitions (Radar) | spec §8.6, F-07 | P0 | Planned · vocab: Decision Needed (D-09) | design §17, §18 | `/competitions`, `/app/competitions` |
| Competition Brief | spec §8.6, F-08 | P0 | Planned · readiness: Decision Needed (D-09) | design §17 | `/competitions/[…]` |
| Knowledge | spec §8.8, F-11 | P0 | Planned · kategori/format: Decision Needed (D-11) | design §17, §23 | `/knowledge`, `/app/knowledge` |
| Activities | spec §8.4, F-10 | P0 | Planned · kategori: Decision Needed | design §17, §30 (Timeline) | `/activities`, `/app/activities` |
| Authenticated Overview | spec §14 | P0 | Planned · impl: Unable to verify | design §13, §14 | `/app/dashboard` |
| Admin (minimal) | spec F-18 | P0 (minimal) / V1 | Planned · pemegang ADMIN: Decision Needed (D-04) | design §13 | `/admin/*` |
| NCD Kas — read | spec §8.10, F-12 | P0 | **Blocked** oleh D-03 | design §6, §18 | `/app/kas`, `/transparency` |
| NCD Kas — write | spec §8.10, F-13 | P0 | **Blocked** oleh D-03, D-18 | design §18, §21 | `/app/kas`, `/admin/kas` |
| Transparency | spec §7, §8.10 | P1 (menurut brief PRD) / bergantung D-03 | Decision Needed (D-03) | design §18 | `/transparency` |
| Squads | spec §8.7, F-14 | P1 | Planned · peran/progres: Decision Needed (D-14) | design §17, §30 (Progress) | `/app/squads` |
| Team Formation helper | spec F-19 | P1 | Planned | design §17 | `/app/squads` |
| Growth Map | spec §8.3, F-15 | P1 | Planned · visibility/struktur: Decision Needed (D-13) | design §2 | `/app/growth` |
| Retrospective | spec §8.8, F-16 | P1 | **Blocked** oleh D-08 (pertanyaan `UNDEFINED`) | design §23 | di dalam project/competition |
| Archive | spec §8.9, F-17 | P1 (MVP: daftar period sederhana) | Planned · terminologi: Decision Needed (D-15, D-16) | design §14 (breadcrumb) | `/archive` |
| Documentation / Media library | spec F-23 | P1 | Planned | design §30 | `/app/documentation`, `/admin/documentation`, `/admin/media` |
| Command palette | spec F-22 | P1 | Planned | design §14 | global |
| Wakil monitoring view | spec F-20 | Future | Future · Decision Needed (D-25) | — | — |
| Demo Day showcase | spec F-21 | Future | Future · Decision Needed (D-17) | — | — |

---

## 35. Current Product State

### 35.1 Apa yang dapat diverifikasi

| Item | Hasil |
|---|---|
| `spec.md`, `design.md`, `agents.md` | **Dibaca penuh.** |
| Repositori kode (`package.json`, `src/app`, `src/components`, `src/lib`, `src/types`, klien Supabase, skema/migrasi Supabase, implementasi auth, route/navigasi/halaman/komponen aktual) | **Tidak tersedia** pada lingkungan tempat PRD ini ditulis: hanya tiga file dokumen yang diunggah; tidak ada direktori kode, tidak ada `package.json`. **Tidak diperiksa.** |
| Fase proyek | `agents.md` §10 menyatakan: *"This repository's current phase: documentation only."* `spec.md` §4 menyatakan: tidak ada source code, migrasi, atau deployment pada fase ini. |

Karena itu **tidak ada klaim "Implemented" atau "Partial"** yang dapat dibuktikan. Semua status implementasi di bawah adalah `Unable to verify`, dengan petunjuk dari pernyataan fase dokumentasi. Setelah repositori tersedia, tabel ini harus diisi ulang dari inspeksi aktual (route, komponen, skema, RLS, auth).

### 35.2 Status per route

| Route | Current status | Implemented functionality | Missing functionality | Known issues |
|---|---|---|---|---|
| `/` | Unable to verify | Unable to verify | Per spec §8.11, F-01 | Unable to verify |
| `/about` | Unable to verify | Unable to verify | Per spec §8.1, F-02 | Unable to verify |
| `/people` | Unable to verify | Unable to verify | Per spec §8.2, F-05; keputusan D-06 | Unable to verify |
| `/activities` | Unable to verify | Unable to verify | Per spec §8.4, F-10 | Unable to verify |
| `/projects` | Unable to verify | Unable to verify | Per spec §8.5, F-09 | Unable to verify |
| `/competitions` | Unable to verify | Unable to verify | Per spec §8.6, F-07, F-08 | Unable to verify |
| `/knowledge` | Unable to verify | Unable to verify | Per spec §8.8, F-11 | Unable to verify |
| `/transparency` | Unable to verify | Unable to verify | Per spec §7, D-03 | Unable to verify |
| `/archive` | Unable to verify | Unable to verify | Per spec §8.9, F-17 | Unable to verify |
| `/login` | Unable to verify (auth: Supabase Auth adalah **requirement**, bukan bukti implementasi) | Unable to verify | Per spec §8.12, F-04 | Unable to verify |
| `/app/dashboard` | Unable to verify | Unable to verify | Per spec §14 | Unable to verify |
| `/app/people` | Unable to verify | Unable to verify | Per spec F-05 | Unable to verify |
| `/app/activities` | Unable to verify | Unable to verify | Per spec F-10 | Unable to verify |
| `/app/projects` | Unable to verify | Unable to verify | Per spec F-09 | Unable to verify |
| `/app/competitions` | Unable to verify | Unable to verify | Per spec F-07, F-08 | Unable to verify |
| `/app/squads` | Unable to verify | Unable to verify | V1: spec F-14, F-19 | Unable to verify |
| `/app/knowledge` | Unable to verify | Unable to verify | Per spec F-11 | Unable to verify |
| `/app/growth` | Unable to verify | Unable to verify | V1: spec F-15 | Unable to verify |
| `/app/documentation` | Unable to verify | Unable to verify | V1: spec F-23 | Unable to verify |
| `/app/kas` | Unable to verify | Unable to verify | spec F-12, F-13; Blocked D-03 | Unable to verify |
| `/admin/*` | Unable to verify | Unable to verify | Per spec F-18 (minimal) | Unable to verify |

### 35.3 Integrasi Supabase

Klien Supabase, skema/migrasi, kebijakan RLS, dan implementasi auth: **Unable to verify** (tidak ada repositori). Stack standar (agents §3) = Next.js 16+ App Router, TypeScript strict, Tailwind, shadcn/ui, Lucide, Geist, Supabase (PostgreSQL, Auth, Storage, RLS) — itu adalah **aturan/rencana**, bukan konfirmasi bahwa komponen tersebut sudah terpasang.

---

## 36. Requirements vs Implementation Gaps

Karena repositori tidak tersedia, kolom "Current implementation" tidak dapat diisi dari bukti. Gap yang ditulis adalah selisih terhadap requirement berdasarkan satu-satunya bukti yang ada (fase *documentation only*).

| Requirement | Current implementation | Gap |
|---|---|---|
| Home / Ecosystem / Pulse (F-01) | Unable to verify | Seluruh requirement belum dapat dikonfirmasi ada. |
| About (F-02) | Unable to verify | Idem; konten juga menunggu konfirmasi pimpinan. |
| Navigation (F-03) | Unable to verify | Idem; penempatan akhir Squads/Growth/Kas masih keputusan terbuka. |
| Auth (F-04) | Unable to verify | Idem; Register dan magic link masih `DECISION NEEDED`. |
| People (F-05, F-06) | Unable to verify | Idem; model consent publik (D-06) belum ada. |
| Projects (F-09) | Unable to verify | Idem; vocabulary status dan visibility belum diputuskan. |
| Competitions (F-07, F-08) | Unable to verify | Idem; kategori, status, readiness belum diputuskan. |
| Knowledge (F-11) | Unable to verify | Idem; kategori/format belum diputuskan. |
| Activities (F-10) | Unable to verify | Idem; kategori belum final. |
| Kas (F-12, F-13) | Unable to verify | Idem; terblokir D-03 dan D-18. |
| Squads, Growth, Retrospective, Archive (V1) | Unable to verify | Belum masuk fase; Retrospective terblokir D-08. |
| RLS dan otorisasi server | Unable to verify | Tidak dapat dikonfirmasi; wajib diuji untuk tiap role (agents §1.5). |
| Skema database (`spec` §10) | Unable to verify | Tidak ada migrasi yang dapat dibandingkan; skema tidak boleh difinalkan buta (agents §6.1). |
| Aksesibilitas / responsif | Unable to verify | Perlu uji di 375/390/430/768/1024/1280/1440 dan audit keyboard/axe setelah implementasi. |

Langkah penutup gap (usulan, bukan klaim): sediakan repositori, lalu inspeksi `package.json`, `src/app`, `src/components`, `src/lib`, `src/types`, klien Supabase, skema/migrasi, implementasi auth, route, navigasi, dan komponen; perbarui §34–§36 dari bukti nyata.

---

## 37. Catatan Deviasi terhadap Brief PRD

Agar tidak ada konflik tersembunyi, berikut titik di mana brief PRD berbeda dari `spec.md`, dan bagaimana PRD ini menanganinya (dengan `spec.md` sebagai pemenang):

| Hal | Brief PRD | `spec.md` | Penanganan di PRD |
|---|---|---|---|
| Kas | Tidak masuk daftar P0 | MVP (F-12, F-13), tertahan D-03 | Ikut spec: P0, ditandai **Blocked** oleh D-03 |
| Authenticated Overview | P1 | MVP (`/app/dashboard`) | Ikut spec: P0 |
| Archive | P1 | V1 (MVP hanya daftar period sederhana) | Ikut spec: V1 |
| Transparency | P1 | Rute ada; visibility D-03; tidak ada F-ID tersendiri | Ditandai bergantung D-03; fasa tidak diklaim final |
| Command palette / advanced search | P2 | V1 (F-22) | Ikut spec: V1 |
| Register | Disebut sebagai alur wajib | Tidak ada di F-04; kebijakan `UNDEFINED` (D-05) | Ditandai `DECISION NEEDED`, tidak diasumsikan |
| Enam pertanyaan retrospective | Tidak diketahui | `UNDEFINED` (D-08) | Tidak dikarang; model configurable |
| Nama goal G1–G9 | Penomoran PRD | Penomoran `spec.md` §3 berbeda | Dipetakan eksplisit di §5 |
| "Admin overview" sebagai bagian MVP | — | Admin minimal di MVP (F-18) | Ikut spec |

Tidak ada requirement yang ditambahkan hanya agar website tampak lebih keren. Setiap perilaku di atas dapat ditelusuri ke `spec.md`, `design.md`, atau `agents.md`.

# Modul Pengembangan IARCHI

> Panduan beginner untuk membangun conversational personal portfolio milik Assabigunal Awwalun dengan pola kerja **developer-led, AI-assisted**, dimulai dari kondisi repository saat ini hingga website online.

**Status:** Living document  
**Versi:** 1.0.0  
**Terakhir diperbarui:** 19 September 2026  
**Repository:** `alann39/iarchi`  
**Branch utama:** `main`

---

## 1. Tujuan modul

Modul ini dibuat untuk cara kerja berikut:

- kamu tetap menjadi developer dan pengambil keputusan;
- AI di dalam IDE membantu membaca kode, menjelaskan, menulis perubahan terbatas, dan menjalankan pemeriksaan;
- kamu melihat proses dan memeriksa hasilnya secara langsung;
- pekerjaan dibagi menjadi langkah kecil yang bisa dipahami dan dibatalkan;
- pada checkpoint tertentu, kamu meminta Codex memeriksa progress melalui GitHub;
- ketika muncul ide baru, requirement dan modul diperbarui sebelum perubahan besar dikerjakan.

Bayangkan AI IDE sebagai tukang yang bekerja sangat cepat. Ia dapat memasang pintu dalam hitungan detik, tetapi kamulah arsitek yang menentukan posisi pintu, memastikan pintu tidak menabrak meja, dan menguji apakah kuncinya berfungsi.

### Hasil akhir yang ingin dibangun

IARCHI akan menjadi personal website dengan karakter berikut:

- hanya memiliki dua destinasi utama: **Chat** dan **Blog**;
- halaman utama berbentuk percakapan untuk mengeksplorasi profil dan portofolio;
- pertanyaan penting memiliki jawaban curated yang tetap berfungsi tanpa AI;
- pertanyaan bebas yang relevan dapat dijawab oleh grounded AI;
- jawaban dapat menampilkan project, experience, skill, artikel, résumé, gambar, dan contact CTA;
- project dan artikel memiliki URL publik yang dapat dibagikan dan diindeks;
- konten dikelola melalui Sanity Studio;
- UI menggunakan interpretasi orisinal Apple-inspired Liquid Glass;
- interface utama memakai bahasa Inggris, tetapi AI memahami Inggris dan Indonesia;
- website responsif, accessible, aman, cepat, dan dapat dikelola setelah launch.

Website ini **bukan** clone ChatGPT, bukan public chat room, dan bukan general-purpose AI. Ini adalah personal portfolio yang ceritanya dibuka melalui interaksi percakapan.

---

## 2. Cara menggunakan modul

Setiap phase memiliki pola yang sama:

1. baca analoginya agar memahami fungsi tahap tersebut;
2. pahami target dan batas pekerjaannya;
3. buat branch khusus;
4. kirim prompt yang tersedia kepada AI IDE;
5. minta AI menjelaskan rencana sebelum mengedit;
6. izinkan implementasi dalam bagian kecil;
7. periksa diff dan hasil di browser;
8. jalankan validation commands;
9. commit dan push jika hasil sudah dipahami;
10. lakukan checkpoint GitHub sebelum masuk ke phase berikutnya.

Jangan hanya mencentang checklist. Pastikan kamu bisa menjelaskan secara sederhana apa yang berubah dan mengapa.

---

## 3. Posisi repository saat ini

Sebelum merenovasi rumah, kita perlu melihat struktur yang sudah berdiri. Repository ini bukan lahan kosong; template teknisnya sudah tersedia.

### Baseline aktual

| Bagian | Kondisi saat ini |
|---|---|
| Repository | `alann39/iarchi` |
| Struktur | npm workspaces/monorepo |
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 dan global CSS |
| CMS | Sanity Studio 5 |
| Folder frontend | `frontend/` |
| Folder CMS | `studio/` |
| URL frontend lokal | `http://localhost:3000` |
| URL Studio lokal | `http://localhost:3333` |
| Schema bawaan | Page, Post, Person, Settings, dan supporting objects |
| Quality check | ESLint, TypeScript, Prettier workflow, GitHub Actions CI |
| Target hosting | Vercel untuk frontend dan hosting Sanity untuk Studio |

### Peta file penting

- `package.json`: pusat perintah kedua workspace.
- `frontend/package.json`: dependency dan script aplikasi publik.
- `studio/package.json`: dependency dan script Sanity Studio.
- `frontend/app/`: route, layout, dan komponen Next.js.
- `frontend/app/page.tsx`: homepage starter yang nanti diganti bertahap.
- `frontend/app/globals.css`: global style dan token Tailwind saat ini.
- `frontend/sanity/`: client, query, live content, dan utility Sanity.
- `studio/src/schemaTypes/`: bentuk data yang dapat diisi melalui CMS.
- `frontend/.env.example` dan `studio/.env.example`: daftar environment variable.
- `AGENTS.md`: aturan agar AI membaca dokumentasi Next.js yang terpasang sebelum mengubah Next.js.
- `.github/workflows/ci.yml`: menjalankan lint dan type-check di GitHub.

### Yang belum tersedia

- requirement IARCHI di dalam repository;
- content inventory yang telah diverifikasi;
- conversation map;
- visual identity IARCHI;
- schema portfolio khusus;
- deterministic conversation engine;
- rich response block;
- grounded AI endpoint;
- production content dan résumé final;
- test dan deployment verification khusus IARCHI.

Artinya, langkah pertama bukan langsung membuat efek kaca atau chatbot. Kita harus memastikan starter berjalan dan membuat aturan proyek terlebih dahulu.

---

## 4. Arsitektur dengan analogi galeri

Bayangkan website ini sebagai sebuah galeri modern:

- **Repository GitHub** adalah gambar bangunan beserta riwayat renovasinya.
- **Git branch** adalah salinan satu ruangan untuk direnovasi tanpa menutup seluruh galeri.
- **Next.js frontend** adalah ruang publik yang dikunjungi orang.
- **React component** adalah furnitur reusable seperti card, tombol, bubble, dan navigation.
- **Sanity Studio** adalah ruang kontrol staf untuk mengelola konten.
- **Sanity dataset** adalah gudang yang menyimpan profil, project, pengalaman, dan artikel.
- **AI model** adalah pemandu galeri yang hanya boleh menjelaskan informasi di katalog resmi.
- **Environment variable** adalah kunci dan alamat privat. Kode tahu kapan kunci dibutuhkan, tetapi nilai kuncinya tidak boleh dipajang.
- **Vercel** adalah lokasi publik tempat galeri dibuka secara online.
- **Test dan CI** adalah inspeksi keselamatan sebelum ruangan dibuka.

Aturan arsitektur terpenting:

> Curated content dan deterministic navigation adalah sumber kebenaran. AI membantu menjelaskan sumber tersebut, bukan membuat fakta baru.

---

## 5. Aturan bekerja dengan AI IDE

### Struktur prompt yang sehat

Setiap task harus memiliki lima unsur:

1. **Context:** project dan phase yang sedang dikerjakan.
2. **Scope:** file atau kemampuan yang boleh diubah.
3. **Constraints:** hal yang harus dipertahankan dan dihindari.
4. **Verification:** perintah dan behavior yang harus diuji.
5. **Stop condition:** kapan AI harus berhenti dan menyerahkan kontrol.

### Prefix yang digunakan sebelum semua prompt

Salin bagian ini sebelum prompt khusus setiap phase:

```text
You are assisting me as a pair programmer in the IARCHI repository.
I am the developer and will review every change.

Before editing:
1. Read AGENTS.md completely.
2. Read docs/DEVELOPMENT_GUIDE.md and identify the current phase.
3. Read docs/REQUIREMENTS.md if it already exists.
4. Inspect the relevant existing files and current git status.
5. Explain in beginner-friendly language what you found, which files you propose to change, and why.
6. Wait for my approval before editing unless I explicitly say "implement now".

While working:
- Keep changes limited to the requested task.
- Preserve existing user changes.
- Do not expose or commit secrets or .env files.
- Do not replace the architecture or add dependencies without explaining the tradeoff first.
- Use the existing npm workspace structure.
- For Next.js work, follow AGENTS.md and consult the installed Next.js docs.
- Do not claim success until the relevant checks have actually run.

After editing:
- Summarize the change in plain language.
- List changed files.
- Show commands run and their results.
- State the manual browser checks I still need to perform.
- Stop and wait for my review.
- Do not commit or push unless I explicitly request it.
```

### Pertanyaan yang perlu kamu ajukan kepada AI

- Masalah apa yang diselesaikan file ini?
- Mengapa logika ditempatkan di sini?
- Bagian mana yang berjalan di server dan browser?
- Apa yang mungkin rusak akibat perubahan ini?
- Bagaimana cara mengujinya secara manual?
- Tunjukkan diff sebelum commit.
- Apakah ada dependency baru? Mengapa dependency tersebut diperlukan?

### Perilaku yang tidak boleh langsung disetujui

- menghapus banyak file starter sebelum penggantinya bekerja;
- mengganti npm dengan package manager lain;
- menambahkan banyak library untuk komponen sederhana;
- menaruh API key di source code;
- membiarkan LLM menghasilkan arbitrary HTML;
- melewati lint, type-check, atau build karena tampilan terlihat benar;
- mencampur beberapa phase besar dalam satu commit;
- menyembunyikan error dengan menonaktifkan rule.

---

## 6. Git untuk beginner

Git dapat dibayangkan sebagai save system. Commit adalah save point berlabel, sedangkan branch adalah alternate timeline.

### Pola branch

Gunakan satu branch untuk satu task atau kelompok perubahan yang saling berhubungan:

```bash
git switch main
git pull origin main
git switch -c phase/short-task-name
```

Setelah task bekerja:

```bash
git status
git diff
npm run lint
npm run type-check
git add <specific-file-or-folder>
git commit -m "feat: describe the completed change"
git push -u origin phase/short-task-name
```

Selama belajar, pilih file secara spesifik saat `git add`. Ini memaksa kamu sadar file mana yang akan disimpan.

### Prefix commit

| Prefix | Fungsi |
|---|---|
| `docs:` | Perubahan dokumentasi |
| `chore:` | Setup atau maintenance |
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `refactor:` | Restrukturisasi tanpa mengubah behavior |
| `test:` | Test |
| `style:` | Perubahan visual |

### Saat terjadi masalah

Jangan langsung meminta AI menjalankan reset destruktif. Jalankan:

```bash
git status
git diff
git log --oneline -5
```

Berikan output tersebut kepada AI dan minta opsi pemulihan paling aman.

---

## 7. Roadmap dan checkpoint

| Phase | Hasil | Checkpoint |
|---|---|---|
| 0 | Starter berjalan lokal dan baseline dipahami | CP-0 |
| 1 | Requirement, content inventory, conversation map, agent rules | CP-1 |
| 2 | Sanity content model khusus portfolio | CP-2 |
| 3 | App shell dan Liquid Glass foundation | CP-3 |
| 4 | Curated conversational navigation | CP-4 |
| 5 | Rich blocks, project page, résumé, dan contact | CP-5 |
| 6 | Blog dan workflow publishing | CP-6 |
| 7 | Grounded AI assistant | CP-7 |
| 8 | Accessibility, security, SEO, performance, dan QA | CP-8 |
| 9 | Deployment dan launch verification | CP-9 |

Jangan masuk ke phase berikutnya jika exit criteria phase saat ini belum terpenuhi.

---

## Phase 0 — Menjalankan dan memahami starter

### Analogi

Sebelum renovasi, nyalakan semua lampu dan keran. Kalau ada masalah bawaan, kita perlu mengetahuinya sebelum mengubah apa pun.

### Target

Clone repository, install dependency, menghubungkan environment Sanity, menjalankan frontend dan Studio, lalu mencatat baseline.

### Langkah 0.1 — Siapkan alat dan akun

Siapkan:

- Git;
- Node.js LTS yang kompatibel;
- IDE dengan AI terintegrasi;
- akun GitHub yang dapat mengakses repository;
- akun Sanity;
- akun Vercel untuk phase deployment;
- browser modern dengan developer tools.

Periksa terminal:

```bash
git --version
node --version
npm --version
```

### Langkah 0.2 — Clone dan install

```bash
git clone https://github.com/alann39/iarchi.git
cd iarchi
npm install
```

`npm install` membaca lockfile dan memasang dependency untuk `frontend` dan `studio`. Lockfile seperti nota belanja pasti: komputer lain membeli versi package yang sama.

### Langkah 0.3 — Hubungkan Sanity secara aman

Periksa apakah project Sanity sudah dibuat saat template disiapkan.

- Jika sudah ada, buka Sanity Manage dan catat project ID.
- Jika belum, buat project Sanity dan gunakan dataset `production`.
- Buat read token dengan permission minimum yang dibutuhkan starter.
- Siapkan CORS untuk localhost dan nantinya production URL.

Buat file environment lokal:

```bash
cp frontend/.env.example frontend/.env.local
cp studio/.env.example studio/.env.local
```

Isi nilainya hanya di komputer lokal. Jangan kirim token ke chat, screenshot, commit, atau dokumentasi. Variable berawalan `NEXT_PUBLIC_` terlihat oleh browser sehingga tidak boleh berisi secret. `SANITY_API_READ_TOKEN` adalah private.

### Langkah 0.4 — Jalankan aplikasi

```bash
npm run dev
```

Buka:

- `http://localhost:3000` untuk website;
- `http://localhost:3333` untuk Studio.

Hasil yang diharapkan: homepage starter tampil, Studio dapat dibuka setelah login, dan terminal tidak mengulang fatal error.

### Langkah 0.5 — Catat baseline

```bash
npm run lint
npm run type-check
```

Jika gagal sebelum kode diubah, simpan error lengkap. Baseline error harus dibedakan dari error yang muncul setelah implementasi.

### Prompt AI IDE Phase 0

```text
[Paste the reusable prefix first]

PHASE 0 — Audit and run the existing starter. Do not redesign or delete anything.

Inspect the npm workspaces, package scripts, environment examples, frontend routes, Sanity schemas, and GitHub workflows. Explain the repository structure in beginner-friendly language. Guide me through installation, environment setup, dev servers, lint, and type-check one command at a time. Diagnose an exact failure before suggesting a change. Produce a short baseline report without modifying application code.
```

### Exit criteria

- kedua local URL terbuka;
- Studio terhubung ke project dan dataset yang benar;
- secret tidak ter-track Git;
- hasil lint dan type-check baseline diketahui;
- kamu dapat menjelaskan perbedaan `frontend` dan `studio`.

### Checkpoint CP-0

```text
@GitHub Tolong audit CP-0 pada repo alann39/iarchi, branch <branch-name>. Periksa struktur, catatan baseline, file environment yang mungkin ter-track, dan hasil CI. Jangan ubah kode. Jelaskan apakah aman lanjut ke Phase 1 dengan bahasa beginner.
```

---

## Phase 1 — Menetapkan kontrak produk dan isi

### Analogi

Ini adalah tahap membuat gambar arsitektur dan daftar karya yang akan dipamerkan. Membuat UI sebelum tahap ini seperti membeli sofa sebelum mengetahui jumlah ruangan.

### Target

Membuat source of truth proyek sebelum implementasi besar.

### Dokumen yang harus dibuat

- `docs/REQUIREMENTS.md`: behavior, scope, dan acceptance criteria;
- `docs/CONTENT_INVENTORY.md`: profil, pengalaman, project, skill, service, résumé, social link, dan ide artikel;
- `docs/CONVERSATION_MAP.md`: pertanyaan, curated response, block, dan next suggestion;
- `docs/DECISIONS.md`: keputusan arsitektur bertanggal;
- `AGENTS.md`: aturan ringkas untuk coding agent.

### Topik percakapan awal

- Who is Awwal?
- Tell me your story.
- Show me your experience.
- What do you do in Risk Management?
- Show me your projects.
- Tell me about FINESHYT.
- Tell me about Lil Cash.
- What can you help me with?
- Show me your résumé.
- How can I contact you?
- Show me your latest writing.

Setiap topik mendefinisikan:

- stable ID;
- visitor question;
- curated answer;
- response blocks;
- sumber konten;
- next suggestions;
- optional destination URL.

### Filter privasi

| Kelas | Contoh | Keputusan |
|---|---|---|
| Public | job title, ringkasan project | Boleh dipublikasikan |
| Review | angka pencapaian, detail client | Publikasikan setelah verifikasi |
| Private | dokumen internal, nomor pribadi, credential | Jangan dimasukkan |

### Prompt AI IDE Phase 1

```text
[Paste the reusable prefix first]

PHASE 1 — Create the project's documentation foundation.

Use docs/DEVELOPMENT_GUIDE.md and the existing starter as context. Draft docs/REQUIREMENTS.md, docs/CONTENT_INVENTORY.md, docs/CONVERSATION_MAP.md, and docs/DECISIONS.md. Update AGENTS.md only where project-specific rules are missing and preserve its Next.js documentation rule. Do not implement UI, schemas, or APIs.

Distinguish MVP, later enhancements, and out-of-scope features. Give conversation topics stable IDs and list their required rich blocks. Mark unknown personal content as TODO instead of inventing it. Show me the proposed outlines before writing.
```

### Pemeriksaan manual

- hapus klaim yang tidak dapat dibuktikan;
- hindari informasi sensitif perusahaan;
- pastikan copy Inggris terdengar natural;
- unknown content harus menjadi TODO, bukan karangan AI;
- requirement mencakup desktop dan mobile.

### Exit criteria

- scope dapat dipahami tanpa membaca chat lama;
- content gap terlihat jelas;
- topik utama mempunyai response plan;
- agent diwajibkan membaca requirement;
- data sensitif tidak masuk content plan.

### Checkpoint CP-1

```text
@GitHub Audit CP-1 pada alann39/iarchi branch <branch-name>. Cocokkan REQUIREMENTS, CONTENT_INVENTORY, CONVERSATION_MAP, DECISIONS, dan AGENTS.md. Cari scope ambigu, data sensitif, klaim tanpa sumber, dan requirement yang sulit diuji. Jangan implementasikan fitur.
```

---

## Phase 2 — Membuat Sanity content model

### Analogi

Schema Sanity adalah rak berlabel di gudang. Jika semua benda dimasukkan ke kotak besar bernama “content”, website dan AI akan kesulitan menemukan benda yang benar.

### Target

Membuat data portfolio terstruktur dan membuktikan bahwa data dapat dibuat, dicari, dan ditampilkan.

### Content type yang direncanakan

| Type | Fungsi |
|---|---|
| `profile` | nama, positioning, bio, availability, portrait |
| `experience` | role, organisasi, periode, kontribusi |
| `project` | problem, role, solution, stack, outcome, link, gallery |
| `skillGroup` | kelompok skill dan tools |
| `service` | bantuan yang dapat diberikan Awwal |
| `blogPost` | artikel editorial |
| `resume` | metadata dan downloadable asset |
| `conversationTopic` | curated question dan response plan |
| `siteSettings` | navigation, social, SEO, dan contact |

Field untuk grounding AI dapat mencakup `aiSummary`, `keywords`, `visibility`, `relatedContent`, `featured`, dan `lastVerifiedAt`.

Jangan menambah field hanya karena mungkin berguna. Setiap field harus mempunyai use case UI, editorial, SEO, atau retrieval saat ini.

### Urutan implementasi

1. Bandingkan schema baru dengan Page, Post, Person, dan Settings bawaan.
2. Catat keputusan keep, extend, replace, atau retire di `docs/DECISIONS.md`.
3. Buat schema dalam kelompok kecil.
4. Daftarkan schema di `studio/src/schemaTypes/index.ts`.
5. Jalankan type generation.
6. Buat minimal satu document untuk setiap core type.
7. Tambahkan typed GROQ queries.
8. Buktikan data dapat dirender.

### Commands

```bash
npm run sanity:typegen --workspace=frontend
npm run type-check
```

Jangan mengedit `sanity.schema.json` atau generated `sanity.types.ts` secara manual.

### Prompt AI IDE Phase 2

```text
[Paste the reusable prefix first]

PHASE 2 — Design and implement the portfolio-specific Sanity model.

Compare docs/REQUIREMENTS.md and docs/CONTENT_INVENTORY.md with the current Page, Post, Person, and Settings schemas. Propose a migration table: keep, extend, replace, or retire. Explain each choice and wait for approval.

After approval, implement only the agreed schemas and registrations. Add appropriate validation, readable previews, stable slugs, image alt text, publication visibility, verification dates, and references. Do not create an unstructured catch-all object. Run schema extraction, type generation, and type-check. Never manually edit generated type files.
```

### Pemeriksaan Studio

- buat dan publish profile;
- buat satu experience dan satu project;
- buat conversation topic yang mereferensikan data tersebut;
- periksa required-field validation;
- periksa document preview;
- edit konten dan pastikan frontend membaca pembaruan.

### Exit criteria

- schema dan type generation berhasil;
- konten inti dapat ditulis tanpa mengubah kode;
- query mengembalikan typed data;
- visibility dan verification metadata tersedia;
- tidak ada sumber kebenaran ganda.

### Checkpoint CP-2

```text
@GitHub Audit CP-2 pada alann39/iarchi branch <branch-name>. Review schema, registration, GROQ query, generated types, dan DECISIONS.md. Nilai apakah model cukup terstruktur untuk portfolio, blog, dan grounded AI tanpa overengineering. Periksa CI.
```

---

## Phase 3 — App shell dan Liquid Glass foundation

### Analogi

App shell adalah dinding, pencahayaan, koridor, dan papan petunjuk galeri. Isi pameran dapat berubah, tetapi pengunjung selalu tahu lokasi dan cara berpindah.

### Target

Membuat layout, visual token, persistent navigation, ambient background, readable surface, responsive behavior, dan accessibility baseline.

### Prinsip desain

- calm, premium, dan personal;
- dark-first dengan ambient blue, violet, dan cyan;
- glass hanya untuk navigation, composer, control, overlay, dan selected card;
- long-form reading memakai surface lebih opaque;
- focus state dan contrast harus jelas;
- menyediakan reduced motion dan reduced transparency fallback;
- lebar conversation desktop sekitar 680–760px;
- mobile composer tidak boleh tertutup keyboard.

### Komponen foundation

- `SiteHeader` dengan segmented navigation Chat/Blog;
- `AmbientBackground`;
- primitive `GlassSurface` dengan variant terbatas;
- `PageContainer`;
- footer minimal;
- typography, spacing, color, radius, shadow, dan motion tokens.

Jangan menyalin asset atau efek Apple secara persis. Buat interpretasi orisinal atas depth, transparency, light, dan motion.

### Prompt AI IDE Phase 3

```text
[Paste the reusable prefix first]

PHASE 3 — Implement the responsive app shell and original Liquid Glass foundation.

Audit the starter Header, Footer, layout, global CSS, and Tailwind setup. Propose the smallest reusable component and token structure. Do not implement the conversation engine. Do not add a component library unless the existing stack cannot meet the requirement.

After approval, implement semantic HTML, responsive layout, visible keyboard focus, contrast-safe text, prefers-reduced-motion behavior, and fallback when heavy backdrop blur is unsuitable. Preserve Sanity live and visual editing integration. Run lint, type-check, and build. Give me exact mobile, tablet, and desktop checks.
```

### Visual check

Periksa minimal pada:

- 360 × 800;
- 768 × 1024;
- 1440 × 900;
- browser zoom 200%.

Pastikan tidak ada horizontal scroll, focus terlihat, text terbaca, tab order masuk akal, dan reduced motion tidak merusak layout.

### Exit criteria

- shell bekerja pada target viewport;
- token visual terdokumentasi;
- accessibility dasar sudah terlihat;
- branding starter hilang tanpa memutus Sanity integration;
- build berhasil.

### Checkpoint CP-3

```text
@GitHub Audit CP-3 pada alann39/iarchi branch <branch-name>. Review app shell, semantic structure, CSS/Tailwind tokens, responsive behavior, accessibility fallback, dan keamanan integrasi Sanity starter. Gunakan diff dan CI sebagai bukti.
```

---

## Phase 4 — Curated conversational navigation

### Analogi

Ini seperti tur museum dengan rute yang telah disiapkan. Pengunjung memilih cerita berikutnya, tetapi cerita penting sudah ditulis dan diverifikasi.

### Target

Mengubah homepage menjadi single conversational thread dengan deterministic routing yang tetap bekerja tanpa AI provider.

### State utama

1. **Welcome:** availability, positioning, dan suggested questions.
2. **Conversation:** pertanyaan dipilih dan response ditambahkan.
3. **Rich response:** structured block muncul di thread.
4. **Detail handoff:** membuka project, artikel, résumé, atau overlay.
5. **Contact handoff:** menampilkan contact option yang aman.
6. **Recovery:** input tidak didukung diarahkan ke topik relevan.

### Behavior deterministic

Router mengenali command seperti:

- open blog;
- show résumé;
- show projects;
- contact Awwal;
- restart conversation;
- pilih curated topic berdasarkan stable ID.

State percakapan harus berupa typed data, bukan kumpulan kondisi JSX yang tersebar.

### Aturan

- curated prompt tidak memanggil API AI;
- content dan AI tidak menghasilkan arbitrary HTML;
- message dan block memiliki stable unique key;
- riwayat dipertahankan saat internal navigation jika wajar;
- MVP tidak menyimpan percakapan permanen di server;
- reset bersifat eksplisit;
- browser storage harus versioned dan validated.

### Prompt AI IDE Phase 4

```text
[Paste the reusable prefix first]

PHASE 4 — Implement deterministic conversational navigation only.

Use docs/CONVERSATION_MAP.md and typed Sanity content. Propose the conversation state model, router contract, block registry boundary, and persistence strategy. Explain the data flow from clicking a suggestion to rendering a response, then wait for approval.

Implement Welcome and Conversation states, curated suggestions, deterministic actions, recovery response, explicit reset, respectful auto-scroll, and approved session persistence. Do not call an LLM. Add focused tests for pure router/state logic if a test setup is approved. Run lint, type-check, build, and relevant tests.
```

### Manual test

- buka clean session;
- pilih setiap primary prompt;
- ikuti minimal tiga suggestion chains;
- buka Blog lalu kembali;
- uji reset;
- uji keyboard-only;
- ketik pertanyaan unsupported;
- uji long response dan mobile scrolling.

### Exit criteria

- core portfolio dapat dijelajahi tanpa LLM;
- logic terpisah dari presentation;
- unsupported input tidak menjadi dead-end;
- state predictable dan testable;
- tidak ada klaim yang dikarang.

### Checkpoint CP-4

```text
@GitHub Audit CP-4 pada alann39/iarchi branch <branch-name>. Trace deterministic conversation dari input hingga response. Cari state bug, logic yang tercampur dengan UI, inaccessible control, storage yang tidak tervalidasi, dan dead-end. Periksa test dan CI.
```

---

## Phase 5 — Rich blocks dan supporting pages

### Analogi

Conversation adalah jalur tur; rich blocks adalah benda pameran. Card dapat memperkenalkan project, sedangkan halaman project adalah ruangan untuk melihat case study lengkap.

### Target

Menambahkan structured response dan halaman publik tanpa memberi kebebasan kepada content atau AI untuk menyuntikkan UI sembarangan.

### Block minimum

- `TextBlock`;
- `ExperienceCard`;
- `ProjectCard`;
- `SkillGroup`;
- `TimelineBlock`;
- `ArticleCard`;
- `ResumeCard`;
- `ContactCard`;
- `ImageCluster` jika diperlukan;
- `SuggestionList`.

Audio dan mini-interaction ditunda sampai bukti portfolio inti lengkap.

### Route pendukung

- `/work/[slug]` untuk project case study;
- `/resume` untuk preview dan download;
- contact handoff;
- not-found behavior untuk slug yang tidak ada.

### Aturan UX dan security

- external link aman dan jelas;
- résumé memang ditujukan untuk publik dan metadata privat sudah dibersihkan;
- contact tidak mengekspos data pribadi yang tidak dimaksudkan;
- gambar memiliki alt text;
- modal mengelola focus dengan benar;
- block menangani optional data yang kosong.

### Prompt AI IDE Phase 5

```text
[Paste the reusable prefix first]

PHASE 5 — Implement approved rich blocks and project/resume/contact routes.

Read docs/CONVERSATION_MAP.md and propose a typed discriminated-union response contract plus a registry mapping each allowed block type to one component. Explain how this prevents arbitrary rendering and wait for approval.

Implement blocks incrementally, beginning with text, project, experience, resume, contact, and suggestions. Use Sanity references and typed queries. Add /work/[slug], /resume, not-found behavior, metadata, and appropriate loading/error handling. Add accessible overlays only when required. Run all checks after each small group.
```

### Exit criteria

- renderer menerima block type yang terdaftar saja;
- experience dan project memiliki evidence serta URL;
- résumé dan contact bekerja aman;
- missing data memiliki graceful fallback;
- detail page mempunyai metadata.

### Checkpoint CP-5

```text
@GitHub Audit CP-5 pada alann39/iarchi branch <branch-name>. Review response contract, block registry, Sanity references, work routes, resume, contact, metadata, dan error states. Fokus pada type safety, arbitrary rendering risk, accessibility, dan potensi data pribadi terekspos.
```

---

## Phase 6 — Blog dan editorial workflow

### Analogi

Chat adalah percakapan di lobby, sedangkan blog adalah perpustakaan yang tenang. Identitas visualnya sama, tetapi membaca panjang memerlukan permukaan lebih stabil dan typography lebih nyaman.

### Target

Membuat blog yang indexable, article page, related content, serta handoff dari artikel ke Chat dengan context yang jelas.

### Behavior

- `/blog`: index artikel;
- `/blog/[slug]`: detail artikel;
- metadata, Open Graph, canonical behavior;
- accessible Portable Text;
- related articles;
- “Ask about this article” membuka Chat dengan article context;
- draft/preview untuk editor tetap bekerja;
- sitemap mencakup article dan project published.

### Aturan editorial

- hanya published/public record yang tampil;
- draft hanya melalui preview mode;
- artikel memiliki title, slug, excerpt, date, body, category, dan SEO fallback;
- image membutuhkan alt text;
- heading, link, list, quote, dan code dirender secara sengaja;
- Chat menerima ID/slug artikel, bukan arbitrary page payload.

### Prompt AI IDE Phase 6

```text
[Paste the reusable prefix first]

PHASE 6 — Implement the CMS-driven blog and article-to-chat handoff.

Audit the starter Post route and Portable Text setup. Propose how to adapt it to the approved blogPost model while preserving Sanity live preview. Implement /blog, /blog/[slug], publication filtering, metadata, accessible body rendering, related content, not-found behavior, sitemap entries, and a safe Ask about this article link. Keep long-form surfaces calmer and more opaque than Chat. Run lint, type-check, build, and route checks.
```

### Exit criteria

- artikel dapat dipublish dari Studio;
- artikel readable, shareable, dan indexable;
- draft tidak bocor;
- article context ke Chat deterministic;
- empty blog dan missing image ditangani.

### Checkpoint CP-6

```text
@GitHub Audit CP-6 pada alann39/iarchi branch <branch-name>. Review publishing workflow, blog queries, Portable Text, metadata, sitemap, draft visibility, related content, dan article-to-chat context. Cari kemungkinan draft leak dan broken slug.
```

---

## Phase 7 — Grounded AI assistant

### Analogi

AI adalah pemandu yang menerima map berisi fakta resmi sebelum menjawab. Jika jawaban tidak ada di map, ia harus jujur dan menawarkan rute tur yang relevan.

### Target

Menjawab pertanyaan bebas yang relevan tanpa mengorbankan akurasi curated content.

### Request flow

1. validasi input dan size limit;
2. cek deterministic command terlebih dahulu;
3. retrieve public dan verified content;
4. susun grounding context yang ringkas;
5. panggil provider melalui adapter;
6. validasi output menggunakan schema allowlist;
7. kaitkan source reference;
8. gunakan safe fallback jika informasi tidak cukup.

### Provider boundary

Buat adapter agar domain aplikasi tidak terikat langsung kepada satu vendor. Provider awal baru dipilih sebelum Phase 7 berdasarkan harga, rate limit, privacy, latency, dan API compatibility terbaru. Catat keputusan dan fallback di `docs/DECISIONS.md`.

### Aturan AI

- hanya menjawab tentang konten publik Awwal;
- tidak mengarang employer, achievement, date, number, link, atau availability;
- unrelated question diarahkan dengan sopan;
- klaim penting memiliki source;
- output tidak boleh arbitrary HTML;
- system prompt, token, draft, dan private fields tidak boleh terekspos;
- gunakan rate limit, timeout, request-size limit, dan generic production error;
- vector search ditunda sampai content volume/evaluation membuktikan kebutuhan;
- default-nya tidak menyimpan full conversation secara permanen.

### Evaluation minimum

- pertanyaan portfolio Inggris dan Indonesia;
- typo dan paraphrase;
- unsupported personal question;
- unrelated general knowledge;
- prompt injection;
- permintaan informasi privat perusahaan;
- pertanyaan dengan data yang belum tersedia;
- deterministic command melalui text input;
- provider timeout dan malformed output.

### Prompt AI IDE Phase 7

```text
[Paste the reusable prefix first]

PHASE 7 — Implement grounded free-form AI behind the deterministic engine.

Do not choose or install a provider SDK silently. Audit the current requirements, content volume, runtime constraints, and dependencies. Propose a provider-agnostic interface, retrieval approach, request/output schema, citation model, rate limiting, timeout, privacy behavior, and evaluation plan. Explain the threat model and wait for approval.

Implement the minimum server-only endpoint and adapter after approval. Deterministic intents must run first. Retrieve only published fields, validate request and model output, allow only registered response blocks, and return a safe grounded fallback. Add tests for hallucination, injection, unrelated requests, malformed output, timeout, bilingual questions, and missing sources. Never expose API keys to client code.
```

### Exit criteria

- curated flow tetap bekerja ketika model gagal;
- provider key hanya berada di server environment;
- unsupported question dijawab jujur;
- structured validation aktif;
- klaim penting mempunyai source;
- evaluation dapat diulang;
- abuse control aktif.

### Checkpoint CP-7

```text
@GitHub Audit CP-7 pada alann39/iarchi branch <branch-name>. Lakukan security dan reliability review untuk endpoint AI, adapter, retrieval, prompt construction, structured validation, citation, rate limit, timeout, logging, dan evaluation. Cari secret leak, injection, draft/private leak, hallucination, dan provider lock-in.
```

---

## Phase 8 — Production quality gate

### Analogi

Sebelum galeri dibuka, petugas memeriksa pintu darurat, papan petunjuk, akses kursi roda, pencahayaan, kunci, dan alur pengunjung. Tampilan indah belum berarti siap digunakan.

### Automated checks

```bash
npm run format
npm run lint
npm run type-check
npm run build --workspace=frontend
npm run build --workspace=studio
```

Jalankan juga unit, component, atau end-to-end test yang telah ditambahkan.

### Manual matrix

| Area | Pemeriksaan |
|---|---|
| Navigation | direct URL, back/forward, refresh, unknown slug |
| Conversation | prompt chain, reset, persistence, fallback, long content |
| Keyboard | tab order, Enter/Space, modal close, focus restore |
| Screen reader | landmark, label, live update yang tidak berlebihan |
| Responsive | phone, tablet, desktop, zoom 200% |
| Motion | reduced-motion preference |
| Content | fakta benar, tidak ada TODO, tidak ada data privat |
| SEO | title, description, canonical, sitemap, robots, Open Graph |
| Security | secret, request limit, header yang relevan |
| Failure | Sanity gagal, image hilang, model timeout, rate limit |
| Performance | image, font, client bundle, blur, animation cost |

### Prompt AI IDE Phase 8

```text
[Paste the reusable prefix first]

PHASE 8 — Perform a production-readiness audit and fix only verified issues.

Map a checklist to docs/REQUIREMENTS.md acceptance criteria. Run all existing checks and inspect accessibility, responsiveness, metadata, sitemap/robots, image optimization, client/server boundaries, secrets, security headers, error states, and AI abuse controls. Report evidence before changing code. Group fixes into small reviewable sets and rerun checks. Do not hide warnings or weaken rules just to make CI green.
```

### Exit criteria

- seluruh required check lulus;
- tidak ada high-severity accessibility/security issue;
- starter branding dan placeholder hilang;
- production error aman dan berguna;
- mobile performance masuk akal;
- acceptance checklist telah diperiksa.

### Checkpoint CP-8

```text
@GitHub Audit CP-8 pada alann39/iarchi branch <branch-name>. Lakukan production-readiness review terhadap acceptance criteria, CI, build, accessibility, SEO, security, performance, privacy, dan error states. Pisahkan launch blocker dari post-launch improvement.
```

---

## Phase 9 — Deploy dan launch

### Analogi

Deployment memindahkan galeri dari workshop ke alamat publik. Upload yang berhasil belum membuktikan pintu masuk, listrik, gudang, dan pemandu saling terhubung dengan benar.

### Langkah 9.1 — Siapkan production branch

- merge hanya branch yang telah direview;
- pastikan CI `main` hijau;
- periksa tidak ada `.env.local`, token, atau private asset;
- siapkan release note atau version tag.

### Langkah 9.2 — Deploy Sanity Studio

```bash
npm run deploy --workspace=studio
```

Pilih hostname Studio dan catat URL-nya. Gunakan URL tersebut untuk environment frontend dan preview configuration yang relevan.

### Langkah 9.3 — Buat Vercel project

1. Import `alann39/iarchi` ke Vercel.
2. Set **Root Directory** ke `frontend`.
3. Pastikan framework terdeteksi sebagai Next.js.
4. Tambahkan production environment variables.
5. Deploy sebagai preview terlebih dahulu.

Environment variable template saat ini:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`;
- `NEXT_PUBLIC_SANITY_DATASET`;
- `NEXT_PUBLIC_SANITY_API_VERSION`;
- `NEXT_PUBLIC_SANITY_STUDIO_URL`;
- `SANITY_API_READ_TOKEN`;
- server-only AI key dan configuration dari Phase 7.

Gunakan nama final yang ada di source code. Jangan membuat alias tanpa alasan dan jangan membagikan nilainya.

### Langkah 9.4 — Production access Sanity

- tambahkan preview URL jika diperlukan;
- tambahkan production origin ke CORS;
- verifikasi dataset dan permission token;
- arahkan Studio preview ke frontend yang benar.

### Langkah 9.5 — Preview smoke test

Periksa:

- homepage dan Chat;
- Blog dan satu artikel;
- satu project page;
- résumé dan contact;
- content update/preview Sanity;
- deterministic flow saat AI dinonaktifkan;
- grounded AI dengan key valid;
- unsupported dan rate-limited request;
- metadata/social preview;
- mobile layout.

### Langkah 9.6 — Production dan custom domain

- promote preview yang sudah diverifikasi;
- tambahkan custom domain jika tersedia;
- ikuti instruksi DNS Vercel secara persis;
- tentukan satu canonical host;
- update CORS, metadata base, canonical, dan sitemap origin;
- tunggu HTTPS valid sebelum website dibagikan.

### Langkah 9.7 — Setelah launch

- periksa Vercel build/function logs;
- monitor AI error dan rate limit tanpa mengumpulkan konten berlebihan;
- pastikan analytics sesuai privacy statement;
- uji contact path berkala;
- review `lastVerifiedAt` pada konten;
- update dependency melalui PR yang direview.

### Prompt AI IDE Phase 9

```text
[Paste the reusable prefix first]

PHASE 9 — Guide me through deployment without handling or printing secret values.

Audit the final repository, Vercel configuration, environment variable names, Sanity Studio config, CORS needs, and build commands. Produce a repository-specific deployment checklist. Guide me one manual dashboard step at a time and wait for confirmation. Help inspect build logs and run the live smoke-test matrix. Do not claim launch success until production URLs, content, deterministic fallback, AI endpoint, metadata, and mobile behavior are verified.
```

### Exit criteria

- frontend online melalui HTTPS;
- Studio dapat diakses editor yang berwenang;
- production content menggunakan dataset yang benar;
- secret hanya berada di environment store;
- deterministic flow bekerja ketika AI gagal;
- smoke test production lulus;
- rollback path diketahui.

### Checkpoint CP-9

```text
@GitHub Audit CP-9/launch pada alann39/iarchi main. Periksa commit final, CI, deployment configuration, environment variable names tanpa meminta nilainya, dan kesesuaian docs dengan implementasi. Aku akan memberikan URL dan hasil smoke test terpisah. Berikan status GO, GO WITH FOLLOW-UPS, atau NO-GO.
```

---

## 8. Format checkpoint review ke Codex

Push branch terlebih dahulu, lalu gunakan:

```text
@GitHub Tolong review repository alann39/iarchi.

Checkpoint: CP-<number>
Branch atau PR: <name-or-link>
Target phase: <one sentence>
Yang sudah aku uji manual: <list>
Known issue/keraguan: <list or none>

Tolong:
1. inspect diff dan surrounding code yang relevan;
2. periksa CI/build evidence di GitHub;
3. bandingkan implementasi dengan docs/DEVELOPMENT_GUIDE.md dan docs/REQUIREMENTS.md;
4. jelaskan temuan untuk beginner;
5. klasifikasikan sebagai blocker, should-fix, atau later improvement;
6. jangan mengubah kode sampai aku menyetujui fix plan.
```

Untuk pemeriksaan visual, sertakan screenshot atau screen recording. Source code tidak dapat membuktikan secara penuh spacing, animation, mobile keyboard, dan perceived smoothness.

---

## 9. Saat muncul ide atau modifikasi baru

Ide baru adalah hal normal. Yang harus dijaga adalah kesesuaian antara blueprint, modul, dan kode.

### Change-impact workflow

1. Jelaskan user problem, bukan hanya komponen yang diinginkan.
2. Minta Codex memeriksa repo terbaru.
3. Nilai dampak terhadap requirement, schema, route, security, test, dan deployment.
4. Klasifikasikan perubahan:
   - **small:** copy, style, atau behavior lokal;
   - **medium:** komponen atau content field baru;
   - **large:** architecture, data model, route, privacy, provider, atau deployment.
5. Untuk medium/large change, update requirement dan decisions lebih dulu.
6. Update modul jika urutan, prompt, validation, atau deployment berubah.
7. Implementasi di branch baru dan ulangi checkpoint terdekat.

### Prompt diskusi ide

```text
@GitHub Cek kondisi terbaru repo alann39/iarchi sebelum menilai ide ini.

Ide: <describe the idea>
User problem: <why it matters>
Desired behavior: <what visitors should experience>

Jangan ubah kode. Analisis dampaknya terhadap product scope, UX, Sanity schema, frontend architecture, AI grounding, privacy/security, tests, deployment, serta docs/DEVELOPMENT_GUIDE.md. Berikan opsi minimum, balanced, dan advanced, kemudian rekomendasikan satu pendekatan.
```

### Prompt update modul

```text
@GitHub Berdasarkan keputusan terbaru dan kondisi repo alann39/iarchi, update docs/DEVELOPMENT_GUIDE.md. Ubah hanya bagian terdampak, naikkan version dan last-updated date, tambahkan changelog, dan jelaskan mengapa urutan/prompt/checkpoint berubah. Buat melalui branch dan pull request dokumentasi terpisah.
```

---

## 10. Troubleshooting map

### Frontend tidak membaca data Sanity

Periksa berurutan:

1. project ID dan dataset;
2. file environment berada di workspace yang benar;
3. dev server sudah direstart;
4. token permission;
5. CORS origin;
6. publication/visibility filter;
7. server log.

### TypeScript error setelah schema berubah

Jalankan schema extraction dan type generation, lalu type-check. Jangan menambal generated type secara manual.

### Berjalan lokal tetapi gagal di Vercel

Bandingkan Node/package manager, root directory, environment variable, case-sensitive path, server/client boundary, CORS, dan build log.

### AI mengarang jawaban

Perlakukan sebagai product defect. Simpan pertanyaan dan output, periksa retrieved sources, tambahkan ke evaluation set, perketat retrieval/instruction/validation, kemudian retest. Jangan hanya menambah satu kalimat larangan di prompt.

### AI IDE mengubah terlalu banyak file

Berhenti. Baca `git status` dan `git diff`. Minta penjelasan setiap file. Pertahankan hanya perubahan yang masuk scope.

### Liquid Glass lambat atau sulit dibaca

Kurangi area blur, transparency, animated layer, dan pointer effect. Naikkan opacity surface. Visual identity tidak boleh mengalahkan readability dan mobile performance.

---

## 11. Definition of Done website

Website siap launch ketika:

- Chat dan Blog menjadi dua destinasi utama yang jelas;
- curated conversation mencakup perjalanan portfolio utama tanpa AI;
- jawaban AI grounded, scoped, validated, dan memiliki source;
- project, experience, résumé, contact, serta artikel memakai konten nyata;
- CMS editing dan preview bekerja;
- article/project URL publik dan indexable;
- mobile, keyboard, reduced motion, dan error path bekerja;
- tidak ada secret atau private data terekspos;
- lint, type-check, build, dan required test lulus;
- preview dan production smoke test lulus;
- deployment serta rollback didokumentasikan;
- guide, requirements, decisions, dan implementasi saling konsisten.

---

## 12. Living changelog

### 1.0.0 — 19 September 2026

- Membuat modul beginner pertama berdasarkan kondisi aktual repository.
- Menetapkan workflow developer-led dan AI-assisted.
- Menyusun phase dari local setup hingga production deployment.
- Menambahkan prompt IDE, exit criteria, checkpoint GitHub, troubleshooting, dan change-management workflow.


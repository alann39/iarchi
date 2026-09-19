# IARCHI · buku kerja pengembangan

Versi 2.0.0 · 19 September 2026 · owner: Awwal · status: siap untuk review spesifikasi.

## Mulai di sini

Bayangkan kamu sedang merakit meja dari paket yang sudah dibeli. Next.js dan Sanity
adalah komponen yang sudah ada di kotak. Dokumen ini adalah urutan merakitnya.
AI IDE membantu membaca petunjuk dan memasang satu bagian; kamu memeriksa apakah
kaki meja sudah lurus sebelum memasang permukaannya. Kita tidak mulai dengan
menyuruh AI menggambar meja lain.

**Cara pertama kali memakai paket ini:**

1. Baca halaman ini dan buka [referensi tampilan](design/reference.html) secara lokal.
2. Ikuti [SETUP.md](SETUP.md), mulai S-01. Jangan jalankan semua command sekaligus.
3. Pada sesi AI IDE pertama, lakukan pemeriksaan AGENTS.md di SETUP S-03.
4. Ambil satu task dari [PROMPT_PLAYBOOK.md](PROMPT_PLAYBOOK.md), dimulai T00.
5. Baca rencana AI, beri instruksi implementasi jika masuk scope, periksa diff dan UI.
6. Simpan bukti di [PROGRESS.md](PROGRESS.md). Push saat siap direview.
7. Kirim checkpoint ke Codex menggunakan [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md).

Penjelasan memakai Bahasa Indonesia. Prompt dan UI copy memakai Inggris. Tidak ada
prefix yang perlu ditempel setiap kali: aturan kerja berada di [AGENTS.md](../AGENTS.md).
Prompt task sudah merujuk file yang relevan. Dukungan auto-load berbeda antar-IDE;
satu kali verifikasi per sesi baru menghindari asumsi bahwa konteks pasti terbaca.

## Peta dokumen: semuanya sudah disediakan

| Dokumen | Ibarat sehari-hari | Apa yang kamu temukan |
|---|---|---|
| [REQUIREMENTS](REQUIREMENTS.md) | Daftar pesanan | Fitur wajib, batas scope, hasil yang dianggap benar |
| [ARCHITECTURE](ARCHITECTURE.md) | Peta kabel | Modul mana menghubungkan UI, CMS, dan AI |
| [DATA_MODEL](DATA_MODEL.md) | Buku kontak dengan tautan | Field, hubungan, ERD, validasi, migrasi |
| [DESIGN_SPEC](DESIGN_SPEC.md) | Ukuran pola baju | Koordinat, type scale, warna, material, state |
| [Reference UI](design/reference.html) | Contoh baju yang bisa dilihat | Welcome, thread, blog, article, project, mobile/dark/light |
| [CONTENT_INVENTORY](CONTENT_INVENTORY.md) | Bahan yang tersedia | Copy awal, fakta, data yang perlu kamu isi |
| [CONVERSATION_MAP](CONVERSATION_MAP.md) | Balasan cepat WhatsApp | Prompt, jawaban, kartu, pertanyaan lanjutan |
| [AI_SPEC](AI_SPEC.md) | Aturan asisten saat open-book | AI SDK, retrieval, kontrak, validasi, biaya, error |
| [AI_SETUP](AI_SETUP.md) | Memasang akses layanan | Dashboard provider/limiter, env lokal/Vercel, uji aktivasi |
| [SETUP](SETUP.md) | Panduan menyalakan perangkat | Instalasi Windows, Git, Sanity, env, IDE |
| [PROMPT_PLAYBOOK](PROMPT_PLAYBOOK.md) | Resep per porsi | 27 task terbatas dengan prompt dan gate |
| [DEPLOYMENT](DEPLOYMENT.md) | Memindahkan draft ke etalase | Vercel, Studio, DNS, env, smoke test, rollback |
| [REVIEW_CHECKLIST](REVIEW_CHECKLIST.md) | Daftar cek sebelum kirim | Functional, visual, schema, AI, checkpoint |
| [DECISIONS](DECISIONS.md) | Catatan kesepakatan | Pilihan yang sudah ditetapkan dan keputusan owner tersisa |
| [PROGRESS](PROGRESS.md) | Resi pekerjaan | Apa yang sudah benar-benar dikerjakan dan dibuktikan |
| [SOURCES](SOURCES.md) | Daftar referensi | Dasar Apple, Sanity, AI SDK, dan hosting |

Dokumen ini mengatur urutan belajar; jika detail field diperlukan, buka DATA_MODEL,
bukan meminta AI menebak. Mengisi fakta pribadi berbeda dari mendraft spesifikasi.
Spesifikasi sudah lengkap; foto, email, periode kerja, dan kredensial hanya kamu yang
bisa memastikan. Nilai yang belum diketahui ditandai `PENDING_OWNER`, tidak diisi AI.

## Posisi awal yang benar-benar diperiksa

Audit main: `fab2d8ca0d979053a360e836d5fcb9d088bcf1e6`.
PR #1 masih terbuka saat revisi dimulai; v2 memperbarui PR yang sama.
Ini audit source, bukan bukti bahwa komputer lokal atau akun Sanity sudah dikonfigurasi.

| Yang sudah ada | Implikasi |
|---|---|
| npm workspaces frontend + studio | Jalankan instalasi dari root repository |
| Next ^16.2.7, React ^19.2.7, Tailwind ^4.3.0 | Jangan gunakan tutorial Pages Router/Tailwind v3 |
| Sanity frontend ^5.28.0; Studio ^5.31.1 | Catat versi terpasang dari lockfile; jangan samakan versi tanpa alasan |
| post, person, page, settings | Extend post/settings; detail migrasi di DATA_MODEL |
| `/posts/[slug]`, `/[slug]` starter | Blog baru perlu resolver, link, sitemap, redirect yang konsisten |
| Root scripts lint/type-check; build di workspace | `npm run build` di root belum tersedia |
| Frontend predev dan Studio predev menulis schema yang sama | Pertama generate berurutan, lalu dev server terpisah |
| `.github/workflows/prettier.yml` memakai secret ECOSPARK | Audit sebelum merge; jangan membuat credential hanya untuk bot bawaan |
| AGENTS.md dan CLAUDE.md → @AGENTS.md | Pertahankan rule Next.js; tambahkan perjanjian kerja di AGENTS |

## Cara membaca code tanpa harus ahli

- **Component**: seperti template pesan yang dipakai berulang. Ganti satu tombol,
  semua tempat yang memakai tombol itu ikut konsisten.
- **Prop**: isian template pesan, misalnya nama project atau URL.
- **State**: posisi terakhir yang diingat layar, misalnya input belum dikirim.
- **Server**: dapur; token disimpan di sini. **Browser**: meja pelanggan; jangan
  taruh kunci dapur di meja meskipun ditutup CSS.
- **Schema**: kolom formulir yang boleh diisi. **Document**: satu formulir terisi.
- **Reference**: memilih nama dari kontak, bukan mengetik ulang seluruh biodata.
- **Query**: permintaan “ambil tiga artikel yang sudah dipublish”.
- **Build**: menyiapkan paket kiriman; aplikasi yang jalan saat diedit belum tentu
  dapat dikemas tanpa error.
- **CI**: komputer GitHub mengulang pemeriksaan; hijau tidak membuktikan desain bagus.

## Roadmap: satu task, satu hasil yang bisa diamati

| Phase | Task | Analogi singkat sebelum mulai | Hasil terlihat | Gate |
|---|---|---|---|---|
| 0 Setup | T00–T02 | Cek stopkontak sebelum menyalakan alat | Starter dan Studio terbuka, env aman | CP-0 |
| 1 Isi | T03–T04 | Cek bahan masakan sebelum mulai | Fakta disetujui, kontrak typed disiapkan | CP-1 |
| 2 CMS | T05–T07 | Susun kontak agar tidak menulis nomor dua kali | Form schema, referensi, query bekerja | CP-2 |
| 3 UI | T08–T10 | Cocokkan pola dan ukuran sebelum menjahit | Shell, welcome, composer sesuai visual | CP-3 |
| 4 Chat | T11–T12 | Pilih quick reply, lalu lanjutkan obrolan | Thread tanpa panggilan LLM | CP-4 |
| 5 Portfolio | T13–T14 | Buka label barang untuk melihat rinciannya | Project, experience, CV, contact | CP-5 |
| 6 Blog | T15–T16 | Menulis draft lalu menerbitkan | Artikel, preview, context handoff | CP-6 |
| 7 AI | T17–T20 | Asisten menjawab dengan buku terbuka | Jawaban valid dengan sumber | CP-7 |
| 8 QA | T21–T23 | Coba resleting dan jahitan sebelum dipakai | Visual, aksesibilitas, CI, security | CP-8 |
| 9 Online | T24–T26 | Uji paket kiriman sebelum diterima orang lain | Preview, production, rollback | CP-9 |

Jangan kirim “kerjakan Phase 3 semuanya”. Kirim T08 dahulu; setelah hasilnya lolos,
baru T09. Setiap task di playbook menjelaskan konteks, file, urutan, larangan perluasan,
acceptance, dan kapan berhenti. Tidak ada task menyuruh AI menulis ulang requirement.

## Siklus sesi 30–60 menit

1. Buka repo root, terminal, dan browser. Baca PROGRESS untuk task terakhir.
2. `git status` → pahami perubahan yang belum tersimpan. Jangan pull saat bingung
   dengan perubahan lokal; simpan ke branch terlebih dahulu bersama AI.
3. Tempel satu prompt task. AI menyampaikan rencana dan daftar file.
4. Kamu jawab “Implement Txx sesuai rencana ini.”
5. Buka Source Control → klik setiap file. Diff hijau berarti tambahan, merah berarti
   penghapusan; merah bukan selalu bug. Minta penjelasan blok yang belum dipahami.
6. Jalankan command spesifik task, lalu browser check. Simpan screenshot untuk UI.
7. Catat hasil sebenarnya, termasuk “belum diuji”, di PROGRESS.
8. Commit/push hanya setelah kamu meminta. Checkpoint dilakukan saat task phase selesai.

Contoh feedback yang berguna: “Pada viewport 390×844, tombol Send berjarak 6px dari
tepi, spec 8px. Perbaiki hanya composer padding dan kirim screenshot ulang.”
Hindari feedback “buat lebih Apple” karena membuka interpretasi desain terlalu luas.

## Mengubah ide tanpa kehilangan arah

Kirim: “Cek repo alann39/iarchi branch X commit Y. Ide: … Masalah pengguna: …
Analisis dahulu, lalu update dokumen yang terdampak setelah kita sepakat.” Codex
membandingkan implementasi nyata, menyarankan delta, dan menulis revisi modul.
Task baru mendapat ID T27 dst.; task lama tidak dinomori ulang. Update DECISIONS,
REQUIREMENTS, relevant specs, playbook, CHANGELOG. Review ulang checkpoint terdampak.

## Apa yang berubah dari v1

Analogi dipindahkan ke contoh harian; prefix dihapus; seluruh dokumen fondasi sudah
ditulis; schema dibekukan dengan ERD; desain diberi ukuran dan visual; prompt dipecah
per task; setup Windows dan deployment diperinci; Vercel AI SDK diberi kontrak konkret.
Phase 1 kini memverifikasi isi, bukan meminta AI IDE mendraft dokumen.

Mulai dari SETUP S-01 dan T00. Status implementasi tetap **belum dimulai**.

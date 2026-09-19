# Sources and verification notes

Diakses untuk revisi: 19 September 2026. Versi, dashboard dan paket dapat berubah;
verifikasi kembali saat task terkait dijalankan. Semua ukuran UI IARCHI adalah
keputusan desain proyek, bukan klaim spesifikasi resmi Apple.

## Repo yang benar-benar diperiksa

- [IARCHI repository](https://github.com/alann39/iarchi), baseline
  `fab2d8ca0d979053a360e836d5fcb9d088bcf1e6`: package manifests, lockfile/scripts,
  schemas, routes, env examples, live client, instructions dan workflows.
- [PR #1](https://github.com/alann39/iarchi/pull/1): modul v1 menjadi dasar revisi;
  revisi mempertahankan PR ini agar riwayat review tetap utuh.

## Desain

- [Apple — Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/)
  — primary; transcript dibaca. Prinsip yang diterapkan: material membantu hierarki
  controls/navigation; konten tetap jelas; hindari material bertumpuk dan dukung
  preferensi aksesibilitas. Implementasi web IARCHI memakai CSS approximation.
- [Superdesign — Apple Design System](https://superdesign.dev/blog/apple-design-system)
  — secondary; dibaca sebagai inspirasi struktur visual, bukan standar resmi.
  Hex, radius, font size dan spacing IARCHI ditetapkan di DESIGN_SPEC.
- [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
  dan [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
  — bacaan lanjutan. Halaman berbasis JavaScript tidak menyediakan isi lengkap
  melalui pembaca yang digunakan; tidak diklaim telah diaudit seluruhnya.

## Vercel AI SDK — sumber primer yang dibaca

Dokumentasi resmi dibaca melalui source repository karena endpoint ai-sdk.dev
tidak terbaca lengkap pada sesi audit.

- [Structured data](https://github.com/vercel/ai/blob/main/content/docs/03-ai-sdk-core/10-generating-structured-data.mdx)
  — generateText, Output.object, final schema validation.
- [Streaming data](https://github.com/vercel/ai/blob/main/content/docs/04-ai-sdk-ui/20-streaming-data.mdx)
  — custom data parts, transient status, UI message streams.
- [Transport](https://github.com/vercel/ai/blob/main/content/docs/04-ai-sdk-ui/21-transport.mdx)
  — useChat transport dan request preparation.
- [ai package](https://github.com/vercel/ai/blob/main/packages/ai/package.json),
  [React package](https://github.com/vercel/ai/blob/main/packages/react/package.json),
  [Google provider](https://github.com/vercel/ai/blob/main/packages/google/package.json)
  — snapshot source main: ai 7.0.107, React adapter 4.0.110, Google adapter 4.0.76.
  Ini bukan hasil npm registry resolution. T17 memverifikasi dan mencatat exact
  installed versions, Node compatibility dan API signatures sebelum implementasi.

SDK menangani generation/transport, bukan otomatis membuktikan factual correctness.
Retrieval, public filtering, source validation, limiter dan owner evaluation tetap
merupakan keputusan arsitektur IARCHI yang dijabarkan di AI_SPEC.

## Setup dan hosting

- [Node.js downloads](https://nodejs.org/en/download) — Node 24 LTS baseline.
- [Sanity environment variables](https://www.sanity.io/docs/studio/environment-variables)
  — Studio env prefix dan build-time configuration.
- [Sanity CORS](https://www.sanity.io/docs/content-lake/cors)
  — origins/credentials; server-to-server fetch tidak memerlukan browser CORS.
- [Sanity datasets](https://www.sanity.io/docs/content-lake/datasets)
  — public dataset bisa dibaca publik; query filter bukan ACL.
- [Vercel monorepos](https://vercel.com/docs/monorepos)
  dan [project settings](https://vercel.com/docs/project-configuration/project-settings)
  — root directory dan akses source di luar root dalam workspace.
- [Vercel deployment promotion](https://vercel.com/docs/deployments/promoting-a-deployment)
  — promotion/redeployment; public build-time env tidak berubah hanya dengan
  mengalihkan deployment. Ikuti UI akun aktual saat menjalankan DEPLOYMENT.

## Hal yang sengaja tidak diasumsikan

Panduan aktivasi tambahan diverifikasi pada tanggal yang sama:
[Google API key setup](https://ai.google.dev/gemini-api/docs/api-key),
[Upstash get started](https://upstash.com/docs/redis/overall/getstarted), dan
[Upstash REST credentials](https://upstash.com/docs/redis/features/restapi).
Langkah aktual dan batasan account dicatat di AI_SETUP.

Model Google aktif, harga/kuota provider, paket Vercel/Upstash, domain, CORS akun,
deployment protection yang tersedia dan nilai env owner belum diverifikasi.
Tutorial meminta pemeriksaan pada akun aktual sebelum tindakan yang bergantung
pada hal-hal tersebut. Tidak ada janji free-tier atau biaya nol.

# Deploy IARCHI · runbook dari local sampai online

Prerequisite CP-8 passed, owner-approved public content, build lokal berhasil.
Module ini instruksi, bukan bukti deployment. Label menu vendor dapat berubah;
cocokkan konsep settings dengan [Vercel project settings](https://vercel.com/docs/project-configuration/project-settings).

## D-01 · Tiga tempat yang berbeda

Seperti draft pesan, pesan yang dikirim ke teman untuk dicek, lalu posting publik:
local adalah komputermu; preview untuk memeriksa versi calon rilis; production untuk
pengunjung. Preview tetap URL online—jangan taruh rahasia dalam copy karena “preview”.

1. Git status bersih, branch release dari main yang sudah review.
2. Jalankan lint, types, tests, frontend build, Studio build.
3. Catat commit SHA `git rev-parse HEAD`, Node24, npm11.6.2 dan env names (tanpa values).
4. Buat manifest release di PROGRESS: SHA, content approvals, planned domains, rollback SHA.

## D-02 · Deploy Studio

1. Login [Sanity Manage](https://www.sanity.io/manage), pilih project IARCHI yang sama.
2. Tentukan hostname Studio yang tersedia, misalnya `iarchi-awwal` (contoh, belum reserved).
3. Di `studio/.env.local` isi SANITY_STUDIO_STUDIO_HOST dengan hostname tanpa protokol.
4. Root terminal: `npm run deploy --workspace=studio`.
5. CLI login browser jika diperlukan. Periksa project ID dan dataset sebelum konfirmasi.
6. Catat URL aktual dari CLI, buka URL itu, login, pastikan schema terbaru ada.
7. Studio hosting dan content storage bukan login public visitor. Sign out browser
   lain: editor tidak boleh dapat mengedit tanpa akun authorized.

Perubahan `SANITY_STUDIO_*` adalah build-time: deploy ulang Studio setelah mengubah
preview URL; redeploy frontend saja tidak mengubah bundle Studio.

## D-03 · Import existing repo ke Vercel

1. Login [Vercel](https://vercel.com), Add New → Project → import GitHub `alann39/iarchi`.
2. Pilih akun/team yang kamu kontrol dan review plan/limits. Jangan clone template lagi.
3. Framework preset Next.js; **Root Directory frontend**.
4. Settings build: aktifkan **Include source files outside of the Root Directory**
   (atau setting equivalent) karena prebuild/typegen membaca `../sanity.schema.json`
   dan npm workspaces membutuhkan root lock/package. Jika UI belum tampak saat import,
   atur di Project Settings sebelum rebuild.
5. Node version24.x. Build command default `npm run build` dieksekusi dari frontend;
   output .next terdeteksi otomatis. Install harus memakai root workspace lock:
   periksa auto-detected monorepo install log; jika perlu override dari frontend:
   `cd .. && npm ci`. Jangan buat lock kedua di frontend.
6. Masukkan Environment Variables tabel D-04 sebelum deploy.

**Koreksi v1:** import pertama dapat langsung membuat deployment Production dari
default branch. Itu bukan otomatis Preview. Aktifkan Deployment Protection yang
tersedia sebelum berbagi URL; minimal biarkan AI_ENABLED=false dan konten belum siap
tetap hidden. Buat push branch non-production untuk memperoleh Preview deployment.
Set production branch main. Jangan mengira rename branch otomatis melindungi URL.
Jika plan tidak menawarkan protection yang dibutuhkan, jangan masukkan unpublished
material sensitif; gunakan preview dengan public-safe copy saja.

## D-04 · Environment matrix

| Name | Development lokal | Vercel Preview | Vercel Production |
|---|---|---|---|
| NEXT_PUBLIC_SANITY_PROJECT_ID | project ID | same public project | same public project |
| NEXT_PUBLIC_SANITY_DATASET | production | production published read | production |
| NEXT_PUBLIC_SANITY_API_VERSION | 2025-09-25 | same pinned date | same pinned date |
| NEXT_PUBLIC_SANITY_STUDIO_URL | localhost3333 | actual deployed Studio URL | same Studio |
| SANITY_API_READ_TOKEN | read token | restricted read token | read token |
| SITE_URL | http://localhost:3000 | chosen preview origin for testing | canonical final origin |
| AI_ENABLED | false initially | false, then approved smoke | true only CP-7+shared limiter |
| GOOGLE_GENERATIVE_AI_API_KEY | local secret | approved provider secret | approved provider secret |
| AI_MODEL | selected model ID | selected ID | selected ID |
| AI_MAX_OUTPUT_TOKENS | 800 | 800 | 800 |
| UPSTASH_REDIS_REST_URL/TOKEN | only if testing shared limiter | preview namespace | production namespace |
| RATE_LIMIT_SALT | local secret | unique secret | unique secret |

Preview/prod counters must have distinct key namespace derived server-side from known
environment. No AI key in NEXT_PUBLIC or SANITY_STUDIO variables. No private keys in
build log. Use sensitive flags where dashboard supports. Environment change requires
redeploy; existing deployments retain their built public configuration.

Studio local deploy variables: project ID/dataset plus Studio hostname and
SANITY_STUDIO_PREVIEW_URL. Set preview URL to a stable approved preview or final site,
then redeploy Studio. API keys for visitor AI never go in Studio.

## D-05 · Provider and limiter activation

Ikuti langkah dashboard dan env lengkap di [AI_SETUP.md](AI_SETUP.md).

1. Owner selects provider account, model in its model catalog, billing/privacy terms.
2. Create key in provider console, store only locally/dashboard secret field.
3. Verify availability with ONE minimal approved request through server endpoint,
   not public browser SDK. Record model ID/date/test outcome, never key.
4. Create approved Upstash Redis instance via vendor dashboard (or Vercel Marketplace
   integration), inspect plan/region, copy REST URL/token to environment fields.
5. Use separate preview/prod key prefixes and RATE_LIMIT_SALT. Check rate-limit test
   with model mocked first. Confirm global daily cap and failure behavior.
6. Enable AI only after E01–E18 pass. SDK installation is not provider activation.
7. If declining paid/shared services, keep AI off; curated website remains useful,
   but full AI-enabled MVP criterion remains pending.

## D-06 · Sanity origins and preview

1. In API → CORS add exact final frontend origin if browser live/preview requires it.
2. Credentials ON only for trusted authenticated preview origin; public read-only
   browser usage OFF. No `https://*.vercel.app` credentials wildcard.
3. Add exact preview origin you will review; remove obsolete ones later.
4. Studio hosted via sanity deploy usually registers its own origin; verify it exists.
5. Open Studio Presentation → unpublished edit should appear in authenticated preview.
6. Open incognito public page → unpublished edit must be absent. Ask AI same question →
   unpublished phrase absent even from editor browser.

For server-only CMS requests no CORS entry is needed. Never fix auth problems by
making private data public. See [Sanity CORS](https://www.sanity.io/docs/content-lake/cors).

## D-07 · Preview smoke test and release

1. Push release branch; Vercel deployment details must label Preview.
2. Wait for build log success. Check workspace root, schema file, environment, Node.
3. Open URL on phone and desktop, run REVIEW_CHECKLIST L01–L12.
4. Share URL and exact SHA with Codex CP-9 prelaunch review.
5. Once approved, merge release to main. Let Vercel create fresh Production deployment
   using Production env. This is preferred over promoting a build whose NEXT_PUBLIC
   values were compiled for another origin.
6. If using Promote, verify env/build origin assumptions explicitly and rebuild if
   necessary; promotion is not an env substitution. [Vercel promotion](https://vercel.com/docs/deployments/promoting-a-deployment).
7. Repeat smoke test on production. Record deployment URL, SHA, content revision,
   timestamp, and pass/fail. No claim launch complete based solely on build success.

## D-08 · Custom domain (optional)

1. Settings → Domains → Add your domain; only one you own.
2. Choose canonical apex or www; redirect other host.
3. In registrar DNS add exactly records Vercel displays; don't guess fixed IPs.
4. Preserve email MX/TXT records. Don't delete unrelated DNS entries.
5. Wait for verification and HTTPS certificate; propagation time varies.
6. Set SITE_URL to canonical https origin; redeploy frontend so metadata/sitemap update.
7. Add new Sanity origin and change Studio preview URL; redeploy Studio.
8. Verify apex/www redirect, TLS, canonical, OG links, CV, AI, and preview again.

## D-09 · Rollback and maintenance

Analogi: kembali ke versi dokumen kemarin tidak mengembalikan isi album online
yang sudah diedit. Code deployment dan data CMS adalah dua perubahan berbeda.

1. Jika production rusak, matikan AI flag bila masalah AI, redeploy safe build.
2. Vercel Deployments → pilih known-good production → rollback/promote sesuai dashboard
   dan plan; pastikan env dependencies masih tersedia.
3. Uji homepage/blog/contact dan catat incident/deployment IDs.
4. Git perbaikan memakai revert commit/PR yang direview, bukan force reset main.
5. Jika schema/data yang bermasalah, rollback code mungkin tidak cukup. Gunakan
   Sanity document history/export dan mapping migrasi, jangan import --replace otomatis.
6. Backup sebelum perubahan schema berikutnya. Arsip tidak masuk public git.

First week: periksa error count, limiter, link CV/contact, data freshness, model usage.
Monthly: content verification dan dependency updates via isolated PR. Analytics awal
optional; jangan menambahkan session replay atau transcript logging diam-diam.

# Prompt playbook · T00–T26

Baca AGENTS.md satu kali di awal sesi sesuai SETUP. Setiap blok di bawah siap
ditempel ke AI IDE; tidak perlu prefix tambahan. Prompt meminta rencana dahulu.
Sesudah kamu memahami rencananya, jawab `Implement Txx sesuai rencana ini.`
Kalau ingin membahas tanpa perubahan, katakan `Plan only`. Bukti hasil dicatat di
PROGRESS, bukan mengubah spesifikasi agar cocok dengan implementasi yang meleset.

## T00 · Kenali isi repo

Seperti membuka kardus perangkat baru: cek barang yang ada sebelum membeli aksesori.
Hasil yang kamu cari adalah peta repo singkat dan daftar hal yang belum siap.

```text
Task T00 — read-only repository audit.
Read AGENTS.md, docs/DEVELOPMENT_GUIDE.md, ARCHITECTURE.md, SETUP.md and PROGRESS.md.
Inspect git status, branch, package.json files, lockfile, tracked env examples,
schema registration, routes, CI and existing instructions. Compare the actual
checkout with the audited baseline SHA in the guide. Explain any drift before
proposing changes. Report the exact package manager, installed versus declared
versions, available scripts and required environment VARIABLE NAMES only.
Do not install, modify files, print env values or assume the Sanity account exists.
Explain frontend versus studio with one everyday example. Give the owner a short
list of commands for T01 and identify existing local changes that must be preserved.
Acceptance: a beginner can identify where UI, CMS, env and scripts live. Stop after
the audit; do not implement T01 or rewrite the specifications.
```

## T01 · Jalankan starter

Seperti pertama kali menyalakan printer: pasang perangkatnya, lalu cetak satu halaman uji.
Ikuti SETUP S-01–S-09 satu bagian setiap kali; jangan mengirim secret ke chat.

```text
Task T01 — guided local setup using docs/SETUP.md.
Read the T00 findings. Explain the next setup action, its location in Windows/IDE,
expected result and recovery if it fails. Ask only for missing non-secret choices.
Guide Node 24 LTS, the repository's npm version, root npm ci, Sanity project/dataset,
safe creation of local env files and exact-origin CORS. Preserve existing env files.
Never read tokens aloud or add them to tracked files. Verify ignore rules by path.
Generate Studio schema and frontend types sequentially, then start the two dev
servers as documented without racing predev hooks. Open localhost 3000 and 3333.
Run existing lint, type checks and workspace builds; distinguish missing env from
source defects. Record actual outcomes in PROGRESS only after the owner authorizes
the edit. Acceptance: starter and Studio load, checks have recorded outcomes, and
no secrets appear in the diff. Stop; propose baseline fixes separately under T02.
```

## T02 · Rapikan jalur pemeriksaan

Seperti mengganti label tombol yang salah: kita memperbaiki cara memakai starter,
bukan mengganti mesinnya. Gate sesudah task ini: CP-0.

```text
Task T02 — minimal baseline tooling repairs.
Read SETUP, ARCHITECTURE, existing package scripts and both GitHub workflows.
Plan changes limited to package scripts, .gitignore, CI and corresponding factual
PROGRESS entries. Keep npm workspaces. Provide a deterministic sequential schema
generation path before concurrent dev; avoid two writers to sanity.schema.json.
Ensure .env.example can be tracked while real .env variants remain ignored.
Replace template formatting automation requiring unavailable ECOSPARK app secrets
with a read-only format check using existing tooling; do not create a bot or secret.
Use npm ci in CI and a Node version compatible with the documented baseline.
If adding root build, explicitly order schema generation, frontend and Studio builds.
Acceptance: git check-ignore confirms intended env handling; lint, type checks,
format and both builds run with configured env. Show any pre-existing failures
separately; no broad dependency upgrade, UI edit or lint suppression. Stop at CP-0.
```

## T03 · Verifikasi bahan konten

Seperti mengecek CV sebelum dikirim: AI boleh merapikan penempatan, tetapi tanggal
kerja dan pencapaian harus berasal darimu.

```text
Task T03 — owner content verification, not specification drafting.
Read CONTENT_INVENTORY, CONVERSATION_MAP and DATA_MODEL. Show the PENDING_OWNER
items grouped into identity/career, projects, assets and public contact. Ask a small
batch at a time. Preserve exact owner-provided dates, organization names, project
status and links. Do not infer current employment, impact metrics or availability.
Propose a diff only for answers explicitly supplied in this session. Leave unknown
values pending and their associated content unpublished. Explain which missing items
block launch and which only hide an optional card. Check supplied URLs syntactically;
do not upload private files or republish personal information without instruction.
Acceptance: the content ledger distinguishes approved facts, pending facts and
demo-only copy; every proposed published claim has an owner source. Stop after
updating the authorized entries. Do not generate biography facts or seed the CMS.
```

## T04 · Buat kontrak data

Seperti formulir pengiriman: nama dan alamat harus berada di kolom yang benar agar
paket tidak salah tujuan. Gate: CP-1.

```text
Task T04 — typed domain contracts.
Read DATA_MODEL, CONVERSATION_MAP, REQUIREMENTS and ARCHITECTURE. Plan domain
TypeScript types and runtime validators in frontend using the prescribed module
layout. Cover public content DTOs, the twelve topic IDs, block discriminated unions,
ResponseEnvelope, session storage version and ChatRequest/ModelAnswer from AI_SPEC.
Keep domain contracts independent of the provider and React. Do not duplicate
generated Sanity types; map them at the query boundary. Reuse a compatible installed
validator or pin the documented Zod-compatible dependency without unrelated updates.
Add a minimal test runner only if absent; test unknown block rejection, request
limits, invalid source IDs and storage-version rejection. No UI, API provider call,
CMS writes or new product requirements. Acceptance: type check passes and meaningful
contract tests reject malformed examples while accepting a valid curated envelope.
Show the files and tests; stop at CP-1.
```

## T05 · Formulir CMS inti

Seperti menyimpan nomor di kontak: profil cukup ditulis satu kali, bagian lain memilihnya.

```text
Task T05 — core Sanity schemas.
Read DATA_MODEL and existing Studio schema registration/desk structure. Add profile,
skillGroup, service and category schemas, and extend the existing settings schema.
Use the exact field names, validations and singleton IDs defined in DATA_MODEL.
Preserve siteSettings and existing starter fields. Reuse existing category only if
its shape matches; document the mapping instead of creating duplicate types.
Implement visibility/reviewState defaults and editorial help text explaining that
hidden content in a public dataset is not private. Configure singleton navigation
and creation actions consistently. Do not import sample data or delete person/page.
Acceptance: Studio forms show required fields and reference selectors; invalid
entries display useful errors; schema extraction succeeds. Demonstrate with local
drafts only when requested; never publish owner facts automatically. Regenerate
types sequentially, report the diff and stop before the next schema group.
```

## T06 · Relasi portfolio dan artikel

Seperti album foto dengan keterangan: satu project punya beberapa gambar, tetapi
nama pemiliknya tetap mengambil dari kontak yang sama.

```text
Task T06 — related content and conversation schemas.
Read DATA_MODEL's ERDs, field tables, embedded blocks and migration notes.
Implement experience, project, resume, conversationTopic and the specified post
extensions. Keep post's existing type identity and retain legacy author/person
compatibility while adding authorProfile. Enforce slug, dates, PDF type/size,
bounded selections and allowed conversation topic IDs. Use reference fields rather
than copied documents. Validate start/end dates and distinguish present employment
from missing end date. Preserve existing asset references and old content.
Show migration mapping before any data operation; this task changes schemas only.
Acceptance: Studio can represent every ERD relationship, rejects malformed blocks,
and extracts a valid schema. Show how an empty required field prevents publishing.
No destructive seed, no --replace import, no public publication. Stop after type
generation and schema validation, with pending content listed explicitly.
```

## T07 · Ambil hanya data yang layak tampil

Seperti memilih foto untuk album publik: pilihan album tidak membuat foto asli menjadi
rahasia. Data privat memang tidak boleh dimasukkan ke dataset publik. Gate: CP-2.

```text
Task T07 — published content queries and mapping.
Read DATA_MODEL, ARCHITECTURE and REQUIREMENTS. Implement centralized GROQ queries
and DTO mapping for profile/settings, topics, projects, experience, skills/services,
resume, blog index/detail and related records. Public results require the specified
public/verified rules; scheduled posts must not appear early. Check referenced
documents independently so a public topic cannot expose a hidden project.
Keep editor preview queries separate from public and AI queries. Follow existing
Sanity integration and relevant repo skills before modifying live-query behavior.
Generate types sequentially. Use controlled fixtures to verify draft, hidden,
unverified, future-published and dangling-reference cases, without production writes.
Acceptance: rejected records never reach public DTOs; empty results return typed
empty states rather than fabricated content. Explain public dataset limitations.
Stop at CP-2 and show query tests, schema diff and outstanding owner content.
```

## T08 · Ukuran, warna, dan kerangka

Seperti memilih ukuran cetakan kue sebelum memanggang: semua layar memakai ukuran dasar
yang sama. Buka reference.html berdampingan dengan hasilnya.

```text
Task T08 — design tokens and application shell only.
Read DESIGN_SPEC completely and open docs/design/reference.html in both themes.
Implement semantic CSS tokens, system font stack, responsive content widths, header
and page background in the existing frontend structure. Use the exact color,
spacing, radius and typography values; keep Tailwind v4 conventions. Implement
system/light/dark theme persistence without a hydration flash. Glass is restricted
to the specified navigation/composer controls; content surfaces remain solid.
Do not add hero decoration, gradients, bento grids, fake status badges or new copy.
Acceptance: at 1440x900 and 390x844 the shell matches the specified coordinates,
has no horizontal overflow, preserves 44px targets and supports reduced transparency.
Provide screenshots in both themes and computed measurements for header and column.
Stop for owner visual review; do not proceed to content or auto-approve snapshots.
```

## T09 · Welcome dan navigasi

Seperti halaman depan buku: orang langsung tahu buku ini tentang siapa dan bisa memilih
bagian yang ingin dibaca.

```text
Task T09 — welcome screen and primary navigation.
Read DESIGN_SPEC's welcome/header blueprint, approved CONTENT_INVENTORY and
REQUIREMENTS route map. Build the welcome identity, headline, intro, three topic
buttons and footer actions in the existing shell. Use approved CMS content through
T07 mappings; missing optional content is omitted gracefully. Only Chat and Blog
are primary destinations. Do not invent availability, metrics, biography or links.
Use the specified type hierarchy and exact wrapping widths; no stock portrait.
Use the AA placeholder only where the specification permits. Topic clicks may emit
a typed callback now; do not implement AI or a second chat state store.
Acceptance: keyboard focus order is logical, active navigation uses aria-current,
welcome fits at reference sizes and long names wrap without collision. Capture
desktop/mobile screenshots. Stop after showing visual differences from the reference.
```

## T10 · Composer dan pengaturan

Seperti kotak pesan WhatsApp: input, tombol kirim, dan pengaturan harus mudah dipakai
bahkan saat keyboard ponsel terbuka. Gate: CP-3.

```text
Task T10 — composer and settings interactions.
Read DESIGN_SPEC composer/settings states and REQUIREMENTS keyboard/accessibility
rules. Implement controlled textarea, labelled send/stop controls, character limit,
focus states and settings sheet for theme and clear conversation. Include persistent
reduce-transparency preference and the privacy copy from REQUIREMENTS in settings.
Match specified padding and min-height; measure actual composer height to reserve transcript
space. Account for safe-area and mobile visual viewport/keyboard resizing.
Enter submits, Shift+Enter adds newline, IME composition must not submit. Disable
empty/whitespace submissions. Settings must trap focus when modal, close with Escape
and restore focus. Clear requires the specified confirmation. Wire typed callbacks
only; no provider calls or transcript duplication. Acceptance: keyboard-only and
390px mobile interaction works with no covered content; reduced motion/transparency
states work. Record screenshots and manual checks. Stop at CP-3 for owner approval.
```

## T11 · Obrolan tanpa AI

Seperti tombol balasan cepat: pilihan yang sudah tersedia punya jawaban yang sudah ditulis.

```text
Task T11 — deterministic conversation routing.
Read CONVERSATION_MAP and ARCHITECTURE's single-reducer design. Implement the twelve
curated topics, exact alias normalization, follow-up IDs and typed block dispatch.
Support the documented hash deep links and browser back behavior without an AI call.
Resolve topic content from published CMS mappings; unavailable topic data returns
the specified empty/fallback state. Keep one canonical transcript reducer with
stable turn IDs. Preserve the difference between exact aliases and free-form input;
never route arbitrary text containing 'risk' to the risk topic automatically.
Unknown questions show the documented AI-unavailable fallback until the AI phase.
Acceptance: every approved topic renders its intended block sequence, related
references are filtered and each click creates one turn. Test alias normalization,
unknown input and rapid duplicate clicks. No model dependency, no invented answers
and no second history store. Show the reducer event flow; stop before persistence.
```

## T12 · Simpan sesi dan atur scroll

Seperti penanda halaman: kembali ke halaman terakhir boleh, tetapi tidak berarti buku
harus dikirim ke server. Gate: CP-4.

```text
Task T12 — session recovery, scrolling and cancellation.
Read REQUIREMENTS storage contract and CONVERSATION_MAP state transitions.
Implement versioned sessionStorage with the prescribed TTL, turn and byte limits;
store minimal IDs/text, rehydrate current public references and reject malformed or
expired payloads. Handle blocked storage without crashing. Clear confirmation must
erase the session and cancel pending work. Implement near-bottom auto-scroll using
the 80px threshold; if the reader scrolls up, show a new-message action rather than
forcing scroll. Deduplicate retries with stable IDs and ignore late canceled replies.
Acceptance: reload restores a valid session, removed CMS records disappear safely,
bad storage resets gracefully and keyboard focus survives new messages. Test clear
during pending work and out-of-order completion. Do not persist raw transcripts on
the server. Stop at CP-4 with manual steps and focused reducer/storage tests.
```

## T13 · Kartu dan halaman project

Seperti label singkat di rak lalu halaman rincian barang: kartu memberi gambaran,
halaman detail menyediakan isi yang bisa dibagikan.

```text
Task T13 — portfolio blocks and public project pages.
Read DESIGN_SPEC thread/project blueprints, DATA_MODEL and approved content ledger.
Implement project, experience, skill, service and image blocks using shared semantic
components. Implement /work/[slug] with server-rendered published content, correct
metadata, image dimensions/alt text and not-found handling. Project status must come
from verified CMS data; never imply FINESHYT or Lil Cash is live without approval.
Do not fabricate screenshots, testimonial quotes, results or external URLs. Respect
the defined card geometry and responsive layout rather than introducing a grid.
Acceptance: canonical project links work outside chat, hidden/unverified projects
404, missing images show the specified text-based treatment and long titles wrap.
Verify both themes, keyboard links, loading/empty/error states and build output.
Stop after showing page and thread screenshots plus route checks.
```

## T14 · Résumé dan kontak

Seperti memberikan kartu nama: tombol harus menuju alamat yang benar, bukan sekadar
terlihat seperti tombol. Gate: CP-5.

```text
Task T14 — résumé and contact actions.
Read REQUIREMENTS, DESIGN_SPEC and DATA_MODEL's activeResume/contact rules.
Implement résumé/contact response blocks and /resume using approved public assets
and links only. Show PDF format, language, version/update date where available;
provide a readable summary and a direct PDF link. Do not depend on the browser's
download attribute forcing cross-origin downloads. Validate URL protocols and use
safe external-link behavior. Display only owner-approved public contact methods.
Missing contact or PDF must produce the exact unavailable state, not a placeholder
mailto or # link. Do not add a contact form, database or email service.
Acceptance: real links open correctly, keyboard/screen reader labels are clear,
unsafe URLs are rejected and unpublished assets are not selected by the UI.
Stop at CP-5 with owner verification of the actual résumé and contact destinations.
```

## T15 · Blog yang nyaman dibaca

Seperti daftar isi majalah: pembaca bisa melihat judul dahulu, lalu membaca tulisan
tanpa harus melewati obrolan.

```text
Task T15 — blog index and article reader.
Read DESIGN_SPEC blog/article blueprints, DATA_MODEL post contract and REQUIREMENTS.
Implement /blog and /blog/[slug] using existing post documents, published filters,
twelve-item pagination, stable ordering and accessible category controls if data
exists. Render Portable Text through an explicit allowed-component map; validate
links and do not inject arbitrary HTML. Use the 680px article measure and prescribed
type/spacing. Preserve headings, captions, image aspect ratios and code overflow.
Do not seed sample articles as real posts. Empty blog must use the supplied copy.
Acceptance: direct article URLs work, unknown/hidden/future articles 404, pagination
does not duplicate entries and metadata reflects approved content. Verify a long
article fixture with headings, image, quote and long link in both themes/mobile.
Stop before draft preview, old-route redirects and Ask-about-article behavior.
```

## T16 · Preview, tautan lama, dan konteks artikel

Seperti melihat proof cetak sebelum terbit: editor boleh melihat draft, pengunjung
umum hanya melihat versi terbit. Gate: CP-6.

```text
Task T16 — editorial preview and route consistency.
Read ARCHITECTURE, REQUIREMENTS and current Sanity Presentation/live integration.
Read relevant installed Next.js docs and the repo's Sanity live-cache skill before
changing preview behavior. Update Presentation resolver, internal links, sitemap,
canonical metadata and legacy /posts/[slug] redirects consistently to /blog/[slug].
Preserve generic page routes deliberately; document collisions before changing them.
Implement Ask about this article as a validated slug handoff to chat with visible
context and an editable question; navigation alone must not call AI. Keep draft
tokens and preview flows separate from public/AI queries; preserve authenticated
Draft Mode behavior rather than blindly removing the configured browser token.
Acceptance: editor preview works, incognito sees published content only, invalid
article context is ignored safely and redirects have no loop. Stop at CP-6 with
route matrix, draft/public evidence and screenshots.
```

## T17 · Pasang SDK dengan mode aman

Seperti memasang telepon sebelum membeli paket panggilan: antarmuka bisa diuji dulu
tanpa menghabiskan kuota.

```text
Task T17 — AI SDK dependencies and disabled/mock adapter.
Read AI_SPEC and AI_SETUP completely. Query current npm metadata for ai, @ai-sdk/react,
@ai-sdk/google and zod; verify Node/React compatibility, record exact versions and
install pinned compatible versions in frontend. The source snapshot in AI_SPEC is
not permission to assume registry versions. Explain API drift before adapting code.
Add server-only config validation and provider adapter boundaries; AI_ENABLED=false
must avoid provider and limiter network calls. Implement deterministic mock responses
for development tests only, visibly labelled and impossible to enable in production.
Update env examples with variable names/empty values, never credentials. Use an
explicit provider, not an implicit Gateway. No live calls until owner model/budget
choice and limiter setup. Acceptance: disabled mode works, client bundles cannot
import provider secrets and contract tests pass. Stop with the exact dependency diff.
```

## T18 · Jawaban bersumber dan tervalidasi

Seperti ujian open-book: asisten harus menunjuk halaman yang dipakai, dan boleh berkata
belum tahu jika bahan tidak tersedia.

```text
Task T18 — retrieval and validated generation service.
Read AI_SPEC retrieval scores, request limits, system prompt and ModelAnswer schema.
Implement published-only bounded retrieval, deterministic ranking, top-five source
selection and article-context validation. Implement generateText with Output.object,
explicit provider/model, 20-second total budget and no automatic retries. Start with
mocked provider tests. Treat CMS text as data, not instructions. Validate schema,
source membership, allowed references and fact constraints; canonical card URLs are
resolved by server code. Do not trust client-supplied history as factual evidence.
No public live endpoint before T20's shared limiter. A single controlled live test
requires an owner-approved provider/model and budget. Acceptance: no-source, forged
source, injection, malformed output and timeout all return specified fallbacks with
no unsupported facts displayed. Show test evidence; stop before UI transport wiring.
```

## T19 · Hubungkan status dan jawaban ke chat

Seperti pelacakan paket: status “sedang diproses” tampil lebih dulu, isi paket baru
diterima setelah pemeriksaan selesai.

```text
Task T19 — AI SDK UI transport and chat integration.
Read AI_SPEC streaming protocol and ARCHITECTURE's single transcript owner. Implement
the Next.js Node route with createUIMessageStream/Response and useChat transport
using the installed SDK's verified APIs. Stream transient status updates, then one
validated data-portfolio envelope; do not render raw partial model text. Map SDK
pending events into the existing reducer using stable turn IDs, without persisting
SDK messages as a competing transcript. Implement stop, retry, timeout and offline
states with exact supplied copy. Route stays disabled/mock-only until T20 passes.
Acceptance: a slow mock shows status, only a validated final reply adds one turn,
cancel/clear suppress late replies and malformed stream data fails safely. Verify
keyboard, focus and scroll during generation on mobile. Stop after transport tests
and screenshots; do not publish an unmetered live endpoint.
```

## T20 · Batas pemakaian dan evaluasi AI

Seperti batas belanja harian: nominal ditentukan sebelum berbelanja, bukan setelah
tagihan datang. Gate: CP-7.

```text
Task T20 — shared rate limits, budget gates and grounded-AI evaluation.
Read AI_SPEC limits, provider-failure policy, E01–E18 and AI_SETUP. Guide owner setup of the
approved shared limiter without exposing secrets. Enforce limits atomically before
provider invocation: 5/minute/session, 20/hour/salted-IP and 200/day global, with the
specified expiry and fail-closed behavior. Document proxy-header trust and avoid
raw-IP/transcript logs. Keep preview and production counters separate. Optional
fallback is restricted to approved 429/5xx cases within the same total deadline.
Run all evaluation cases with recorded input class, outcome and actual source IDs;
use bounded approved live calls only where mocks cannot establish provider behavior.
Acceptance: concurrent requests cannot overspend counters, disabled/unconfigured
limiter invokes no provider, unsupported facts are withheld and spend is observable.
Stop at CP-7. If account/model/budget is unresolved, leave AI disabled and mark blocked.
```

## T21 · Cocokkan tampilan dan aksesibilitas

Seperti memeriksa jahitan dari dekat: yang dinilai bukan hanya “kelihatan bagus”,
tetapi jarak, garis, dan apakah semua bagian bisa dipakai.

```text
Task T21 — pixel and accessibility review.
Read DESIGN_SPEC's screenshot protocol. Capture welcome, thread, blog, article and
project at 1440x900 and 390x844 in light/dark, DPR 1, same browser/OS/fonts and fixed
content. Compare to the owner-approved reference; first establish approval, never
auto-update golden images to hide differences. Report geometry deviations above 2px
and same-platform pixel differences above the specified threshold. Fix only the
identified visual defects. Test 200% zoom, 320px width, keyboard-only use, focus trap,
reduced motion/transparency and screen-reader names/status. Measure text contrast;
decorative border contrast is not evidence of input/focus accessibility.
Acceptance: twenty reference screenshots and a concise pass/fail matrix, no content
hidden behind composer and no horizontal page scroll. Explain platform font raster
differences separately. Stop with remaining owner decisions; no unsolicited redesign.
```

## T22 · Uji perilaku penting

Seperti mencoba kunci cadangan sebelum bepergian: jalur error juga harus benar-benar
dicoba, bukan hanya tombol yang paling sering dipakai.

```text
Task T22 — focused release verification and CI.
Read REVIEW_CHECKLIST, REQUIREMENTS and existing tests/workflows. Fill concrete
coverage gaps for public/draft filtering, reference eligibility, route 404/redirect,
storage recovery, cancellation, AI validation and shared limiter concurrency.
Add end-to-end coverage only for critical journeys; do not mirror implementation
details or test every static label. Ensure CI runs deterministic tests, lint, type
checks and appropriate builds without provider calls or production CMS writes.
Use explicit non-secret fixtures where live Sanity credentials are unavailable.
Inspect dependencies, server/client imports, URL handling and tracked files for
accidental secrets without printing secret values. Acceptance: results identify
tested commit, commands and real limitations; failing checks stay visible and are
fixed within scope. Do not suppress errors or remove tests to get green. Stop with
the evidence needed for CP-8; do not deploy.
```

## T23 · Persiapan rilis

Seperti daftar barang sebelum berangkat: checklist diisi berdasarkan barang yang
benar-benar ada, bukan rencana membelinya. Gate: CP-8.

```text
Task T23 — release readiness evidence.
Read DEPLOYMENT and REVIEW_CHECKLIST launch gates. Compare actual implementation
with REQUIREMENTS R01–R20, approved content, AI evaluation and pixel review.
Populate PROGRESS with commit IDs, command outcomes, screenshots and unresolved
items; update setup/deployment instructions only where verified implementation
changed their factual commands. Do not rewrite missing requirements as optional.
Check production content approval, PDF/contact links, metadata, draft isolation,
provider/limiter readiness and environment variable names. Prepare a concrete
release candidate and classify each launch gate PASS, FAIL or NOT TESTED.
Acceptance: CP-8 can be independently reviewed from the repository plus evidence,
and no pending essential item is represented as complete. Stop for the owner's
release readiness review. Do not create accounts, deploy or change DNS in this task.
```

## T24 · Studio dan Vercel preview

Seperti mengirim paket ke alamat sendiri dahulu: kita mengecek hasil kiriman sebelum
membagikannya. Ikuti DEPLOYMENT D-01–D-06.

```text
Task T24 — guided Studio and Vercel setup/preview.
Read DEPLOYMENT and confirmed CP-8 evidence. Walk the owner through one dashboard
section or terminal action at a time, including expected result and recovery.
Deploy Studio only after explaining the selected project/host. Configure Vercel's
frontend root, outside-root workspace access, Node and deterministic install/build
commands. Explain that an initial import can create a Production deployment; verify
available deployment protection before sharing and use public-safe content.
Set env scopes by variable name without requesting secret values. Create an actual
preview from a non-production branch and configure exact preview/Studio origins.
Acceptance: build succeeds, routes/assets work, drafts stay isolated and AI limits
are verified in the deployed environment. Record URLs and deployment IDs, not tokens.
Stop with preview smoke-test evidence; production promotion/domain changes belong T25.
```

## T25 · Online di production

Seperti memasang papan alamat toko: alamat harus mengarah ke tempat yang sudah siap.

```text
Task T25 — production release and optional domain.
Read DEPLOYMENT D-07–D-08 and the preview evidence. Present the exact candidate
commit, production environment configuration names, remaining launch gates and
rollback deployment. After the owner explicitly instructs release, guide the main
merge/production build workflow. Prefer a fresh Production build when public env
values differ from Preview; do not claim promotion rewrites inlined variables.
For a custom domain, use the DNS records currently shown in the owner's Vercel
dashboard, preserve mail records and explain propagation/HTTPS checks. Update
SITE_URL and exact CORS origins, then redeploy when required.
Acceptance: canonical URL, TLS, metadata, direct deep links, CMS publish flow,
résumé/contact and rate-limited AI pass incognito smoke tests. Record release SHA
and deployment URL. Stop before maintenance changes; do not declare success from CI alone.
```

## T26 · Latihan pemulihan dan serah terima

Seperti menyimpan kunci cadangan: tahu letaknya belum cukup; kamu perlu tahu cara
menggunakannya saat dibutuhkan. Gate: CP-9.

```text
Task T26 — recovery walkthrough and handover.
Read DEPLOYMENT D-09 and REVIEW_CHECKLIST CP-9. Guide a non-destructive rollback
rehearsal on Preview or document the exact Production recovery steps without
switching live traffic unrequested. Identify the previous healthy deployment,
which environment changes require rebuild, and why code rollback does not restore
Sanity content. Verify the AI kill switch and describe how to restore it safely.
Document the owner workflow for editing/publishing a post, updating résumé/contact,
reviewing provider usage and requesting a future specification change. Record
actual checks and remaining operational limits in PROGRESS, including release SHA.
Acceptance: the owner can locate the recovery controls and maintain content without
asking AI to redesign the app. Stop at CP-9. Do not rotate secrets, delete datasets,
force-push branches or perform a production rollback merely to demonstrate it.
```

## Jika task gagal

Tempel error yang sudah disensor dan kirim:

```text
We are still on Txx. Expected: [specific result]. Actual: [observed result].
Command and sanitized error: [paste]. Inspect the relevant diff and identify the
smallest root-cause fix within this task. Explain it before editing. Preserve my
other changes, rerun only the affected checks and stop. Do not skip the failing gate.
```

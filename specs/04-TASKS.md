# 04 — Atomic Tasks

> 1 task = 1 prompt / 1 commit. Kerjakan berurutan sesuai Prerequisite.
> DILARANG menyentuh file di luar "Files Affected".
> Setiap task selesai hanya jika Verification Command hijau.

---

### [TASK-01] Sanity schemaTypes portfolio (P0)
- **Prerequisite:** —
- **Files Affected:** `studio/src/schemaTypes/` (file baru: `profile.ts`, `project.ts`, `experience.ts`, `skillGroup.ts`, `socialLink.ts`, `suggestedQuestion.ts`, `siteSettings.ts`, update `index.ts`)
- **Description:** Implementasikan 7 schema sesuai `03-CONTRACTS.md` §4 (field, tipe, validasi required). Singleton untuk `profile` & `siteSettings`.
- **Verification Command:** `cd studio && npx sanity schema validate` (harus exit 0, tanpa error)

### [TASK-02] Data layer portfolio + types (P0)
- **Prerequisite:** TASK-01
- **Files Affected:** `frontend/lib/portfolio.ts` (baru), `frontend/sanity.types.ts` (regenerate/extend)
- **Description:** Implementasikan GROQ queries dari `03-CONTRACTS.md` §4 + fungsi `getPortfolio()` yang me-return semua data shapes §3, dengan cache 60 detik. TypeScript types untuk semua `*CardData`.
- **Verification Command:** `cd frontend && npx tsc --noEmit` (tipe valid; fetch live menyusul setelah konten diisi)

### [TASK-03] System prompt builder (P0)
- **Prerequisite:** TASK-02
- **Files Affected:** `frontend/lib/chat-prompt.ts` (baru)
- **Description:** Fungsi `buildSystemPrompt(portfolio): string` — render fakta portfolio jadi teks kompak + kerangka prompt dari `03-CONTRACTS.md` §5. Sertakan daftar tool yang tersedia.
- **Verification Command:** `cd frontend && node -e "import('./lib/chat-prompt.ts')"` via tsx/vitest — atau unit test kecil yang assert prompt mengandung nama & project titles dari fixture.

### [TASK-04] Rate limiter (P0)
- **Prerequisite:** —
- **Files Affected:** `frontend/lib/rate-limit.ts` (baru)
- **Description:** In-memory sliding-window limiter: 20 req/menit per IP. Fungsi `checkRateLimit(ip): {allowed: boolean, retryAfterSec?: number}`. Bersihkan entry kadaluarsa tiap cek.
- **Verification Command:** script node yang memanggil 21x dan assert panggilan ke-21 `allowed === false`.

### [TASK-05] `POST /api/chat` — endpoint + SSE + LLM (P0)
- **Prerequisite:** TASK-02, TASK-03, TASK-04
- **Files Affected:** `frontend/app/api/chat/route.ts` (baru)
- **Description:** Validasi body (tolak `role:"system"`, batasi panjang). Cek rate limit → 429. Bangun system prompt, panggil LLM OpenAI-compatible (`LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`) dengan tools dari `03-CONTRACTS.md` §2, stream SSE sesuai §1. Eksekusi tool server-side dari data Sanity. Timeout 30s → error ramah. `MOCK_LLM=1` → stream canned (untuk tes tanpa key).
- **Verification Command:** `MOCK_LLM=1 npm run dev & sleep 8 && curl -N -X POST localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}' | head -20` → harus ada event `data: {"type":"text"...` dan `data: {"type":"done"}`. Lalu `for i in $(seq 1 21); do curl -s -o /dev/null -w "%{http_code}\n" -X POST ...; done` → request ke-21+ harus 429.

### [TASK-06] Chat UI shell: dock + messages + suggested questions (P0)
- **Prerequisite:** TASK-05
- **Files Affected:** `frontend/app/components/chat/` (baru: `ChatDock.tsx`, `MessageList.tsx`, `MessageBubble.tsx`, `SuggestedQuestions.tsx`)
- **Description:** Install `lucide-react` + `simple-icons` dulu (`npm i lucide-react simple-icons` di `frontend/`). ChatDock: textarea autosize, tombol send (aktif saat ada teks), tombol "Download CV" & "Let's Talk!". MessageList: bubble user (kanan, abu) & AI (kiri, streaming). SuggestedQuestions: kartu 3 pertanyaan dari Sanity, tap → kirim. Semua `"use client"`.
- **Verification Command:** `cd frontend && npm run build` (hijau, tanpa TS/ESLint error)

### [TASK-07] Rich card renderers + tool router (P0)
- **Prerequisite:** TASK-06
- **Files Affected:** `frontend/app/components/chat/cards/` (baru: `ProjectCard.tsx`, `ExperienceCard.tsx`, `SkillsCard.tsx`, `ContactCard.tsx`), `frontend/app/components/chat/ToolRenderer.tsx` (baru)
- **Description:** Kartu sesuai `ProjectCardData` dll. (§3 CONTRACTS). ToolRenderer: `switch(tool.name)` → komponen kartu; tool tak dikenal → render nothing (jangan crash).
- **Verification Command:** `cd frontend && npm run build` hijau.

### [TASK-08] Landing page composition (P0)
- **Prerequisite:** TASK-06, TASK-07
- **Files Affected:** `frontend/app/page.tsx` (rework), `frontend/app/components/chat/` boleh tambah `AvailabilityPill.tsx`, `HeroHeadline.tsx`
- **Description:** Susun: header (sosmed kiri, pill Home/Blog kanan), availability pill, hero headline, SuggestedQuestions, divider "or", tombol "Tell me your full story", ChatDock melayang. Hapus hero/page-builder demo template yang tidak dipakai. Single column max-w ~720px, light theme.
- **Verification Command:** `npm run build && npm run start & sleep 6 && curl -s localhost:3000 | grep -c "Available for work"` → > 0; cek tidak ada teks demo template.

### [TASK-09] Aksi CV & kontak (P0)
- **Prerequisite:** TASK-08
- **Files Affected:** `frontend/app/components/chat/ChatDock.tsx` (tambah handler)
- **Description:** "Download CV" → download `cvUrl` dari siteSettings (fallback: toast "CV coming soon"). "Let's Talk!" → `mailto:contactEmail`.
- **Verification Command:** `curl -s localhost:3000 | grep -o 'mailto:[^"]*'` → email benar; CV URL valid via `curl -I`.

### [TASK-10] Deploy Vercel + smoke test (P0)
- **Prerequisite:** TASK-01..09, konten Sanity terisi (Archi)
- **Files Affected:** (tidak ada — konfigurasi dashboard Vercel + env vars)
- **Description:** Buat project Vercel dari repo, set env (`LLM_*`, `SANITY_*`), deploy. Hapus konten demo template dari dataset production.
- **Verification Command:** `curl -s https://<domain>/ | grep -c "<nama Archi>"` → > 0; `curl -N -X POST https://<domain>/api/chat ...` → stream valid.

### [TASK-11] Micro-interactions (P1)
- **Prerequisite:** TASK-10
- **Files Affected:** `frontend/app/globals.css` (keyframes/tokens), komponen chat (aplikasikan)
- **Description:** Implementasikan HANYA signature interactions dari `05-DESIGN-SYSTEM.md` §7: mechanical press (100ms shadow collapse), traveling tab indicator, placeholders-and-vanish, word-by-word streaming + kursor blok orange, streaming beam (sekali), staggered blur reveal (sekali, 60ms), number counters. Pure CSS; hormati `prefers-reduced-motion`. DILARANG: shine sweep, pulsing dot, typewriter loop, cursor spotlight, bounce easing.
- **Verification Command:** `npm run build` hijau + verifikasi visual manual.

### [TASK-12] "Tell me your full story" (P1)
- **Prerequisite:** TASK-08
- **Files Affected:** `frontend/app/components/chat/FullStory.tsx` (baru)
- **Description:** Tombol aksi → kirim prompt tersembunyi "Tell me your full story" → AI menjawab bio panjang (gunakan `show_profile` + narasi, batas 400 kata).
- **Verification Command:** `MOCK_LLM=1` curl ke `/api/chat` dengan pesan tersebut → stream valid.

### [TASK-13] Blog wiring (P1)
- **Prerequisite:** TASK-10
- **Files Affected:** `frontend/app/posts/*` (cek/rapikan)
- **Description:** Pastikan routes blog template berfungsi dengan konten Archi (list + detail + search). Hapus post demo.
- **Verification Command:** `curl -s localhost:3000/posts | grep -c "article"` → > 0 setelah konten ada.

### [TASK-14] Mobile bottom-sheet (P1)
- **Prerequisite:** TASK-08
- **Files Affected:** `frontend/app/components/chat/ChatDock.tsx`
- **Description:** Di bawah breakpoint 1100px, dock menjadi bottom sheet full-width (pola referensi).
- **Verification Command:** build hijau + verifikasi visual manual (DevTools responsive).

### [TASK-15] Personal taste blocks (P2 — 2026-10-03, Archi approved)

"Apa music favorite" + "Best movie ever for me" sebagai jawaban chat yang personal.
- Schema `pick` (category music/movie, title, creator, year, note, previewUrl, artworkUrl, spotifyUrl, order) — di CMS.
- Music PLAYABLE: 30s iTunes Search API preview (tanpa key) + custom player Machine Room (tombol kotak, progress 2px, mono time). Opsi B (Spotify embed) ditolak: iframe tak bisa di-style. Opsi C (upload MP3) ditolak: butuh file user.
- Tool `show_taste` (args category?) + `TasteCard` (+`PreviewPlayer`) + prompt FACTS section. Dummy-seeded; Archi ganti dengan favorit asli via CMS.
- Easter eggs: DITUNDA phase ini (keputusan Archi 2026-10-03).

### [TASK-16] Easter eggs + slash commands (P3 — 2026-10-05, Archi approved)

Chat-native delight + utility. Both live inside the existing chat — no new backend.

**Slash commands** (`frontend/app/components/chat/slashCommands.ts` registry, `SlashMenu.tsx` menu):
- Menu: floating autocomplete above the composer. Opens when input starts with `/` and has no space; prefix-filters on the query. Keyboard: ↑/↓ navigate, Tab/Enter runs, Esc dismisses (draft kept). Click selects. Machine Room styling: paper menu, 1px ink border, mono `/command` + description; active row = ink bg/paper text (color change only); action rows get orange `▸`. Opens instantly (no animation).
- Prompt class (injects message → AI streams answer): `/projects` "Show me your work, annotated", `/experience` "Where have you worked?", `/music` "What music are you into?", `/movies` "What are your favorite movies?", `/blog` "What have you written lately?", `/story` → reuses `FULL_STORY_API_PROMPT` (hidden prompt, "Tell me your full story" label).
- Action class (deterministic, client-side, no LLM): `/cv` → CV download handler, `/contact` → mailto handler, `/clear` → wipe conversation, `/help` → authored in-chat command list.
- Intercept order in `ChatDock.handleSend`: **slash → secret phrase → LLM**. Unknown `/foo` (or with spaces) falls through to the normal LLM path — never an error.

**Egg 1 — the ■ keeps count** (`HeroHeadline.tsx`): 5 clicks on the orange kicker square within a 1.5s decay window (else counter resets) → DECLASSIFIED // FIELD NOTES card under the hero (mono, 1px orange border, rotated stamp). Card content is a PLACEHOLDER — Archi's lore to write; do NOT invent personal facts. `localStorage` flag `iarchi_declassified`; repeat visits show the card as "already declassified".

**Egg 2 — secret phrases** (`secretPhrases.ts`): exact-match map (lowercase + trim), checked client-side BEFORE the LLM call. `sudo hire archi` / `open the pod bay doors` / `who are you really` → authored replies with trailing ■ marker. Wordings are drafts — Archi edits freely in the one map at the top of the file.

**Egg 3 — delightful 404** (`app/not-found.tsx`): ink bg, orange mono "■ SIGNAL LOST", giant mono 404, "ROUTE NOT ON MANIFEST", orange "RETURN TO CONSOLE" button → `/`. Static; no game.

**Egg 4 — console message** (`HomeClient.tsx` useEffect, once): styled `%c` log — "■ You're poking around the machine room." / "Like what you see? → /contact" / "psst — the orange square keeps count." Intentional discoverability hint for egg 1.

**Egg 5 — /colophon** (`app/colophon/page.tsx`): static build-manifest page (typeface, palette, stack, motion, cookies rows). Undocumented — no nav link; found via console hint or guessing.

**Constraints (locked):**
- Suggested-question chips must NEVER list egg phrases or slash commands as discovery.
- Scripted replies (egg 2, /help) bypass the LLM path entirely → they can never trip the BAD_RESPONSE leak guard.
- Motion: menu instant/≤100ms; row highlight = color change only; card/button = 100ms mechanical press. Rejected patterns (cursor spotlight, streaming beam, shine sweep, pulsing dot, typewriter loop, bounce easing) stay rejected.
- Files Affected: `frontend/app/components/chat/{slashCommands.ts,secretPhrases.ts,SlashMenu.tsx,ChatDock.tsx,HomeClient.tsx,HeroHeadline.tsx}`, `frontend/app/not-found.tsx`, `frontend/app/colophon/page.tsx`.
- Verification Command: `npm run build` green + manual interaction check (type `/`, 5× click ■, secret phrase, unknown route, DevTools console, /colophon).


---

### [TASK-17] Full-story fan stacks (P4 — 2026-10-05, design approved v3.2)

`/story` renders narrative text interleaved with compact **fan stacks** per content type. Design: mockup `~/workspace/your_files/iarchi-story-cards.html` v3.2 (fan deck + blur modal + playable music + artwork/posters). Reference studied: dapp-portfolio.netlify.app (fan tilt ±5–8°, +N overlay, per-type card structures, modal expand — we add hover spread + compact/full differentiation, which the reference lacks).

**Contract changes (specs/03-CONTRACTS.md §1–§2):**
- Request: `POST /api/chat` accepts `mode?: 'story'` alongside `messages`.
- SSE tool event gains `presentation?: 'compact'`. Only story mode sets it.
- Story mode runs a deterministic server-side section loop (projects → experience → music → movies): short LLM prose per section, then the section's tool executed server-side. Event order in the stream IS the document order — the client interleaves text and stacks without fragile markers.

**Server (`frontend/app/api/chat/route.ts`, `lib/chat-prompt.ts`):**
- Read `mode` from the POST body (extend body parsing next to `validateBody`; `mode` is a top-level field, not a message).
- If `mode === 'story'`: deterministic section loop over projects → experience → music → movies. Per section: (1) one short LLM turn for the section prose (`tool_choice: 'none'`, max 250 tokens, previous prose accumulated for coherence), then (2) the section's tool executed server-side, its event sent with `presentation: 'compact'`. Sections with empty results are skipped silently. Event order in the stream is the document order.
- Why deterministic, not agentic: observed 2026-10-05 — the free-tier model echoed multi-step tool instructions verbatim and called zero tools. The server owns structure; the LLM only writes short prose (its strength).
- Existing guards apply per turn: think-filter, leak detector → BAD_RESPONSE, per-fetch LLM timeout.
- Non-story requests: byte-for-byte current behavior (single turn, `tool_choice: 'auto'`).

**Client:**
- `app/components/chat/types.ts`: `ToolEvent.presentation?: 'compact'`; new `StoryBlock = {kind:'text'; text:string} | {kind:'tool'; tool:ToolEvent}`.
- `ChatDock.tsx`: when the outgoing message is the story prompt (`FULL_STORY_API_PROMPT`, via `/story` slash or suggested-question chip), send `mode:'story'`. The stream reader builds an ordered `StoryBlock[]` in story mode (text deltas append to the current text block; each tool event pushes a tool block and opens a new text block). Normal mode keeps the current `content` + `tools` path untouched.
- New `StoryMessage.tsx`: renders blocks in order — text blocks via the existing markdown renderer (extract/share `renderMarkdown` from `MessageBubble.tsx`), compact tool blocks via `FanStack`.
- New `app/components/chat/fan/`:
  - `FanStack.tsx` — slim mono header (LABEL ■ COUNT + OPEN ▸), fanned faces, `+N` badge on the last face, click/Enter opens the modal.
  - `faces/ProjectFace.tsx` (blueprint: orange typebar, `P.01 · year`, Lucide icon, title, sub, chips), `faces/ExperienceFace.tsx` (ledger slip: ink typebar, `E.01`, icon, role, org · period), `faces/MusicFace.tsx` (tape strip: working play button, track — artist, duration, live progress), `faces/MovieFace.tsx` (ticket stub: dashed stub + vertical year, `F.01`, icon, title, director, rating chip).
  - `fanIcons.ts` — per-card Lucide icon resolution, keyword heuristic over title/type (e.g. bot/globe/rocket, code/calculator/briefcase, disc/music/headphones, clapperboard/film) with a per-type default. No Sanity schema change in v1.
  - `StackModal.tsx` — fixed overlay `rgba(16,20,24,.42)` + `backdrop-filter: blur(10px)`; dialog = paper, 1px ink border, sharp corners, mono header + ×; close via × / backdrop click / Esc; focus the close button on open, restore focus on close; `aria-modal` + `role="dialog"`; body scroll lock while open. Body reuses the existing full cards (`ProjectCard`, `ExperienceCard`, `TasteCard`) — music shows `artworkUrl` (84px), movies show `artworkUrl` poster (76×112).
  - `fan.css` — port of the mockup CSS: `@property --r/--tx` fan spread, static negative-margin overlap, per-card hover (straighten + `-10px` lift + orange border), modal enter (backdrop fade 180ms, dialog `translateY(14px)→0` 240ms expo-out). Transform/opacity only — no layout-property animation (impeccable-clean).
- `ToolRenderer.tsx`: unchanged for normal mode. (Story mode never reaches it — `StoryMessage` routes compact tools to `FanStack`.)
- Music playback reuses `TasteCard`'s module-level `activeAudio` one-at-a-time pattern. `show_taste` in story mode splits into two stacks: MUSIC and MOVIES (by `pick.category`).
- Motion tokens already exist in `globals.css` (`--ease-lux` = the expo, `--dur-press/hover/reveal`); fan/modal timings: hover 220ms/180ms, modal 180ms/240ms.

**Data (no code):** movie picks need `artworkUrl` poster URLs in Sanity (Archi fills via Studio; TMDB `image.tmdb.org` CDN verified hotlink-OK, 200). Music `artworkUrl`/`previewUrl` already flow from iTunes.

**Non-goals:** normal-mode chat rendering; Sanity schema changes; draft-preview wiring.

**Constraints (locked):**
- Design direction Machine Room + all rejections in 05-DESIGN-SYSTEM.md §7 stay enforced (detector-clean: no layout animation, no banned patterns).
- Placeholders stay clearly marked; never invent personal data (icons are decorative, chosen by keyword — not facts).
- Phases land behind the `mode`/`presentation` flags: normal chat cannot regress.

**Phases:**
1. Contract + server: `mode` parsing, `presentation` marker, 3-turn loop, story prompt text, 03-CONTRACTS.md update.
2. Fan components + modal + `fan.css` (static, props-driven; verify against mockup).
3. Wire-up: ChatDock story mode, ordered blocks, StoryMessage, icon heuristic, artwork/poster plumbing.
4. Verify: `tsc`, `npm run build`, manual `/story` pass (fan hover/spread, modal open/close/Esc, audio one-at-a-time, mobile bottom sheet), reduced-motion check.

- Files Affected: `frontend/app/api/chat/route.ts`, `frontend/lib/chat-prompt.ts`, `frontend/app/components/chat/{types.ts,ChatDock.tsx,MessageBubble.tsx,ToolRenderer.tsx}`, new `frontend/app/components/chat/{StoryMessage.tsx,fan/*}`, `frontend/app/globals.css`, `specs/03-CONTRACTS.md`.
- Verification Command: `npx tsc --noEmit && npm run build` green + manual `/story` interaction check (narrative interleaves with stacks; hover spreads fan; card hover lifts; OPEN → blur modal with full cards + artwork/poster; music plays one-at-a-time; Esc/backdrop/× close; normal questions unchanged).

---

## Agent Handoff Prompt (Step 6 SDD)

Kirim ke coding agent (OMP / OpenCode) per task:

```text
Read specs/00-CONSTITUTION.md, specs/03-CONTRACTS.md, then execute [TASK-ID]
from specs/04-TASKS.md.

Rules:
- Do not edit files outside "Files Affected".
- Run the Verification Command. The task is done ONLY if it passes.
- If something fails or the spec seems ambiguous, DO NOT invent ad-hoc code.
  Report exactly which spec clause needs updating instead.
```

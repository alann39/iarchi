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

# 02 — Architecture

> HOW. Berbasis pada template baseline di repo. Fokus pada **delta**: apa yang dipakai
> dari template, apa yang dibangun baru.

## 1. Baseline Template

**`sanity-template-nextjs-clean`** (sudah ada di repo, 1 commit):
- Monorepo `turbo`: `frontend/` (Next.js 16 App Router + Tailwind) + `studio/` (Sanity Studio).
- Fitur template yang **dipakai langsung**: App Router, blog routes (`app/posts`), Sanity client + image pipeline, ISR, sitemap.
- Fitur template yang **tidak dipakai v1**: page builder / drag-drop, Presentation Tool (visual editing), contoh konten demo (dihapus).

### UI Library Decision (2026-10-03)

**Tidak memakai UI component library (shadcn/Radix/dsb.) untuk v1.**
Styling: Tailwind CSS + custom components + design tokens (`05-DESIGN-SYSTEM.md`).
Ikon: `lucide-react` (perlu install). Toast: `sonner` (sudah ada di template).
Rasional: desain bespoke (glass dock, fan-out, shine) tidak tersedia di library
manapun; komponen sedikit tapi custom semua; bundle minimal.
Radix primitives boleh diambil satuan jika fase berikutnya butuh modal/menu kompleks.

## 2. Delta Architecture — Modul Baru

```
frontend/
├── app/
│   ├── page.tsx                  # REWORK: landing chat-first (ganti hero template)
│   ├── api/chat/route.ts         # NEW: chat endpoint (satu-satunya pemanggil LLM)
│   └── components/chat/          # NEW:
│       ├── ChatDock.tsx          # input melayang (textarea autosize + tombol aksi)
│       ├── MessageList.tsx       # daftar bubble pesan
│       ├── MessageBubble.tsx     # teks user / jawaban AI (markdown)
│       ├── SuggestedQuestions.tsx# kartu pertanyaan saran
│       ├── cards/
│       │   ├── ProjectCard.tsx   # kartu project (judul, tahun, tags, link, cover)
│       │   ├── ExperienceCard.tsx# kartu experience (logo?, role, durasi pill, deskripsi)
│       │   ├── SkillsCard.tsx    # grup skills
│       │   └── ContactCard.tsx   # baris kontak (ikon + link)
│       └── ToolRenderer.tsx      # router: hasil tool-call → komponen kartu
├── lib/
│   ├── portfolio.ts              # NEW: GROQ queries + fetch konten Sanity (cached)
│   ├── chat-prompt.ts            # NEW: bangun system prompt dari konten portfolio
│   └── rate-limit.ts             # NEW: in-memory per-IP rate limiter
studio/src/schemaTypes/           # NEW: profile, project, experience, skillGroup,
                                  #       socialLink, suggestedQuestion, siteSettings
```

## 3. System Flow

```
Visitor
  │ ketik / tap pertanyaan
  ▼
ChatDock (client) ──POST /api/chat {messages[]}──▶ route.ts (server)
                                                        │
                              ┌─────────────────────────┘
                              ▼
                     portfolio.ts: ambil konten Sanity (cache 60s)
                              │
                              ▼
                     chat-prompt.ts: system prompt + knowledge base
                              │
                              ▼
                     LLM (OpenAI-compatible, via env LLM_BASE_URL)
                     dengan tools: show_projects, show_experience,
                                   show_skills, show_contact, show_profile
                              │  SSE stream: text delta + tool calls
                              ▼
Client: MessageBubble render markdown streaming;
        ToolRenderer render kartu kaya dari hasil tool
```

**Kenapa tool-calling, bukan markdown mentah?** Kartu kaya (gambar, pill tahun, link) butuh data terstruktur.
LLM me-return *nama tool + argumen*, server mengeksekusi (ambil dari konten yang
sudah di-fetch — bukan dari LLM, anti-halusinasi data), client me-render kartu.
Teks narasi tetap streaming markdown biasa.

## 4. Knowledge Base Strategy (anti-halusinasi)

- Server fetch **seluruh konten portfolio** dari Sanity sekali per request (kecil: teks, bukan gambar).
- Konten disuntik ke system prompt sebagai "fakta resmi". Instruksi: *jawab HANYA dari fakta ini; jika tidak ada di fakta, katakan tidak tahu.*
- Hasil tool (`show_projects` dll.) diambil dari objek konten server-side — LLM tidak boleh mengarang field.

## 5. Resilience & Fallback

| Risiko | Mitigasi |
|---|---|
| LLM timeout / error | Timeout 30s → pesan fallback ramah: "Hmm, otaknya lagi loading… coba lagi ya." |
| Rate limit provider | Retry 1x dengan backoff; gagal → fallback message |
| Sanity fetch gagal | Pakai cache terakhir; jika tidak ada cache → mode degraded (jawab dari konten statis minimal + beri tahu) |
| Abuse / cost blowout | Rate limit 20 req/menit/IP (Constitution §2); max output tokens 800; konteks dibangun sekali |
| Tool args invalid | Abaikan tool call, lanjutkan sebagai teks biasa |

## 6. Environment

| Var | Scope | Keterangan |
|---|---|---|
| `LLM_BASE_URL` | server | OpenAI-compatible endpoint (default: 9router `/v1`) |
| `LLM_API_KEY` | server | API key provider |
| `LLM_MODEL` | server | Nama model (configurable tanpa ubah kode) |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | both | Sudah ada di template |
| `MOCK_LLM=1` | server (dev/test) | Kembalikan stream canned agar `/api/chat` bisa dites via `curl` tanpa key |

## 7. Deployment

- Vercel, project baru untuk repo ini. Frontend + Studio deploy terpisah (pola bawaan template).
- ISR: halaman revalidasi tiap 60 detik agar edit konten Sanity cepat tayang tanpa redeploy.

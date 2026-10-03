# 06 — UI Spec (Screens & Components)

> Spec visual per layar & komponen. Token merujuk ke `05-DESIGN-SYSTEM.md`.
> Setiap komponen punya **state matrix** — semua state wajib diimplementasikan.
> Bahasa desain: Editorial Instrument + Quiet Luxury, aksen Brutalist press.

## 1. Global Layout

- Satu kolom `max-w-[720px]`, centered, background `--paper`.
- **Tidak ada footer.** Tidak ada nav selain Home/Blog. Whitespace adalah alat komposisi.
- Kickers editorial (`01 —`, `02 —`, …) menandai tiap section — peta halaman terbaca seperti daftar isi.

## 2. SiteHeader (fixed top)

**Anatomi:** kiri = ikon sosial (20px, `--muted`, hover → `--ink` + border-brightening); kanan = segmented `[Home | Blog]` dengan **traveling indicator** (pill putih meluncur 200ms `--ease-lux`).
**Kicker:** di bawah header, mono 11px: `ARCHI.DEV — PORTFOLIO` + timestamp/jam live (mono, seperti radio di referensi framer — detail hidup yang murah).
**States:** `default` | `scrolled` (backdrop-blur 16px + hairline bottom).

## 3. AvailabilityStatus — merged into hero kicker (direction A, 2026-10-03)

**Bukan** pulsing dot (anti-pattern untuk konten non-live), dan **bukan** pill terpisah —
nol dari 8 referensi minimalist punya availability pill di hero. Availability tampil inline
di kicker hero: `■ {NAME} — AI PORTFOLIO · {AVAILABILITY}` — kotak 8px `--accent`,
mono 11px uppercase, `letter-spacing: 0.12em`. Crisp, tanpa animasi.
**States:** `default` | `hidden` (data kosong → kicker tanpa segmen availability, jangan placeholder).

## 4. HeroHeadline — direction A "The Input Is the Hero" (2026-10-03)

Minimal by construction, ±9 kata above the fold. **Tidak ada paragraf bio** — bio didelegasikan
ke tombol "Read the full story" dan chat itu sendiri (referensi: rauno.me, applicaiton.vercel.app).
- Kicker: `■ {name} — AI portfolio · {availability}` (lihat §3).
- H1: `"Ask me / anything."` — Space Grotesk 700, 44px desktop / 34px mobile, `letter-spacing: -0.02em`, `leading: 1.02`.
- Sub satu baris: `"This site is a conversation, not a résumé."` — DM Sans 15px `--muted`.
**Reveal:** staggered blur+rise, 60ms steps, **sekali saja** (bukan shine sweep).
**States:** `default` | `E3` (profil kosong → "Portfolio content coming soon.").

## 5. SuggestedChips (bukan kartu)

3–4 **chips** horizontal (wrap) di atas chat dock — pola best-practice chat-first:
- Style: pill, `1px solid var(--hairline)`, bg `--card`, mono 13px.
- Hover: border-brightening 150ms.
- Tap: **mechanical press** (border 1.5px ink + shadow collapse 100ms) → terkirim sebagai pesan user → chips dismiss.
**Data:** dari `suggestedQuestion` (Sanity). Kosong → fallback 3 default (`// FALLBACK:`).
**States:** `default` | `hover` | `pressed` | `dismissed`.

## 6. ChatDock (satu-satunya glass)

**Anatomi:** `position: fixed; bottom: 24px`, centered, `max-w-[680px]`, pill.
Background `rgba(255,255,255,0.72)` + `blur(16px) saturate(160%)`, border `1px rgba(16,20,24,0.08)`, shadow `--shadow-dock` (satu-satunya shadow lembut yang diizinkan).
- Textarea: borderless, autosize (max 5 baris), **placeholders-and-vanish** — placeholder berotasi ("Ask about my projects…"), hilang huruf-per-huruf. Timing: ketik 60ms/huruf, tahan 2200ms (cukup dibaca), vanish 28ms/huruf, jeda 500ms antar frasa.
- Kiri: dua pressable pill kecil — `Download CV` (ikon download), `Let's Talk!` (ikon mail): 1.5px ink border + `3px 3px 0` shadow + press collapse.
- Kanan: **tombol kirim lingkaran `--accent`** (ikon panah putih) — *signature moment*. Hover: sedikit membesar; active: press collapse.

**State matrix:**

| State | Tampilan |
|---|---|
| `idle-empty` | Placeholder berotasi; tombol kirim `--faint` bg, disabled |
| `idle-typing` | Tombol kirim `--accent` penuh, enabled |
| `sending` | Tombol kirim jadi spinner (arc orange); textarea disabled |
| `error` | Shake 150ms; error bubble di atas dock |

**Responsive (≤1100px):** bottom sheet full-width, radius `20px 20px 0 0`; pill CV/Let's Talk jadi icon-only.
**`Enter`=kirim**, `Shift+Enter`=newline (tulis di placeholder sekali tiap rotasi).

## 7. MessageList & MessageBubble

- **AI bubble:** BARE (tanpa bubble) + avatar kecil — kotak 28px `--ink` bg dengan inisial mono putih (pola premium Claude/ChatGPT). Bukan bubble Intercom.
- **User bubble:** rata kanan, bg `--surface`, `--r-md`, max-w 80%.
- **Streaming:** word-by-word + **kursor blok orange** berkedip di akhir (bukan typewriter char-by-char).
- **Per-message actions** (hover, AI bubble): copy, regenerate — ikon 14px `--faint`.
- **Auto-scroll:** hanya jika user sudah di bawah; jika tidak → pill `↓ New messages`.
- **Entrance:** `--reveal` 300ms, stagger 60ms.
- **States:** `streaming` | `complete` | `error` (bubble error + tombol `Retry` pressable).

## 8. Rich Cards (hasil tool-call) — ledger editorial

Kartu = **ledger rows**: flat, hairline top rule, index numeral mono. Tanpa shadow (kecuali hover brightening).

**ProjectCard:** index `01` mono 13px `--muted` + tahun mono; judul Space Grotesk 600 18px; cover 16:10 `--r-md` dengan clip-wipe reveal; deskripsi 2 baris clamp; tags sebagai kickers mono 11px uppercase (bukan chips pill); links: `GitHub ↗` `Demo ↗` mono 13px `--accent` underline on hover. Hover: border `--hairline` → `rgba(16,20,24,0.35)`.
**Streaming state:** kartu tampil sebagai **skeleton** sesuai bentuk akhir, lalu populate in-place — tanpa efek beam/garis berjalan (ditolak saat review desain).
**ExperienceCard:** ledger row: role 16px semibold + perusahaan `--muted`; kanan: durasi mono 12px; deskripsi 14px; hairline divider antar item.
**SkillsCard:** grup: kicker mono (`FRONTEND`) + daftar inline dipisah `·`.
**ContactCard:** rows hairline: ikon 16px + label + url mono 13px `--muted`; hover: bg `--surface`.
**Image states:** `image-missing` → placeholder `--surface` + inisial judul mono (jangan broken-img).

## 9. TypingIndicator

Tiga dot `--muted` 6px, bounce halus stagger 150ms — minimal, tanpa teks. Tampil di posisi avatar AI saat `sending` sebelum stream tiba.

## 10. Error & Empty States

| Situasi | UI |
|---|---|
| LLM error/timeout | Bubble AI bare + avatar: `"Hmm, my brain buffered. Mind trying again?"` + tombol `Retry` pressable |
| Rate limited (429) | `"Whoa, lots of questions — give me a minute."` tanpa retry |
| Konten kosong | Hero + kicker: `"CONTENT LOADING — CHECK BACK SOON"` mono; chat jawab sopan |
| Topik di luar konteks | `"I'm Archi's portfolio assistant — ask me about his work, not recipes."` |
| Prompt injection | Tolak sopan (Constitution §2), tanpa bocor |

## 11. Blog Page (`/blog`)

Editorial penuh: kicker `03 — WRITING`, judul Space Grotesk, list artikel sebagai ledger rows (tanggal mono + judul + excerpt), hairline dividers. Search: input underline hairline (bukan box).
**States:** `loading` (skeleton rows) | `empty` (`"No posts yet."` mono) | `error` (merah `--accent`? tidak — merah hanya untuk error: gunakan teks biasa + tombol retry).

## 12. FullStory Action

Tombol pressable full-width: kicker `02 —` + `"Read the full story"` + panah. Tap → kirim prompt tersembunyi → AI jawab bio ≤400 kata (2–3 bubble, boleh lebih panjang dari batas 120 kata biasa).

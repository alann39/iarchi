# 05 — Design System (Tokens)

> Single source of truth visual untuk `iarchi`. Semua komponen WAJIB memakai
> token di sini — dilarang nilai warna/spacing/radius arbitrary di luar token.
>
> **Arah final (2026-10-03, locked):** *Editorial Instrument* di atas fondasi
> *Quiet Luxury*, dengan aksen interaksi *Brutalist-lite*. Warna & font dikunci
> dari Machine Room. Elemen & motion di bawah ini adalah hasil riset
> perbandingan design system (21st.dev, shadcn, Magic UI, Aceternity, dsb.)
> — BUKAN jiplakan referensi dapp-portfolio.

## 1. Design Principles

1. **Editorial dulu, dekorasi tidak.** Struktur datang dari hairline rules, index numerals, dan kickers — bukan dari shadow dan glass.
2. **One accent, one action.** Signal orange hanya untuk hal yang harus ditemukan mata: tombol kirim, focus ring, status tick, kursor streaming. Tidak untuk headline atau fill besar.
3. **Mesin yang terasa.** Satu-satunya "fisika" yang dipakai adalah mechanical press ala Brutalist (100ms, tegas) — bukan magnetic, bukan spotlight, bukan bounce.
4. **Motion = informasi.** Animasi hanya untuk: reveal (sekali), feedback tekan, dan streaming. Sisanya diam.
5. **Craft signals:** optical alignment, concentric radii, spacing rhythm, near-blacks (bukan #000 murni), focus-visible ring, `prefers-reduced-motion`.

## 2. Color Tokens

Tema: **light-only** (tidak ada dark mode di v1). Cool temperature — jangan campur warm.

| Token | Value | Usage |
|---|---|---|
| `--paper` | `#F4F5F6` | Page backdrop (cool paper) |
| `--surface` | `#E9EBED` | Tinted surfaces: user bubble, chip bg, wash |
| `--card` | `#FFFFFF` | Cards |
| `--ink` | `#101418` | Text utama, borders Brutalist, near-black cool |
| `--muted` | `#6E7680` | Text sekunder |
| `--faint` | `rgba(16,20,24,0.45)` | Tertiary: captions, placeholder |
| `--hairline` | `rgba(16,20,24,0.12)` | Hairline rules, card borders |
| `--accent` | `#FF4D00` | SATU aksen: send button, focus ring, status tick, kursor streaming |
| `--accent-ink` | `#FFFFFF` | Teks di atas accent |

Aturan: aksen tidak untuk background section, border kartu, atau headline. 60/30/10.

## 3. Typography

| Token | Value |
|---|---|
| `--font-display` | `Space Grotesk, sans-serif` — headline, 700, `letter-spacing: -0.02em`, `line-height: 1.05` |
| `--font-body` | `DM Sans, sans-serif` — body 16px, `line-height: 1.6` |
| `--font-mono` | `IBM Plex Mono, monospace` — kickers, index numerals, labels, stats |

**Kicker style (editorial):** mono, uppercase, `font-size: 11px`, `letter-spacing: 0.12em`, warna `--muted`. Contoh: `01 — ASK`, `02 — SELECTED WORK`.
**Index numerals:** mono, lebih besar dari judul di sebelahnya (mis. `01` 13px vs judul 16px) — sinyal editorial.
**Anti-pattern:** dilarang Inter/Roboto/Poppins sebagai voice utama; dilarang gradient text.

## 4. Spacing & Layout

- Base unit **4px**. Skala: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`.
- Content column: `max-width: 720px`, centered, padding horizontal 20px (16px mobile).
- Section gap: 48px desktop / 32px mobile. Outer padding ≥ inner padding (craft rule).
- Body max `65ch` untuk keterbacaan.

## 5. Radius System (satu DNA, concentric)

| Token | Value | Usage |
|---|---|---|
| `--r-sm` | `8px` | Buttons, input, kartu kecil |
| `--r-md` | `12px` | Cards |
| `--r-pill` | `999px` | Chips, chat dock, send button, segmented control |

Nested corners: inner radius = outer − padding (concentric). Dilarang ultra-pill untuk kartu besar.

## 6. Borders & Shadows

- **Default (editorial):** `1px solid var(--hairline)`, **tanpa shadow**. Struktur dari rules, bukan elevation.
- **Pressable (brutalist accent)** — hanya untuk elemen yang bisa ditekan (buttons, chips, send):
  ```css
  border: 1.5px solid var(--ink);
  box-shadow: 3px 3px 0 var(--ink);
  transition: transform 100ms, box-shadow 100ms;
  :active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
  ```
- **Hover (quiet luxury):** border-brightening — `border-color` dari `--hairline` ke `rgba(16,20,24,0.35)`, 150ms. Tanpa lift, tanpa tilt.
- **Glass:** HANYA di chat dock — `blur(16px) saturate(160%)`, border `1px rgba(16,20,24,0.08)`. Tidak di elemen lain.

## 7. Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--ease-lux` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default semua transisi (quiet luxury) |
| `--dur-press` | `100ms` | Mechanical press (brutalist) |
| `--dur-hover` | `150ms` | Hover states |
| `--dur-reveal` | `300ms` | Entrance |
| `--reveal` | `opacity 0→1, translateY(24px→0), blur(6px→0)` | Reveal sekali saja (`once`), stagger 60ms antar item |

**Dilarang:** shine sweep, pulsing dot (untuk konten non-live), looping typewriter, bounce easing, cursor spotlight, 3D tilt, gradient orbs, scroll-trigger berulang.
**Signature micro-interactions (final):**
1. **Mechanical press** — semua pressable: shadow collapse 100ms.
2. **Traveling tab indicator** — segmented Home/Blog: pill aktif meluncur 200ms `--ease-lux`.
3. **Placeholders-and-vanish** — placeholder dock berotasi, hilang huruf-per-huruf (bukan typewriter loop).
4. **Word-by-word streaming** — jawaban AI muncul kata-per-kata + kursor blok orange berkedip.
5. **Staggered blur reveal** — hero + kartu: sekali, 60ms stagger.
6. **Number counters** — statistik menghitung naik saat masuk viewport.

`prefers-reduced-motion: reduce` → semua motion jadi opacity-only / langsung tampil.

## 8. Iconography

- `lucide-react`, stroke `1.5px`, ukuran 16–20px, warna inherit.
- Brand icons (GitHub/LinkedIn/dsb.): pakai package **`simple-icons`**
  (bukan Lucide — Lucide **menghapus brand icons di v1**; deprecated exports-nya
  tidak bisa diandalkan). Import per-brand agar tree-shakeable.
- Emoji: dilarang sebagai ikon fungsional. Aksen copy sesekali boleh (hemat).

## 9. Accessibility (baseline)

- Kontras body ≥ 4.5:1 (AA). `--faint` hanya untuk teks non-esensial.
- Focus visible: `2px solid var(--accent)`, offset 2px — selalu terlihat.
- Touch target ≥ 44px. Semua gambar informatif wajib `alt`.
- Jangan andalkan warna saja (ikon + warna untuk status).

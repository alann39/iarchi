# Review checklist

Seperti memeriksa pesanan sebelum klik “diterima”: cocokkan hasil dengan yang
dipesan, bukan sekadar melihat paketnya sudah datang. Checklist ini diisi dengan
bukti. `NOT TESTED` lebih berguna daripada `PASS` yang hanya dugaan.

## Cara meminta review repo

1. Selesaikan task dalam satu checkpoint. Periksa diff, lalu commit/push dengan
   instruksi eksplisit kepada AI IDE atau lewat Source Control.
2. Salin branch, SHA dan URL PR. Screenshot tidak otomatis tersedia lewat source;
   lampirkan atau commit ke folder bukti yang tidak mengandung data sensitif.
3. Kirim formulir berikut ke Codex. Reviewer membaca perubahan dan melaporkan
   `PASS`, `CHANGES REQUIRED`, atau `BLOCKED — evidence missing`.
4. Terapkan koreksi yang disepakati, push commit baru, dan sebutkan SHA barunya.

```text
Review IARCHI checkpoint CP-[number].
Repository: https://github.com/alann39/iarchi
Branch: [branch]
Commit: [full SHA]
PR: [URL]
Completed tasks: [IDs]
Checks run: [command, result, relevant sanitized output]
UI evidence: [screenshots, viewport, theme, browser/OS]
Deployment: [URL if relevant; explain if access is restricted]
Known issues / owner decisions: [list]
Compare implementation with the current docs and report concrete file-level
findings, requirement IDs, severity, and the next permitted task. Do not implement
new features or mark account/dashboard checks verified from source alone.
```

## Checkpoint matrix

| Gate | Tasks | Bukti wajib | Lolos jika |
|---|---|---|---|
| CP-0 | T00–02 | SHA, package scripts, env-ignore path check, localhost UI/Studio, lint/type/build outcomes | Baseline dapat dijalankan; tidak ada secret tracked; pipeline dipahami |
| CP-1 | T03–04 | Content ledger, pemisahan pending/approved, kontrak dan tes | Fakta tidak dikarang; kontrak sesuai spec; publikasi pending diblokir |
| CP-2 | T05–07 | Schema diff, form Studio, ERD mapping, generated types, filter tests | Relasi utuh; hidden/draft/future/unverified tidak sampai public DTO |
| CP-3 | T08–10 | 4 screenshot welcome: 2 viewport × 2 theme; composer/settings states | Ukuran sesuai; owner menyetujui arah visual; keyboard/mobile berfungsi |
| CP-4 | T11–12 | 12-topic walkthrough, storage/reducer tests, cancel/reset/scroll evidence | Curated chat bekerja dengan AI off; satu transcript; recovery aman |
| CP-5 | T13–14 | Work routes, cards, actual résumé/contact, 404 tests | Data approved, tautan asli, empty states; owner memeriksa aset |
| CP-6 | T15–16 | Blog index/article, preview-vs-incognito, redirects/sitemap, context handoff | Post publik bisa diakses langsung; draft terisolasi; tidak auto-call AI |
| CP-7 | T17–20 | Exact package versions, E01–E18 results, limiter concurrency, bounded live test | Grounded answers/fallback benar; secret server-only; biaya dan limiter siap |
| CP-8 | T21–23 | 20 screenshots, accessibility checks, CI SHA, R01–R20 + L01–L12 matrix | Kandidat rilis lengkap, tidak ada blocker dan essential NOT TESTED |
| CP-9 | T24–26 | Studio/preview/prod URLs, release SHA, smoke results, recovery instructions | Website online dan owner bisa mengelola serta memulihkannya |

CP-1 boleh mencatat fakta opsional yang masih pending; fitur terkait tetap kosong.
CP-8 memerlukan semua konten esensial yang dipakai di production disetujui.
CP-7 bukan lolos jika AI hanya mock. Preview dengan AI off tetap berguna, tetapi
belum membuktikan keseluruhan MVP yang mensyaratkan grounded free-form answers.

## Launch gates L01–L12

| ID | Pemeriksaan | Bukti yang dapat diterima |
|---|---|---|
| L01 | Semua requirement R01–R20 terpenuhi atau perubahan scope disetujui tertulis | Mapping R ID → file/route/test + keputusan owner |
| L02 | Konten, foto, project status, PDF, contact disetujui | Ledger approved dan tautan aset yang diperiksa owner |
| L03 | Schema/query menjaga batas publik | Tes draft/hidden/unverified/future + referensi tersembunyi |
| L04 | Welcome, chat, blog, article, project sesuai desain | 20 screenshots, geometry notes, approval baseline |
| L05 | Input dan aksesibilitas | Keyboard, focus, IME, zoom, contrast, mobile keyboard evidence |
| L06 | Curated chat tahan error | AI off, storage unavailable/expired, cancel, retry, empty CMS |
| L07 | AI terkontrol | E01–E18, shared limits, source validation, usage cap/kill switch |
| L08 | Build dan CI | Lint, types, test, frontend + Studio build pada SHA kandidat |
| L09 | SEO/routing | Canonical/robots/sitemap, OG metadata, direct URL, 404, legacy redirect |
| L10 | Akun dan environment | Owner confirms scopes; secret names only; incognito draft isolation |
| L11 | Hosting berfungsi | Actual deployed smoke tests, TLS, assets, navigation, publish update |
| L12 | Recovery bisa dilakukan | Known-good deployment, Preview rehearsal/verified procedure, CMS backup plan |

## Detail inspeksi visual

Gunakan protokol DESIGN_SPEC. Screenshot harus tanpa browser chrome di dalam
gambar. Referensi HTML adalah bahan persetujuan desain; pengujian produk memakai
screenshot aplikasi sesudah owner menerima baseline, pada lingkungan yang sama.

- Welcome: header/hero/composer coordinates, line breaks, topic spacing.
- Thread: alignment user/assistant, paragraph measure, solid cards, follow-up gaps.
- Blog: row separators, date alignment, pagination, empty result.
- Article: heading hierarchy, 680px measure, image/quote/link/code overflow.
- Project: title/status/summary rhythm, media ratio, canonical links.
- Settings/composer: focus, Escape, restore focus, disabled/send/stop and IME.
- Jangan “memperbaiki” kegagalan dengan mengubah golden screenshot tanpa review.

## Batas pemeriksaan lewat GitHub

Source dapat menunjukkan implementasi env, tetapi tidak membuktikan nilai env sudah
diisi dengan benar di akunmu. Source dapat menunjukkan limiter, tetapi perlu tes
konkurensi untuk membuktikan counter berjalan. GitHub CI hijau tidak membuktikan
UI pixel-perfect, CORS Preview, DNS, provider billing, atau kepemilikan PDF.
Reviewer wajib memisahkan `inspected source`, `executed`, dan `owner-confirmed`.

## Setelah perubahan ide

Catat keputusan di DECISIONS; ubah requirement/spec dahulu, baru task baru T27+.
Review ulang checkpoint yang terdampak. Misalnya search blog memengaruhi CP-6/8;
ganti provider memengaruhi CP-7/8/9; ubah typography memengaruhi CP-3/5/6/8.

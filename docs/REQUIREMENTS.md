# IARCHI · product requirements v2

Authority: behavior. Updated 2026-09-19. Semua ketentuan di bawah adalah target
implementasi, bukan klaim bahwa fitur sudah ada.

## Tujuan dan pengguna

Personal website Assabigunal Awwalun: recruiter menilai pengalaman dan CV; reader
membaca tulisan; calon kolaborator melihat contoh pekerjaan dan menghubungi owner.
Keberhasilan awal: masing-masing jalur dapat diselesaikan dalam ≤3 pilihan dari
welcome, tanpa wajib mengetik atau menunggu model.

## Scope dan acceptance

| ID | Requirement | Bukti penerimaan |
|---|---|---|
| R01 | Primary navigation hanya Chat `/` dan Blog `/blog` | Dua link, active state dan keyboard benar |
| R02 | Welcome berisi nama, positioning, 3 prompt, input | Sesuai DESIGN_SPEC, data owner approved |
| R03 | Curated topics di CONVERSATION_MAP tanpa LLM | Network test: klik topic tidak memanggil provider |
| R04 | Thread user kanan; jawaban editorial kiri; rich blocks | urutan stabil, duplicate submit dicegah |
| R05 | Curated content dari Sanity; topic ID stabil | edit Studio memperbarui response setelah publish |
| R06 | Session tab dipertahankan saat route change/refresh | sessionStorage v1 validated; reset menghapus state |
| R07 | Project, résumé, contact dapat dicapai tanpa AI | deep link dan browser back bekerja |
| R08 | Blog dan work detail server-rendered | judul/body/metadata tersedia tanpa menjalankan chat |
| R09 | Blog draft tidak tampil di public route/AI | anonymous browser + query + AI leak tests |
| R10 | Free text hybrid routing ID/alias→retrieval→AI | exact curated alias tidak menagih provider |
| R11 | AI hanya approved public knowledge, bilingual | AI_SPEC evaluation pass, sumber mendukung klaim |
| R12 | Sanity Studio dan authenticated preview dipertahankan | unpublished edit terlihat hanya pada preview |
| R13 | Theme system/light/dark dan reduce transparency | setting disimpan, tak ada hydration flash signifikan |
| R14 | Mobile safe area, keyboard, zoom, focus | test 320/390/768/1440 dan 200% zoom |
| R15 | Kontras WCAG AA, target minimum 44 CSS px | contrast check + keyboard/screen reader |
| R16 | Error/empty/offline/timeout/cancel ada | tidak ada spinner tanpa akhir atau data fiktif |
| R17 | Build, lint, types dan meaningful tests lulus | log CI commit yang sama dengan review |
| R18 | SEO metadata, sitemap, canonical, robots | hanya URL public verified, preview noindex |
| R19 | Deploy frontend+Studio, HTTPS, rollback tercatat | live smoke tests dan rollback drill |
| R20 | Human-led scope dan dokumen versioned | task ID, diff, bukti PROGRESS, checkpoint |

## Routes dan state

| Path | Konten | Access/edge case |
|---|---|---|
| `/` | Welcome/thread; hash `#about`, `#experience`, `#skills`, `#services`, `#contact` | hash membuka curated topic jika kosong, tidak auto-kirim AI |
| `/?article=slug` | Chat dengan removable article context | lookup public post; invalid context abaikan + notice |
| `/blog` | 12 artikel/page; category filter URL query | empty state; pagination link; tak ada fake posts |
| `/blog/[slug]` | artikel dengan related max 3 | unknown/hidden/future → 404 |
| `/work/[slug]` | problem, role, approach, outcome, evidence | unknown/hidden → 404 |
| `/resume` | ringkasan + link PDF | jika file belum approved: unavailable state |
| `/api/chat` | POST saja, batas AI_SPEC | no cache; bukan halaman indexable |
| `/api/draft-mode/enable` | route template editor | pertahankan validasi secret resmi |
| `/posts/[slug]` | legacy redirect ke `/blog/[slug]` | hanya jika post destination valid; lainnya 404 |
| `/[slug]` | legacy page builder | tahan sementara saat audit data; retire sesudah migration check |

Chat welcome cepat: “Tell me about yourself”, “Show me your work”, “Read your notes”.
CV/contact quick actions di dock; tidak menambah primary nav. Settings small popover
untuk theme, reduced transparency, dan reset. Contact MVP email+approved social links;
tidak ada contact form backend atau WhatsApp tanpa owner supplying explicit link.

## Session, privacy, dan content

sessionStorage per-tab max 30 turns, 200KB, schemaVersion 1. Simpan teks pengguna dan
reference IDs response; resolve ulang konten CMS saat restore. Hapus invalid/expired
snapshot sesudah 24 jam. Jangan simpan token, draft, email lead, atau IP mentah.
Theme setting boleh localStorage. Jelaskan di UI: “This conversation stays in this
tab. Free-form questions are sent to an AI provider.” Privacy detail dapat dibuka di
settings tanpa primary nav baru. Error browser storage tidak memblokir chat.

Tidak ada login pengunjung, pembayaran, analytics session replay, newsletter, public
chat, upload visitor, voice, mini-game, autoplay music, atau agent tools pada MVP.
Supabase/SQL/vector DB bukan dependency. Future feature lewat change request.

Availability, employer dates, achievement, product status, URL, CV harus owner-approved.
`visibility=hidden` adalah filter website, bukan proteksi data di public Sanity dataset.
Jangan masukkan informasi perusahaan yang rahasia bahkan sebagai hidden content.

## Performance dan release budget

Target audit lokal mobile: Lighthouse ≥90 Performance, ≥95 Accessibility (bukan
sertifikasi aksesibilitas). Field goals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; laporkan
lab/field terpisah. No infinite animation; maksimal header+composer blur simultan,
gambar responsif, font sistem, dynamic-import AI UI jika memungkinkan. Curated
interaction target ≤150ms setelah data loaded, tidak ditunda oleh fake typing.

Full MVP release hanya setelah CP-0…CP-9 lulus. AI-disabled preview boleh digunakan
untuk testing, tidak boleh diklaim full MVP selesai. Budget/model/account choice
dicatat sebelum panggilan berbayar diaktifkan.

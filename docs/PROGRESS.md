# Progress ledger

Dokumentasi v2 disusun pada 19 September 2026. **Implementasi produk belum dimulai
dalam paket revisi ini.** File docs/design/reference.html adalah prototype dokumen,
bukan frontend aplikasi yang sudah terhubung CMS/AI. Tidak ada klaim setup, tes
aplikasi, pembayaran provider, deployment atau konten telah disetujui.

Baseline source yang diperiksa: `fab2d8ca0d979053a360e836d5fcb9d088bcf1e6`.
Dokumentasi berada di PR #1, branch `docs/beginner-development-module`.
Gunakan SHA terbaru PR saat checkout; perubahan dokumentasi tidak mengubah baseline
implementasi. Setelah task pertama, catat SHA kode aktual di resi task.

## Status task

| Task | Hasil | Status |
|---|---|---|
| T00 | Audit checkout lokal | NOT STARTED |
| T01 | Setup starter dan akun | NOT STARTED |
| T02 | Baseline tooling | NOT STARTED |
| T03 | Owner content verification | NOT STARTED |
| T04 | Typed contracts | NOT STARTED |
| T05 | Core CMS schemas | NOT STARTED |
| T06 | Related content schemas | NOT STARTED |
| T07 | Queries/public filters | NOT STARTED |
| T08 | Tokens/shell | NOT STARTED |
| T09 | Welcome/navigation | NOT STARTED |
| T10 | Composer/settings | NOT STARTED |
| T11 | Curated routing | NOT STARTED |
| T12 | Session/scroll/cancel | NOT STARTED |
| T13 | Portfolio blocks/pages | NOT STARTED |
| T14 | Résumé/contact | NOT STARTED |
| T15 | Blog reader | NOT STARTED |
| T16 | Preview/SEO/context | NOT STARTED |
| T17 | SDK/mock adapter | NOT STARTED |
| T18 | Grounded generation | NOT STARTED |
| T19 | SDK UI transport | NOT STARTED |
| T20 | Limits/evaluation | NOT STARTED |
| T21 | Pixel/accessibility review | NOT STARTED |
| T22 | Release tests/CI | NOT STARTED |
| T23 | Release readiness | NOT STARTED |
| T24 | Studio/Vercel preview | NOT STARTED |
| T25 | Production/domain | NOT STARTED |
| T26 | Recovery/handover | NOT STARTED |

CP-0 sampai CP-9: **NOT REVIEWED**. L01 sampai L12: **NOT TESTED**.
Status yang boleh dipakai: NOT STARTED, IN PROGRESS, BLOCKED, READY FOR REVIEW,
CHANGES REQUIRED, COMPLETE. COMPLETE membutuhkan acceptance task, bukan jumlah file.

## Resi per task — isi setelah pekerjaan nyata

```text
Task / date:
Branch / code commit SHA:
Requirement IDs:
Files changed:
What the owner observed:
Commands executed and outcomes:
Tests not run, and why:
Screenshots: file links + viewport/theme/browser/OS/DPR
Account/dashboard checks: owner-confirmed, not source-inferred
Open defects and pending decisions:
Checkpoint verdict / reviewer / reviewed SHA:
Next task:
```

Jangan memasukkan token, env values, raw customer data atau full IP di bukti.
Kalau kode berubah setelah review, cantumkan SHA baru dan ulangi cek terdampak.

## Pencatatan rilis

Belum ada release. Saat T25 selesai, isi release SHA, Production URL, deployment ID,
Studio URL, tanggal smoke test, owner confirmation dan known-good rollback target.

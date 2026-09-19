# Changelog

## 2.0.0 — 19 September 2026

Revisi paket dokumentasi; belum mengimplementasikan aplikasi.

| Masukan owner | Perubahan konkret |
|---|---|
| Analogi terlalu kaku | Penjelasan kontak, WhatsApp, CV, paket, pola baju sebelum tiap task |
| Schema dan ERD kurang | DATA_MODEL: relational overview dokumen Sanity, 2 ERD, field/validation/reference/migration |
| UI kurang detail / AI slop | DESIGN_SPEC: semantic tokens, koordinat, 5 screen blueprints, dark/light, states; reference.html interaktif |
| Prompt terlalu umum | PROMPT_PLAYBOOK: T00–T26, input docs, file scope, langkah, acceptance, stop condition |
| Prefix berulang | AGENTS.md memuat aturan menetap; verifikasi IDE satu kali, Next rule dipertahankan |
| IDE disuruh draft docs | Requirements/architecture/data/content/conversation/AI/setup/review/decisions/progress disediakan |
| Setup kurang rinci | SETUP Windows + DEPLOYMENT Studio/Vercel/env/CORS/DNS/rollback step-by-step |
| AI SDK kurang konkret | AI_SPEC: exact contracts, explicit provider, retrieval, validated output, SDK transport, limiter, E01–E18 |

Revisi utama dari v1: post/settings starter dipertahankan; draft isolation dijelaskan
sesuai perilaku Sanity live; public dataset bukan tempat data privat; initial Vercel
import bisa Production; source SDK versions dibedakan dari versi registry terpasang.

## 1.0.0 — initial documentation PR

Modul pemula pertama dalam PR #1. Digantikan struktur buku kerja v2 setelah review
owner. Riwayat tetap dapat dibaca melalui commit PR; bukan instruksi aktif.

# 00 — Project Constitution (Rules of Law)

> Hukum dasar repo `iarchi`. Coding agent **dilarang** melanggar aturan ini.
> Jika ada konflik antara instruksi task dan dokumen ini, dokumen ini menang.
> Perubahan aturan hanya lewat edit file ini + persetujuan Archi.

## 1. Coding Standard

- **Strict TypeScript**: `strict: true`, `noImplicitAny`. Dilarang `any` — gunakan `unknown` + type narrowing, atau definisikan tipe di `sanity.types.ts` / tipe lokal.
- **Styling**: Tailwind CSS only. Dilarang inline `style={{...}}` kecuali untuk nilai dinamis yang tidak bisa diwakili class (mis. durasi animasi dari data).
- **Components**: React Server Components by default. `"use client"` hanya untuk komponen interaktif (chat input, animasi state, event handler).
- **Bahasa**: UI dalam Bahasa Inggris (portfolio publik). Komentar kode boleh Indonesia/Inggris, yang penting jelas.
- **No dead code**: jangan tinggalkan komponen/fungsi yang tidak dipakai. Template bawaan yang tidak terpakai dihapus, bukan dikomen.

## 2. Security & Data

- **API keys hanya di server**: `LLM_API_KEY`, `LLM_BASE_URL`, `SANITY_API_TOKEN` (jika dipakai) wajib via `process.env` di server. Dilarang prefix `NEXT_PUBLIC_` untuk secret apapun.
- **Satu-satunya pemanggil LLM adalah `app/api/chat/route.ts`**. Client tidak pernah memanggil provider LLM langsung.
- **Rate limit** wajib di `/api/chat`: max 20 request/menit per IP (in-memory, cukup untuk v1). Lebih dari itu → HTTP 429 dengan error schema standar.
- **Jangan log konten user** ke console/file. Log hanya metadata: timestamp, durasi, error code.
- **System prompt tidak boleh bocor**: jangan pernah mengembalikan system prompt / konteks internal ke client, bahkan jika user memintanya ("ignore previous instructions" → tolak dengan sopan).

## 3. Content Ownership

- **Konten portfolio adalah data, bukan kode.** Profil, projects, experience, skills, kontak, suggested questions hidup di **Sanity Studio**. Komponen hanya me-render.
- Dilarang hardcode data portfolio di file `.tsx`/`.ts` (kecuali fallback darurat yang ditandai `// FALLBACK:`).
- Perubahan konten tidak boleh butuh redeploy — mengandalkan ISR/fetch Sanity.

## 4. Observability

- Setiap kegagalan di API route wajib me-return error schema standar (`{type:"error", code, message}`) — dilarang `try/catch` kosong atau `console.log` doang.
- Error yang terlihat user harus ramah ("Hmm, otaknya lagi loading… coba lagi ya") bukan stack trace.

## 5. SDD Invariant (Fix the Spec, Not the Code)

- Jika hasil agent menyimpang dari ekspektasi: **jangan patch kode manual**. Cari klausul spec yang ambigu di `specs/`, perbaiki spec-nya, lalu minta regenerate.
- Setiap task di `04-TASKS.md` adalah 1 unit kerja. Dilarang menyentuh file di luar "Files Affected" task tersebut.

## 6. Verification

- Setiap task wajib lolos `npm run build` (frontend workspace) tanpa error TypeScript/ESLint sebelum dianggap selesai.
- Preferensi verifikasi via CLI (`curl`, script node) dibanding klik manual di browser.

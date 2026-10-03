# 07 — UX Flows

> Alur visitor end-to-end + edge cases. Setiap flow: pemicu → langkah → hasil yang
> diharapkan. Edge cases wajib ditangani sesuai tabel — bukan opsional.

## Flow 1 — First Visit (happy path)

1. Visitor membuka `/` → melihat header, availability pill, hero, suggested questions, chat dock.
2. Visitor tap suggested question → pertanyaan terkirim sebagai bubble user.
3. SuggestedQuestions card collapse; typing indicator muncul.
4. AI streaming jawaban: teks + kartu kaya (mis. ProjectCards).
5. Visitor lanjut bertanya bebas via dock.
6. **Hasil:** visitor paham siapa Archi dalam < 2 menit tanpa scroll panjang.

## Flow 2 — Explore Projects

1. Visitor: `"What have you built?"`
2. AI memanggil `show_projects` → 3–6 ProjectCard muncul di bubble AI.
3. Visitor tap link GitHub/Demo di kartu → tab baru.
4. **Hasil:** visitor bisa menilai kualitas kerja langsung dari chat.

## Flow 3 — Download CV

1. Visitor tap `"Download CV"` di dock.
2. Jika `cvUrl` ada → file terdownload, toast konfirmasi `"CV downloaded ✓"`.
3. Jika kosong → tombol disabled, tooltip `"CV coming soon"`.
4. **Hasil:** tidak pernah ada tombol mati yang membingungkan.

## Flow 4 — Let's Talk

1. Visitor tap `"Let's Talk!"` → `mailto:contactEmail` terbuka (subject prefilled: `"Hi Archi — found your portfolio"`).
2. Jika email kosong → tombol disembunyikan (bukan disabled).
3. **Hasil:** jalur kontak selalu jelas.

## Flow 5 — Full Story

1. Visitor tap `"Tell me your full story ⚡️"`.
2. Client mengirim pesan tersembunyi: `"Tell me your full story as a narrative bio (max 400 words)."`
3. AI menjawab dengan `show_profile` + narasi panjang (batas 400 kata, boleh 2–3 bubble).
4. **Hasil:** visitor yang mau deep-dive dapat bio lengkap tanpa harus bertanya bertubi-tubi.

## Flow 6 — Blog

1. Visitor tap tab `Blog` → `/blog`: daftar post + search.
2. Tap kartu → `/posts/[slug]`: artikel full + tombol back.
3. **Hasil:** konten long-form tetap accessible di luar chat.

## Flow 7 — Contact Discovery

1. Visitor: `"How can I contact you?"` / `"socials?"`
2. AI memanggil `show_contact` → ContactCard rows (email, GitHub, LinkedIn, Instagram, X).
3. **Hasil:** tidak perlu berburu link di footer (tidak ada footer).

---

## Edge Cases (wajib ditangani)

| # | Situasi | Penanganan |
|---|---|---|
| E1 | LLM timeout (>30s) / 500 | Bubble error ramah + tombol `Retry` (kirim ulang pesan terakhir). Jangan tampilkan stack trace. |
| E2 | Rate limit 429 | Pesan `"Whoa, lots of questions! …"` tanpa retry button. |
| E3 | Sanity kosong (belum isi konten) | Jangan render halaman kosong: tampilkan hero + teks `"Portfolio content coming soon — check back later!"`. Chat jawab: `"My owner hasn't fed me data yet. Come back soon!"` |
| E4 | Pertanyaan di luar konteks ("resep rendang?") | Jawab sopan: `"I'm Archi's portfolio AI — I only know about Archi. Ask me about his projects, experience, or contact!"` |
| E5 | Prompt injection ("ignore instructions…") | Tolak sopan (Constitution §2). Jangan bocorkan system prompt / tools / model name. |
| E6 | Jawaban sangat panjang | Auto-clamp: AI diinstruksikan ≤120 kata (kecuali full story). Client juga clamp bubble dengan `"Show more"` expand. |
| E7 | Mobile keyboard menutupi dock | Dock `position: fixed` + `visualViewport` handling; textarea blur → layout kembali normal. |
| E8 | Gambar cover rusak / URL mati | `onError` → placeholder gradient + inisial judul. Jangan tampilkan broken-img icon. |
| E9 | User kirim pesan kosong / spam tap send | Tombol disabled saat kosong (UI-SPEC §8). Pesan >2000 char → tolak client-side dengan hint. |
| E10 | Koneksi putus mid-stream | EventSource error → bubble parsial tetap tampil + tombol `Retry`. |

## Conversation Guardrails (untuk system prompt)

- Bahasa: Inggris. Nada: friendly, concise, sedikit playful. Tidak formal kaku.
- Jawab HANYA dari FACTS (konten Sanity). Tidak mengarang project/pengalaman.
- Maksimal 120 kata per jawaban teks (kecuali Flow 5).
- Selalu tawarkan follow-up di akhir jawaban panjang ("Want to see the demo?").
- Jangan pernah menyebut "sebagai AI" secara berlebihan; persona = "Archi's portfolio assistant".

# AI setup · langkah akun dan environment

Jalankan saat T17–T20, setelah curated chat berfungsi. Seperti memasukkan kartu SIM:
library adalah perangkatnya, key adalah aksesnya, model adalah layanan yang dipilih.
Jangan menaruh key di prompt AI IDE. Guide ini memakai kandidat Google langsung dan
Upstash; keputusan aktivasi/budget dicatat owner di DECISIONS terlebih dahulu.

## A-01 · Siapkan akses Google

1. Buka [Google AI Studio](https://aistudio.google.com/), masuk memakai akunmu.
2. Buka Dashboard → Projects. Akun baru mungkin sudah punya default project.
   Untuk project yang belum muncul, pilih Import projects dan pilih project milikmu.
3. Buka API Keys. Pilih Create API key untuk project IARCHI yang benar. Gunakan key
   baru bertipe Authorization/Auth sesuai alur akun saat ini; jangan menyalin key
   Standard lama dari tutorial. Panduan Google saat audit menjelaskan migrasi ini.
4. Salin key langsung ke `frontend/.env.local` sebagai
   `GOOGLE_GENERATIVE_AI_API_KEY=nilai_asli`. Simpan file lokal, bukan commit.
5. Jangan membuat global environment variable Windows untuk proyek ini. Adapter
   IARCHI membaca nama di atas secara eksplisit; contoh Google SDK yang memakai
   GEMINI_API_KEY adalah library/config lain.
6. Jika tombol pembuatan key ditolak permission, pastikan project milik akun yang
   benar; jangan memakai project kantor yang tidak diotorisasi.

Rujukan primer: [Google API keys](https://ai.google.dev/gemini-api/docs/api-key).

## A-02 · Pilih model dan batas pengeluaran

1. Di akun provider, buka katalog model yang tersedia untuk project itu. Pilih model
   teks yang mendukung structured output melalui adapter yang dipasang T17.
2. Salin **model ID API**, bukan display name, ke `AI_MODEL`. Jangan menebak suffix
   versi atau menganggap model contoh lama masih aktif.
3. Periksa quota/rate limit, ketentuan pemakaian data dan billing yang ditampilkan
   untuk akunmu. Catat pilihan model dan maksimum pengeluaran yang kamu setujui.
4. Aktifkan alert/budget control yang tersedia. Alert bukan hard spending stop;
   limiter aplikasi juga bukan pengganti kebijakan billing provider.
5. Biarkan AI_FALLBACK_MODEL kosong sampai model cadangan dan biaya disetujui.
6. Simpan `AI_ENABLED=false` sampai limiter siap; T18 boleh memakai mock provider.

## A-03 · Buat penyimpanan counter bersama

1. Buka [Upstash Console](https://console.upstash.com/) dan login.
2. Pilih Redis → Create Database. Nama contoh `iarchi-limits`.
3. Pilih primary region dekat lokasi server Vercel yang akan menulis counter.
   Review plan dan limits sebelum Create/Next; tidak diasumsikan gratis.
4. Buka database tersebut. Cari bagian Connection/REST; copy **HTTPS REST URL** dan
   **Token** ke UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN.
5. Gunakan token yang boleh menulis counter, bukan Readonly Token. Jangan menyalin
   password koneksi Redis TCP sebagai REST token.
6. Simpan secret hanya di frontend server env. IARCHI memakai Redis untuk counter
   berumur pendek, bukan menyimpan chat atau mengganti Sanity.

Rujukan: [create database](https://upstash.com/docs/redis/overall/getstarted) dan
[REST credentials](https://upstash.com/docs/redis/features/restapi).

## A-04 · Isi konfigurasi lokal dengan aman

Di Explorer IDE, buka `frontend/.env.local`. Tambahkan satu baris per variable;
jangan overwrite konfigurasi Sanity yang sudah ada. Daftar ini menunjukkan nama
dan contoh placeholder saja—placeholder harus diganti sendiri dan bukan key valid:

```dotenv
AI_ENABLED=false
GOOGLE_GENERATIVE_AI_API_KEY=REPLACE_LOCALLY
AI_MODEL=REPLACE_WITH_APPROVED_MODEL_ID
AI_MAX_OUTPUT_TOKENS=800
SITE_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=REPLACE_WITH_HTTPS_REST_URL
UPSTASH_REDIS_REST_TOKEN=REPLACE_LOCALLY
RATE_LIMIT_SALT=REPLACE_WITH_RANDOM_SECRET
```

Gunakan password manager untuk membuat random secret minimal32 bytes atau minta AI
IDE menjalankan generator lokal yang menulis salt langsung ke file tanpa menampilkan
nilainya. Jangan gunakan nama, tanggal lahir, project ID atau string `secret`.

1. Save. Jalankan `git check-ignore frontend/.env.local` dari root; path harus tampil.
2. Jalankan `git ls-files frontend/.env.local`; hasil harus kosong. Jika tracked,
   jangan commit/push; minta perbaikan tracking dan penilaian apakah key telah bocor.
3. Restart dev server setelah perubahan env. File ini dibaca server saat runtime/startup;
   jangan mengharapkan browser refresh saja selalu cukup.
4. AI IDE boleh memeriksa keberadaan/nama variable, tanpa mencetak value.

## A-05 · Urutan uji sebelum live

1. T17: disabled mode → pertanyaan curated bekerja; tidak ada network provider.
2. T18–19: mock terlabel → retrieval, validator dan status/final envelope bekerja.
3. T20: shared limiter + provider mock → 6 permintaan dalam window menolak yang
   melebihi batas; pengujian paralel tidak membiarkan provider attempt melewati cap.
4. Selesaikan evaluator E01–E18, lalu dengan instruksi owner lakukan live smoke
   terbatas. Set flag true hanya pada environment uji yang siap, restart server.
5. Tanyakan satu pertanyaan supported free-form; periksa source sebenarnya. Tanyakan
   pertanyaan unsupported; jawabannya harus fallback tanpa fakta karangan.
6. Periksa usage di akun provider dan counter di Redis. Jangan log prompt atau token.
7. Kembalikan flag false jika account, limiter atau grounded answer belum benar.

## A-06 · Pindahkan ke Vercel

1. Project → Settings → Environment Variables → Add variable.
2. Isi nama persis, tempel value langsung ke field. Pilih Preview atau Production
   sesuai tabel DEPLOYMENT; jangan aktifkan production sekadar untuk mencoba.
3. Buat RATE_LIMIT_SALT berbeda untuk Preview dan Production. Kode T20 harus
   memakai prefix counter berbeda yang diturunkan dari environment server.
4. Save → redeploy deployment environment terkait. Ulangi smoke test di URL aktual.
5. Catat keberhasilan, model ID dan SHA di PROGRESS, tanpa secret/screenshot secret.

## Jika gagal

| Gejala | Periksa dahulu | Jangan lakukan |
|---|---|---|
| Missing key | Nama env, file frontend, restart/redeploy | Menaruh key dalam komponen React |
| Provider auth gagal | Project/key type/status, adapter installed version | Mengaktifkan fallback untuk menutupi key salah |
| Model not found | Exact model ID dan akses akun | Mengganti model acak berbayar |
| 429 | Bedakan limiter aplikasi vs quota provider | Retry loop tanpa batas |
| Redis unauthorized | REST token bukan read-only/TCP password | Menonaktifkan limiter agar request lolos |
| Jawaban tidak muncul | Validator/source IDs, safe outcome code | Merender raw output yang ditolak validator |
| Preview berhasil, prod gagal | Env scope, redeploy, origin, counter prefix | Menyalin seluruh env tanpa memahami scope |

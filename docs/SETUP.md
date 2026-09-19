# Setup step by step · Windows 10/11 + IDE AI

Gunakan PowerShell pada terminal IDE. Tiap code block dijalankan satu baris per giliran,
dari folder yang disebutkan. Kata dalam `<...>` harus diganti, bukan diketik literal.
Tutorial ini tidak mengubah komputer atau akunmu sampai kamu menjalankannya sendiri.

## S-01 · Install alat

Analogi: sebelum mengikuti resep, pastikan kompor dan wajan tersedia. Node menjalankan
aplikasi; npm mengambil package; Git mencatat perubahan.

1. Install Git dari [Git for Windows](https://git-scm.com/downloads/win), default installer.
2. Install Node.js **24 LTS** dari [Node downloads](https://nodejs.org/en/download).
   Pilih Windows installer sesuai CPU (umumnya x64). Hindari Current untuk tutorial ini.
   Node24 adalah baseline proyek yang dipilih, konsisten lokal/CI/Vercel saat T02.
3. Tutup lalu buka kembali IDE agar PATH diperbarui.
4. Buka Terminal → New Terminal → PowerShell.

```powershell
git --version
node --version
npm.cmd --version
```

Expected: versi Git; Node v24.x; npm version. Jika npm.ps1 diblokir execution policy,
gunakan `npm.cmd` untuk semua contoh `npm`. Jangan melemahkan execution policy global.
Jika command not found, restart terminal dan periksa instalasi sebelum lanjut.

Root template mencatat npm11.6.2. Untuk matching awal:

```powershell
npm.cmd install --global npm@11.6.2
npm.cmd --version
```

Jika permission gagal, hentikan dan diagnosis instalasi; jangan paksa administrator
tanpa memahami lokasi Node. Mac/Linux: install Node24/Git via metode resmi pilihanmu;
command git/npm sama, perbedaan copy-file diberikan di S-05.

## S-02 · Ambil repository yang benar

Analogi: download foto adalah salinan biasa; clone Git seperti salinan yang tetap
terhubung ke album asal dan riwayat perubahan.

1. Buat folder kerja, misalnya `C:\Projects`, melalui File Explorer.
2. Buka PowerShell di folder itu (File → Open folder pada IDE).
3. Jika belum punya clone:

```powershell
git clone https://github.com/alann39/iarchi.git
cd iarchi
git remote -v
git status
```

Expected remote origin menunjuk alann39/iarchi. Jika sudah punya clone, buka root
yang berisi package.json, frontend, studio; jangan clone di dalam folder frontend.

PR #1 masih belum merge pada audit v2. Untuk membaca paket sebelum merge:

```powershell
git fetch origin
git switch --track origin/docs/beginner-development-module
```

Jika branch lokal sudah ada, cukup `git switch docs/beginner-development-module`.
Setelah PR merged dan worktree bersih:

```powershell
git switch main
git pull --ff-only origin main
git switch -c phase/00-local-baseline
```

Jika git status menunjukkan perubahanmu, simpan/commit di branch terlebih dahulu;
jangan reset/delete agar bisa pindah branch. Public repo dapat diclone tanpa token;
push nanti gunakan browser sign-in Git Credential Manager, bukan tempel PAT ke chat.

## S-03 · Pastikan AI membaca AGENTS sekali per sesi

Analogi: memberi orang alamat file belum membuktikan dia sudah membacanya.

1. Buka **root repo** di IDE, bukan hanya folder frontend.
2. Buka chat AI baru dan kirim:

```text
Read AGENTS.md, docs/DEVELOPMENT_GUIDE.md, and docs/PROGRESS.md.
Confirm the actual files loaded, current branch, and the next task ID.
Summarize the working agreement in Indonesian. Do not edit files yet.
```

3. Cocokkan jawabannya: satu task, approval rencana, no invented content, fixed specs.
4. Jika IDE tidak auto-load AGENTS, gunakan fitur attach-file/context rule IDE untuk
   root AGENTS. Nama menu berbeda; pilih aturan selalu berlaku pada repository ini.
5. `CLAUDE.md` sudah menunjuk `@AGENTS.md`; jangan menggandakan isi menjadi dua aturan.
6. Di sesi berikutnya cukup “Lanjut Txx, baca AGENTS.md dan PROGRESS.md.” Tidak perlu
   prefix panjang atau copy ulang spesifikasi. Ini pengecekan konteks, bukan prompt boilerplate.

## S-04 · Install dependency reproducibly

Analogi: pakai daftar belanja yang sama agar hasil resep tidak berubah sendiri.

Dari root:

```powershell
npm ci
git status --short
```

`npm ci` memakai package-lock dan mengganti node_modules lokal; jangan menjalankannya
di tengah dev server yang aktif. Harus selesai exit0 tanpa mengubah lockfile. Jika
lock dan package.json tidak sinkron, simpan error dan jalankan T01 diagnosis; jangan
hapus lockfile atau `npm audit fix --force`. Versi aktual bisa berbeda dari range
package.json; lihat `npm ls next react sanity --depth=0 --workspaces`.

## S-05 · Buat/hubungkan project Sanity

Analogi: Studio adalah aplikasi untuk mengedit album; dataset adalah album online.
Clone kode Studio belum otomatis membuat album atau menghubungkannya ke akunmu.

1. Buka [Sanity Manage](https://www.sanity.io/manage), login dengan akun milikmu.
2. Lihat daftar projects. Jika sudah ada project untuk IARCHI, pilih itu—jangan buat
   project kedua karena frontend belum terbuka.
3. Jika belum ada, Create project, nama IARCHI; review plan/kuota yang tampil.
4. Project settings → catat Project ID (public identifier, bukan secret).
5. Datasets → pastikan `production` ada. Untuk portfolio pilih public dataset berisi
   informasi yang memang boleh publik. Jangan menganggap hidden field sebagai private.
6. API → Tokens → Add API token → nama `iarchi-web-read` → read-only/Viewer permission
   yang sesuai fitur plan. Jangan pilih Editor/Admin. Simpan key di password manager.
7. Jika read token scope untuk preview tidak tersedia pada plan, catat dan diskusikan;
   jangan menonaktifkan autentikasi preview untuk mengatasinya.

Buat env hanya jika belum ada. PowerShell dari root:

```powershell
Test-Path frontend/.env.local
Test-Path studio/.env.local
```

Jika masing-masing False:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
Copy-Item studio/.env.example studio/.env.local
```

Jika True, edit file yang ada, jangan overwrite. Mac/Linux gunakan `cp` untuk target
yang belum ada. Buka file melalui IDE dan isi secara lokal:

| File | Nama | Nilai yang kamu isi |
|---|---|---|
| frontend/.env.local | NEXT_PUBLIC_SANITY_PROJECT_ID | project ID |
| frontend/.env.local | NEXT_PUBLIC_SANITY_DATASET | production |
| frontend/.env.local | NEXT_PUBLIC_SANITY_API_VERSION | 2025-09-25 sesuai template, jangan date hari ini otomatis |
| frontend/.env.local | NEXT_PUBLIC_SANITY_STUDIO_URL | http://localhost:3333 |
| frontend/.env.local | SANITY_API_READ_TOKEN | read token rahasia |
| studio/.env.local | SANITY_STUDIO_PROJECT_ID | ID yang sama |
| studio/.env.local | SANITY_STUDIO_DATASET | production |
| studio/.env.local | SANITY_STUDIO_PREVIEW_URL | http://localhost:3000 |
| studio/.env.local | SANITY_STUDIO_STUDIO_HOST | kosong saat lokal |

Jangan isi API key model dulu. Jangan tempel env ke chat AI. Cek hanya path ter-ignore:

```powershell
git check-ignore frontend/.env.local studio/.env.local
git ls-files -- frontend/.env.local studio/.env.local
```

Expected first command menunjukkan dua path; second kosong. Jika second berisi path,
hentikan push dan minta diagnosis tracked secret. Rotate jika sudah pernah terkirim.
Root `.gitignore` punya `.env*` di akhir: existing examples sudah tracked, tapi example
baru bisa ikut di-ignore. T02 merapikan pattern dengan exception `.env.example` terakhir.

## S-06 · CORS dan preview

Analogi: daftar tamu menentukan browser dari alamat mana boleh mengakses layanan;
ini bukan gembok yang membuat semua data publik menjadi rahasia.

1. Sanity project → API → CORS origins → Add origin.
2. `http://localhost:3333` → credentials ON untuk Studio login.
3. `http://localhost:3000` → credentials ON hanya karena setup ini memakai authenticated
   visual preview/browser token. Public read-only browser tanpa preview dapat OFF.
4. Gunakan origin persis, tidak ada path `/blog`, tidak ada wildcard `*`.
5. Save. Jika memakai port lain, tambah origin port itu; localhost dan127.0.0.1 berbeda.

Server-to-Sanity fetch tidak terkena browser CORS. Error401/token bukan diperbaiki
dengan wildcard. Template `defineLive` memiliki serverToken dan browserToken: pada
authenticated Draft Mode, read token memang bisa dikirim ke browser editor oleh
library. Jangan mengklaim token itu tidak pernah masuk browser; anonymous session
tetap tidak boleh menerimanya. Uji T07/T16. [Sanity CORS](https://www.sanity.io/docs/content-lake/cors).

## S-07 · Typegen dan menjalankan server

Analogi: sebelum memakai formulir baru, cetak ulang daftar kolom agar aplikasi mengenalnya.

Dari root, secara berurutan:

```powershell
npm run sanity:typegen --workspace=studio
npm run sanity:typegen --workspace=frontend
```

Jangan dua command di atas paralel karena shared schema output. Sesudah berhasil,
terminal A (root):

```powershell
npm exec --workspace=frontend -- next dev
```

Terminal B baru (root):

```powershell
npm exec --workspace=studio -- sanity dev
```

Ini menghindari predev ganda saat baseline. Browser buka localhost3000 dan3333.
Studio login dengan akun pemilik project. Kosongnya dataset wajar; tidak perlu import
sample data. Root `npm run import-sample-data` memakai --replace, jangan jalankan.
T02 merapikan `npm run dev` jika diperlukan agar pengalaman berikutnya sederhana.

Untuk berhenti tekan Ctrl+C di terminal yang menjalankan server. Setelah edit env,
stop lalu run lagi. Tombol refresh browser saja tidak mereload environment server.

## S-08 · Baseline dan troubleshooting

Terminal C root:

```powershell
npm run lint
npm run type-check
npm run build --workspace=frontend
npm run build --workspace=studio
```

Tulis hasil di PROGRESS, bukan sekadar “jalan”. Build bisa memerlukan koneksi Sanity
dan unduhan font starter. Error jaringan dicatat terpisah, jangan menonaktifkan type
check agar build hijau. Penggantian font sistem memang direncanakan di T08.

| Gejala | Cek pertama | Bukti berhasil |
|---|---|---|
| EADDRINUSE | port dipakai server lain; tutup terminal server yang kamu kenal | URL terminal sesuai CORS |
| Project not found | ID typo dan akun Sanity member | Studio menampilkan dataset |
| Unauthorized | read token permission dan env path | no401 pada server log |
| Schema invalid | first validation error, registration/schema fields | generate exit0 |
| Empty page | dataset belum publish vs failed query | empty state, no runtime crash |
| Module not found | npm ci root dan workspace deps | npm ls compatible |

## S-09 · Save point dan review GitHub

Analogi: commit adalah save game dengan judul yang menjelaskan progresnya.

1. `git diff --stat`, buka perubahan di Source Control. Jangan stage env.
2. Stage file relevan dengan tombol `+` di IDE atau `git add docs/PROGRESS.md`.
3. `git diff --cached` memeriksa apa yang benar-benar akan dicommit.
4. `git commit -m "chore: verify local starter baseline"`.
5. `git push -u origin phase/00-local-baseline` (login browser jika diminta).
6. GitHub → Compare & pull request; base main, compare branch ini.
7. Kirim URL PR + CP-0 + manual checks ke Codex. Review tidak otomatis merge.

Setelah merge, switch main dan `git pull --ff-only` hanya jika worktree bersih.
Sebelum merge PR dokumentasi, workflow formatter bawaan mungkin butuh ECOSPARK
secrets yang tidak kamu punya. T02 mengganti workflow itu dengan formatting check
read-only sesuai repo sendiri; jangan meminta credential organisasi template.

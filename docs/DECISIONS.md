# Decision log

Tanggal spesifikasi: 19 September 2026. “Specified” berarti pilihan dalam paket
revisi untuk direview, bukan klaim owner telah menyetujui atau fitur sudah dibangun.
Implementasi mulai setelah owner menerima scope task terkait.

| ID | Status | Keputusan dan alasan | Dampak |
|---|---|---|---|
| D01 | User instruction | Human-led IDE coding; satu task per sesi, plan dan diff dapat diperiksa | AGENTS + playbook menggantikan prompt prefix |
| D02 | Specified, source-audited | Pertahankan starter npm workspaces frontend/studio | Tidak membuat app atau database kedua |
| D03 | Specified | Extend Sanity post/settings; singleton siteSettings dipertahankan | Tidak ada rename blogPost/siteSettings type yang merusak data |
| D04 | Specified | Sanity document store + references; ERD konseptual | Tidak menambah SQL/Supabase/vector database untuk portfolio |
| D05 | Specified | Dua primary destinations: Chat dan Blog; detail URL tetap publik | Navigasi sederhana dan SEO dapat bekerja |
| D06 | Specified | Curated topics berfungsi tanpa LLM; AI untuk free-form supported questions | Biaya tidak diperlukan untuk membuka portfolio |
| D07 | Revised from v1 | Neutral dark/light, material hanya di controls/navigation | Tidak memakai ambient glow, neon blobs atau semua kartu glass |
| D08 | Specified | Original Apple-inspired web design, system fonts, fixed tokens | Bukan salinan native Liquid Glass; visual owner approval sebelum baseline |
| D09 | Specified | Vercel AI SDK + explicit provider; structured final answer tervalidasi | Status streaming diperbolehkan; raw partial answer tidak dirender |
| D10 | Candidate, owner pending | Direct Google provider; model ID dipilih dari akun aktual saat T17–20 | Tidak menganggap kuota gratis/model tersedia; AI default off |
| D11 | Candidate, owner pending | Upstash shared limiter untuk deployment multi-instance | Akun/biaya dikonfirmasi; memory-only limiter tidak diterima production |
| D12 | Specified | Vercel frontend + hosted Sanity Studio | Root workspace files harus tersedia saat build |
| D13 | Specified | Public dataset hanya berisi data yang boleh diketahui publik | visibility hidden adalah filter UX, bukan kontrol akses |
| D14 | Specified | SessionStorage terbatas; tanpa server-side chat history | TTL/version/recovery jelas, tidak membuat akun pengunjung |
| D15 | User instruction | Semua foundation docs ditulis di repo bersama modul | IDE mengimplementasikan, bukan menentukan requirement sendiri |
| D16 | Specified | Node 24 LTS; dependency exact versions diverifikasi saat install | Source-main SDK version bukan jaminan versi registry |

## Owner decisions yang masih diperlukan

| Item | Kapan | Pilihan yang dibutuhkan | Jika belum ada |
|---|---|---|---|
| Fakta dan aset portfolio | T03 sebelum publikasi | Ledger CONTENT_INVENTORY: approved/pending + data asli | Konten terkait tidak dipublish |
| Arah visual | T08–10 | Setujui atau beri ukuran/copy yang ingin direvisi dari reference.html | Belum membuat golden screenshot produk |
| Provider/model/budget | T17–20 | Model valid, billing limit, fallback diizinkan atau tidak | AI_ENABLED=false |
| Shared limiter | T20 | Akun dan region/config yang dipilih | Public AI tetap off |
| Nama host Studio | T24 | Subdomain Studio tersedia yang diinginkan | Belum deploy Studio |
| Domain web | T25, opsional | Domain milik owner atau Vercel default | Domain Vercel cukup untuk online |

## Format keputusan baru

Tambahkan ID berikutnya, tanggal, masalah pengguna, pilihan yang dipertimbangkan,
keputusan owner, requirement/task terdampak, dan checkpoint yang perlu diulang.
Jangan menghapus keputusan lama; tandai superseded dan tautkan penggantinya.

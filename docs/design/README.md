# Membuka referensi tampilan

1. Checkout branch PR dokumentasi atau download `reference.html` dari GitHub dengan
   tombol Download raw file. GitHub menampilkan source HTML, bukan preview website.
2. Di folder lokal `docs/design`, klik dua kali `reference.html`; buka dengan browser.
   Tidak perlu npm install, server, API key atau extension.
3. Pilih Screen, Theme, Viewport dan State di toolbar atas. Kanvas mempertahankan
   ukuran CSS yang dipilih; jika monitor lebih sempit, geser area preview horizontal.
4. Untuk mengecek mobile, pilih 390×844. Periksa juga 320×700 dan scroll frame.
5. Klik Chat/Blog, topic, project card, artikel atau settings untuk menjelajah contoh.
   “Ask about this article” mengisi input tanpa mengirim request.
6. Pilih State Loading/Error/Empty pada Conversation atau Blog. Welcome/Article/
   Project memakai blueprint konten tetap; selector state tidak mengubah semua layar.

Semua fixture artikel/project adalah contoh tata letak. Status, byline, judul dan
narasi demo tidak boleh di-seed sebagai fakta portfolio. Résumé/contact menampilkan
pemberitahuan demo, bukan tautan palsu. Versi produksi mengikuti DATA_MODEL dan
CONTENT_INVENTORY yang disetujui.

## Ruang lingkup prototype

Prototype menunjukkan tokens, ukuran, wrapping, hierarki, dark/light, controls dan
beberapa state. Tidak terhubung Sanity/AI, tidak menyimpan sesi, tidak menangani
keyboard mobile nyata, dan bukan implementasi aksesibilitas aplikasi final.
Blog filter hanya mengubah fixture yang terlihat; semua article clicks membuka
artikel contoh yang sama. Semua project clicks membuka halaman contoh FINESHYT.

Untuk screenshot tanpa toolbar, buka file dengan query, misalnya
`reference.html?raw=1&screen=welcome&theme=dark`, lalu atur viewport di browser DevTools.
Pilihan screen: welcome/thread/blog/article/project; theme: dark/light.

## Status verifikasi paket dokumentasi

Static checks dilakukan terhadap tautan dokumen, kelengkapan task/checkpoint dan
syntax JavaScript/generasi markup. **Browser render/pixel review belum diverifikasi**
di lingkungan penyusunan: executable browser tidak tersedia dan unduhannya timeout.
Tidak ada klaim 20 screenshot lulus. Owner visual review di T08 dan screenshot matrix
di T21 tetap diperlukan sebelum menjadikan tampilan sebagai golden baseline.

Sampaikan revisi dengan Screen + Theme + Viewport + bagian yang berubah. Contoh:
“Welcome/Dark/390: headline saya ingin dua baris; intro maksimal empat baris;
jarak prompt ke intro 24px.” Kita update DESIGN_SPEC dan reference bersamaan.

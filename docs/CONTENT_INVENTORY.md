# Content inventory dan copy awal

Status: seluruh copy di sini draft editorial untuk review Awwal, bukan publikasi.
Dokumen menyediakan konteks lengkap; AI IDE tidak boleh mengarang isian yang hilang.
`PENDING_OWNER` berarti owner memberi fakta, bukan AI membuat requirement baru.

## Ledger fakta dan keputusan publikasi

| ID | Item | Yang diketahui | Yang belum disetujui | Aturan |
|---|---|---|---|---|
| C01 | Identitas | Assabigunal Awwalun; Awwal | final headline dan portrait | nama boleh fixture; publish setelah T03 |
| C02 | Positioning | accounting/risk + ketertarikan AI tools dalam brief | title pekerjaan saat ini/availability | jangan menyebut employer aktif otomatis |
| C03 | Pengalaman | brief memuat accounting, risk, ICoFR, ESG | organisasi, dates, employmentType, detail kontribusi | pending; jangan infer current role |
| C04 | FINESHYT | personal-finance conversational project | build status, role, public evidence/URL | tidak boleh sebut launched/users/revenue |
| C05 | Lil Cash | ide AI assistant kas kecil | scope final, status, screenshots | label concept sesudah persetujuan |
| C06 | Pendidikan | PENDING_OWNER untuk public record | institusi, year, degree, GPA jika ingin | optional di bio, tidak wajib launch |
| C07 | Résumé | PENDING_OWNER | PDF bersih metadata, date, language | tombol unavailable sampai ada |
| C08 | Contact | PENDING_OWNER | email, LinkedIn, social URLs | tidak membuat URL dengan menebak username |
| C09 | Artikel | belum ada artikel publik tervalidasi pada audit | title/body/category/date | blog empty state valid untuk development |
| C10 | Services | draft: workflow structuring, financial tools | batas layanan dan permission employer | jangan menjanjikan jasa regulated |

## Copy welcome yang diusulkan

Name: **Awwal.**

Headline: **Making complex work easier to understand.**

Intro: **I'm Assabigunal Awwalun. I work across accounting, risk, and practical AI tools. Ask about my work, experience, or what I'm building.**

Ini editorial draft berdasarkan arah portfolio. T03 meminta owner mengoreksi fakta
dan gaya bahasa sebelum publishing. Availability badge tidak ditampilkan sampai
owner memilih; jangan otomatis “Available for work”. Portrait fallback inisial AA.

Quick prompts persis: “Tell me about yourself”; “Show me your work”; “Read your notes”.
Composer label: “Ask about Awwal”; placeholder: “Ask about my work or experience…”;
quick actions: “Résumé”, “Let's talk”; settings label: “Appearance and chat settings”.
Assistant attribution: “Awwal’s portfolio assistant” pada awal thread, agar tidak
menyiratkan owner sedang live membalas.

## Content sheet yang kamu isi pada T03

Satu experience: organisasi; role; employmentType; tanggal mulai/selesai; current?
ringkasan 1 kalimat; 2–4 kontribusi yang boleh dipublikasi; evidence public jika ada.
Satu project: title; status; role; problem; approach; outcome yang terbukti; URLs;
gambar milik sendiri beserta alt; waktu pengerjaan jika ingin.
Satu article: title; excerpt; body; category; publication time; references yang benar.

Minimal untuk launch: approved profile, satu project nyata atau concept berlabel,
satu pengalaman jika owner memilih menampilkan, contact yang bekerja. Blog boleh
empty dengan honest state; jangan publish dummy article hanya untuk memenuhi grid.
Jika résumé belum ada, route menjelaskan unavailable; jangan dead download button.

## Copy error/empty yang sudah ditetapkan

| Kondisi | English copy | Action |
|---|---|---|
| No articles | No notes published yet. | Back to chat |
| No public project | I’m still preparing the project details for this space. | Ask about experience |
| Resume missing | My résumé isn't available here yet. | Let's talk jika contact tersedia |
| Contact missing | Contact details will be added soon. | Show work |
| Retrieval empty | I don't have verified information about that yet. | 3 relevant suggestions |
| Out of scope | I can help you explore Awwal’s work, experience, and writing. | About / Work / Blog |
| AI unavailable | I couldn't answer that right now. You can still explore the topics below. | Curated suggestions + Retry |
| Too long | Please keep your question under 1,000 characters. | Preserve typed input |
| Rate limited | You've reached the question limit. Please try again shortly. | Retry countdown + curated |
| Offline | You're offline. Previously loaded topics are still available. | Retry connection |
| Invalid context | This article is no longer available. | Clear context; stay in Chat |

Error boleh mirrored Bahasa Indonesia jika visitor memakai Indonesia. Navigation,
button label, dan heading tetap English. Jangan pakai istilah token, model ID,
schema validation, atau GROQ di error UI.

## Asset dan fixture policy

Design prototype berisi project FINESHYT dan Lil Cash sebagai contoh layout serta
contoh judul tulisan. Label besar “Design reference · sample copy” menunjukkan
bukan konten CMS final. Jangan seed contoh artikel sebagai fakta publik.
Tidak ada stock photo, fake logo, testimonial, subscriber count, persen skill,
atau placeholder review quote. Jika tidak ada gambar, gunakan card berbasis teks.

Approval ledger T03: isi `approved by`, `date`, `Cxx approved/needs edit`, final copy.
Tidak perlu menaruh CV mentah atau personal evidence di public docs; cukup catat
“owner verified, record ID …”. Semua kontak yang masuk repo memang harus intended public.

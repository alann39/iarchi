# IARCHI · visual and interaction specification

Versi 2 · candidate direction for owner visual review. Ini brief implementasi konkret,
bukan deskripsi “buat modern dan Apple-like”. Buka [reference.html](design/reference.html)
di browser lokal. Nilai CSS di sini adalah token IARCHI; bukan angka resmi milik Apple.

## 1. Arah desain dan alasan

Bayangkan halaman catatan yang rapi di ponsel: isi mudah dibaca, tombol terlihat saat
dibutuhkan, tidak semua paragraf dimasukkan ke kartu. Kita pertahankan suasana tenang
itu, lalu beri material kaca pada navigasi dan composer agar terasa melayang.

Prinsip yang diadaptasi dari [Apple, Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/):
kontrol membentuk lapisan berbeda dari konten; hindari glass-on-glass; warna dan motion
memberi petunjuk aksi. Adaptasi web ini memakai CSS blur, fill, highlight, dan shadow;
bukan replikasi refraksi native iOS. Respons aksesibilitas web harus dibuat sendiri.

Hasil membaca referensi Superdesign dibandingkan sumber primer Apple: gunakan semantic
roles, bukan menganggap suatu hex sebagai warna Apple resmi. Grid 4/8 di bawah adalah
keputusan proyek. System font memanfaatkan font OS; jangan mengunduh SF Pro atau
SF Symbols lalu mendistribusikannya sebagai web asset. Gunakan satu icon family
Lucide (jika dependency disetujui T08) atau SVG orisinal setara, 20px stroke 1.75.

## 2. Visual yang dilarang dan penggantinya

| Jangan | Gunakan |
|---|---|
| Purple/cyan full-screen aurora, gradient headline | canvas neutral, satu blue accent |
| Semua content dibungkus rounded glass cards | text editorial, divider tipis, project card solid |
| “Unlock / elevate / revolutionize”, fake stats | copy spesifik di CONTENT_INVENTORY |
| Giant 80px hero, sparkle icon berulang | 48px desktop/36px mobile name, hierarchy tenang |
| Bento dashboard, metrics panel, ChatGPT sidebar | satu thread, dua primary destinations |
| Animated blobs/noise/tilt/parallax default | static ambient edge, motion hanya response feedback |
| Random icons tiap paragraf, neon borders | icon hanya aksi; border kontras lembut |
| Emoji jadi icon system; stock headshot | consistent line icons; AA fallback untuk portrait |

## 3. Token warna/material

Theme default mengikuti OS; screenshot baseline dark. User dapat memilih System,
Light, Dark. Nilai disimpan sebelum first paint melalui safe theme initializer;
hindari hydration mismatch. Settings menyertakan “Reduce transparency”.

| Token | Dark | Light | Role |
|---|---|---|---|
| canvas | #111214 | #F5F5F7 | background utama |
| surface | #1C1D21 | #FFFFFF | project/article panels |
| surface-hover | #24262B | #EEEEF2 | hover content/action fill |
| text-primary | #F5F5F7 | #1D1D1F | headings/body |
| text-secondary | #B2B4BD | #60616A | supporting copy |
| text-tertiary | #9B9EA8 | #696B75 | metadata (check contrast at size) |
| accent-link | #85B8FF | #0057B8 | hyperlinks/focus |
| accent-action | #0A66D6 | #0057B8 | send primary with white icon |
| border | rgba(255,255,255,.14) | rgba(0,0,0,.12) | separator/hairline |
| glass-fill | rgba(38,40,45,.86) | rgba(255,255,255,.86) | nav/composer base |
| glass-highlight | rgba(255,255,255,.20) | rgba(255,255,255,.95) | top inner edge |

Glass recipe: fill above + backdrop-filter blur(20px) saturate(125%); border 1px;
inset top 0 1px highlight; outer shadow dark `0 8px 32px rgba(0,0,0,.20)`, light
`0 8px 32px rgba(0,0,0,.08)`. No nested blur in selected segment/button.
Content cards use opaque surface, 1px border, no blur, no default shadow.
Reduce transparency OR unsupported backdrop-filter ⇒ solid surface, preserve border.
Forced-colors ⇒ system Canvas/CanvasText/ButtonText/Highlight; no decorative shadow.
Ambient optional radial blue #416189 at max .08 opacity, top-right only; static,
invisible behind body text. No default purple. Test contrast on composited backdrop,
not only hex against empty canvas. Text AA 4.5:1; large 3:1; controls/focus 3:1.

## 4. Type, spacing, geometry

Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (use native platform
metrics). Body rem; root follows browser preference (do not lock zoom). Same platform
and font required for screenshot pixel comparison; cross-platform glyph shape differs.

| Role | Desktop size/line/weight | Mobile size/line/weight |
|---|---|---|
| Name hero | 48/52/650, tracking -.035em | 36/40/650 |
| Page title | 34/40/650 | 30/36/650 |
| Section heading | 24/30/600 | 22/28/600 |
| Card title | 20/26/600 | 20/26/600 |
| Body/chat | 17/27/400 | 17/27/400 |
| Article body | 18/30/400 | 17/29/400 |
| Control label | 15/20/500 | 15/20/500 |
| Metadata | 13/18/400 | 13/18/400 |

Spacing scale: 4,8,12,16,20,24,32,40,48,64,80. Border radius: 8 inline badge,
12 small control, 20 card, 28 composer, 999 nav pill. Icon control target minimum
44×44 CSS px. Button hit area can exceed icon size. Never 32px send target.

Breakpoints: mobile <640, tablet 640–1023, desktop ≥1024. Conversation width
`min(720px,100% - 2*gutter)`; page/work index max 960; article max 680.
Gutter mobile 20 (≤359:16), tablet 32, desktop 32 minimum. Desktop header width 960.

## 5. Screen blueprints

Coordinates are layout targets at 100% zoom, not fixed absolute placements for every
device. Use responsive flow constraints; when text wraps, height grows. Canvas uses
`min-height:100dvh`, safe-area inset, never hardcoded browser address-bar height.

### A. Welcome, 1440×900

| Element | Rect/spacing | Detail |
|---|---|---|
| Header | x240 y24 w960 h52 | left Awwal wordmark; right Chat/Blog pill+44 settings |
| Main | x360 w720; top176 | no avatar photo required; intro column max600 |
| Optional availability | h20 then gap16 | absent if undisclosed; no fake green dot |
| Heading Awwal. | 48/52 | margin0; no gradient |
| Positioning | top after heading+12 | 24/32, max600 |
| Intro | gap16 | 17/27, max560, 2–3 lines |
| Prompt list | gap32 after intro; w520 | 3 rows, min52 each, 1px dividers; chevron right |
| Composer | x360 bottom24 w720 min112 | actions row44; input row52; padding8 |
| Thread clearance | bottom≥160 | last interactive element remains above dock |

Header wrapper is clear; only segmented nav and settings background share one glass
material group. Wordmark no blur. Scroll-edge gradient behind header/composer max48px,
pointer-events none; don't overlay body when page starts.

### B. Welcome, 390×844

Header x20 y12 w350 h48; wordmark 17px; segment w152 h44; settings44. Main x20 y132
w350. Name36/40. Headline22/30; intro17/27. Prompt rows min52 w350, gap24 after intro.
Composer x12 w366 bottom `12px + safe-area`, min112. At 320px header wordmark may
shorten to AA (accessible name stays Awwal); segment width140. No social icons in header.
At short heights≤700 or large text, main scrolls; hero is not vertically centered.

### C. Conversation

Hero replaced by small assistant attribution at top of thread, not repeated every turn.
Thread starts y128 desktop/y92 mobile. User bubble aligned right, max80% width,
surface-hover fill, radius20 with bottom-right8, padding12×16. Assistant answers are
plain editorial content full column width, margin24 after question. Paragraph gap12;
cards gap12; next suggestions appear after response with gap20. Turn-to-turn gap40.
No avatar repeated each paragraph. Sources row text13 under factual response, wrapping
links with min44 touch area; sources use server titles, never raw token IDs.
Pending one status row: “Looking through the portfolio…”; after retrieval “Preparing
an answer…”. No percentage, token counter, rainbow loader, or forced typing delay.
Error is inline text + Retry44 + topic options; keep thread intact.

### D. Blog index

Header same as Chat, Blog active; composer absent. Main max960 top144 desktop,
top104 mobile. Title “Notes”, description beneath16. Categories horizontally wrap,
not scroll-only hidden controls; selected pill solid fill. First article featured row
title28, excerpt17, metadata13. Remaining posts editorial rows with 24px vertical
padding and dividers. Optional thumb96×72 desktop right; mobile omit if no image.
No masonry/bento. 12 posts/page; pagination real links with aria-current. Empty state
simple paragraph, “Back to chat” link; no fake article padding.

### E. Article

Content max680; back Blog link above category/date; title42/48 desktop,30/36 mobile;
excerpt20/30; gap24 metadata then cover optional16:9. Body18/30, paragraph margin20;
h2 margin40 before16 after; links underlined. Sticky section TOC not MVP. End “Ask
about this article”44 then related rows max3. No composer on article. Code block scrolls
within container; never body horizontal overflow. Focus route title on navigation.

### F. Project + résumé + contact

Project max720; Back to chat; title34; summary20; status/role metadata; optional cover;
sections Problem, My role, Approach, Outcome, Links. Omit Outcome when unavailable;
status concept must not appear as released. No fabricated metric tiles.
Résumé max680 with public preview summary, updated date, Download PDF; inline PDF
embed optional and disabled on small mobile if it harms usability. Contact rendered
inline card with email+social link rows44; no modal needed for basic contact.

### G. Overlay/settings/lightbox

Settings anchored to settings control, w280 desktop; mobile sheet x12 bottom12 w366,
max-height calc(100dvh-48px), internal scroll. Theme radios3, reduce transparency
switch, reset action; Escape closes, restores trigger focus. Popover one material
surface; rows plain fills. Gallery lightbox background opaque enough for contrast,
Close44 visible, image contain, alt/caption, no auto-advance. Use native dialog or
tested accessible primitive; focus inert background, no custom half-finished trap.

## 6. Component states and motion

| Component | Rest/hover/press/focus/disabled |
|---|---|
| Prompt row | transparent / surface-hover / opacity .85 / 2px accent outline offset3 / disabled only pending duplicate |
| Nav | selected solid thin inner fill / subtle fill / no bounce / focus outline / never disabled current tab |
| Send | action blue white arrow / brightness1.08 / scale .98 / 2px outline / neutral fill+disabled attribute |
| Composer | neutral border / no hover glow / focus-within accent ring / 1–5 line textarea / Send→Stop during request |
| Card | opaque + border / border stronger / no tilt / link focus / missing data never clickable |

Motion: color/fill120ms ease-out; new response opacity0→1 and translateY4→0 in180ms;
nav thumb180ms cubic-bezier(.2,.8,.2,1); sheet220ms same. Never animate height from0
for long content. Reduced motion: remove transforms; ≤80ms opacity or immediate.
No fake response delay. Screen reader announcements once per completed answer; do
not announce every stream data event. Busy label uses aria-live polite and aria-busy.

## 7. Keyboard and mobile composer

Enter sends if not composing; Shift+Enter newline; blank whitespace disabled.
Textarea font16 minimum (our body17), grows to5 lines then internal scroll.
Dock positioned relative to visible viewport and safe area. On keyboard open, actions
row may collapse but input/Stop remain reachable; keep last message above composer
using measured dock height+24 padding and scroll-margin. Test real iOS Safari and
Android Chrome; a narrow desktop viewport alone does not simulate keyboard behavior.
If fixed dock fails a browser, flow/sticky fallback required rather than hidden input.

## 8. Pixel review protocol

Capture fixed browser/version/OS, DPR1, 100% zoom, same approved fixture strings,
fonts loaded, reduced motion, animations disabled, no timestamps. Reference set:
1440×900 and390×844 each Welcome/Thread/Blog/Article/Project in dark/light (20 states).
Additional reflow tests320/768 and200%zoom have functional checks, not strict pixels.
Target major rect error≤2px, spacing≤2px, icon baseline≤1px against reference. Font
antialiasing variation is reviewed visually; never fix it by rasterizing text.
Screenshot-diff threshold≤0.5% changed pixels only on same environment after owner
approves baseline; no automatic golden replacement by AI. Human approval still needed
for hierarchy, copy wrapping, optical centering, and motion.

Prototype reference is an executable geometry sample. It does not implement CMS,
keyboard viewport handling, screen-reader production behavior, or true native lensing.
Missing media uses typography, not invented visual assets. T08 records owner verdict;
subsequent tasks follow that approved revision.

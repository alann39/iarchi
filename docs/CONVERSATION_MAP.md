# Conversation map v2

Curated answer seperti quick reply WhatsApp yang sudah kamu siapkan. Klik pertanyaan
membuka jawaban yang sama akuratnya; AI baru dipakai bila pertanyaan tidak cocok.
Semua response copy di bawah draft yang siap direview T03, bukan placeholder untuk AI.

## Stable topics dan blok

| topicId | Question | Response draft | Blok setelah teks | Next IDs |
|---|---|---|---|---|
| about | Tell me about yourself | I'm Awwal. This space brings together my work in accounting and risk, and my interest in practical AI tools. | skills jika approved | experience, work, contact |
| story | Tell me your story | I’m interested in making complex work easier to understand and repeat. You can explore the experience and projects behind that interest here. | timeline dari experiences | experience, work, writing |
| experience | Show me your experience | Here’s the experience I’ve shared publicly. Select a project to see the work in more detail. | experiences ordered | risk, work, resume |
| risk | What do you do in Risk Management? | I’m preparing the public details of this work. The experience below includes only information I’ve approved for this portfolio. | relevant experience refs | experience, skills, contact |
| work | Show me your work | Here are the projects I’ve chosen to share. Each page explains the problem, my role, and the current status. | projects from featuredProjects | fineshyt, lil-cash, contact |
| fineshyt | Tell me about FINESHYT | FINESHYT is a conversational personal-finance project. Its case study describes the scope and progress I’ve made public. | project fineshyt if approved | work, skills, contact |
| lil-cash | Tell me about Lil Cash | Lil Cash explores an AI-assisted approach to managing petty cash. I’ll share only the scope and progress confirmed on its project page. | project lil-cash if approved | fineshyt, work, contact |
| skills | What tools do you use? | These are the skills and tools connected to the work shown here. | skillGroups | work, experience, contact |
| services | What can you help me with? | Let’s start with the problem you’re trying to solve. The areas below describe the work I’m open to discussing. | approved services | work, contact, resume |
| resume | Show me your résumé | You can view or download the current public version here. | active resume or missing copy | experience, work, contact |
| contact | How can I contact you? | Use one of these channels to get in touch with me directly. | configured contact or missing copy | work, resume, writing |
| writing | Read your notes | Here are my latest published notes. | latest public posts max 3 or empty | work, about, contact |

If corresponding data missing, use CONTENT_INVENTORY empty copy INSTEAD of misleading
intro (e.g. don't say “download here” without a file). Availability/skill/employer facts
are not inferred. Topic copy should be edited by owner to verified specifics when ready.

## Intent matching contract

Priority: explicit suggestion `topicId` (enum validated) → normalized exact alias →
article action → free-form AI. Trim/case-fold, collapse spaces, normalize trailing
punctuation. No fuzzy substring “risk” match: “What are the risks of AI?” is not
automatically a portfolio experience request. No AI classifier for exact topics.

| Input aliases (EN / ID) | Result |
|---|---|
| who is awwal / siapa awwal / about | about |
| your story / cerita kamu | story |
| experience / pengalaman kerja | experience |
| risk management work / pengalaman manajemen risiko | risk |
| projects / portfolio / show work / lihat proyek | work |
| fineshyt / tell me about fineshyt | fineshyt |
| lil cash / lil-cash | lil-cash |
| skills / keahlian | skills |
| services / jasa | services |
| cv / resume / résumé / lihat cv | resume |
| contact / kontak / let's talk | contact |
| latest notes / tulisan terbaru | writing |
| open blog / buka blog | route /blog (no model) |
| reset / start over / ulangi | confirmation dialog, then reset |

`/?article=slug` loads public article title/context chip; does NOT auto-call provider.
Prefill “What are the main ideas in this article?” optional; visitor clicks Send.
Context persists until removed or replaced. Server re-resolves slug each request.

## Response envelope v1

```ts
type ResponseEnvelope = {
  schemaVersion: 1;
  turnId: string;
  origin: 'curated' | 'ai' | 'fallback';
  blocks: ResponseBlock[];  // min 1, max 8
  sources: { id: string; title: string; href: string }[]; // server-owned
  nextTopicIds: TopicId[]; // max 3, allowed enum
};
type ResponseBlock =
  | { type: 'text'; text: string }
  | { type: 'projects'; ids: string[] }
  | { type: 'experience'; ids: string[] }
  | { type: 'skills'; ids: string[] }
  | { type: 'services'; ids: string[] }
  | { type: 'articles'; ids: string[] }
  | { type: 'resume'; id: string | null }
  | { type: 'contact' }
  | { type: 'gallery'; assetIds: string[] };
```

Validate runtime dengan Zod discriminated union; unknown type rejected; no raw HTML.
Hydrator mengambil IDs dari server/approved curated projection dan menyaring lagi.
AI boleh mengusulkan hanya text + source IDs + project/post/experience IDs yang
diretrieve. Gallery/contact/resume/actions dari deterministic path, bukan model.

## Event-state table

| State/event | Expected next | User feedback |
|---|---|---|
| Welcome + topic | Completed turn | append question/answer segera; hide large hero |
| Idle + free text | Submitted | user turn appended once; Send→Stop |
| Submitted | Retrieving→Generating | satu status row, no fabricated progress percent |
| Valid response | Completed | append verified blocks; announce answer once |
| Stop | Cancelled | “Response stopped”; input available; no duplicate retry |
| Timeout/error | Recoverable | retain question, Retry button + curated alternatives |
| User scrolls upward | Remain | don't yank viewport; “New response” control |
| Reset confirm | Welcome | clear tab state and pending abort controller |

All new events keyed by requestId; late response after cancel/reset ignored. Client
in-flight lock prevents double click; network retry uses new attempt ID linked to same
turn so it replaces failed answer rather than duplicates the question.

# IARCHI — repository instructions

## Working agreement

The owner develops this portfolio interactively in an IDE. Work on ONE task ID from
`docs/PROMPT_PLAYBOOK.md` at a time. Explain in Bahasa Indonesia; code identifiers
and visitor-facing UI use English. Free-form answers may mirror Indonesian.

At the first response of a fresh session, list the instruction files actually read,
the current branch, git status summary, active task ID, and its acceptance tests.
Never claim an instruction was loaded without reading it. Do not print secrets.

Default task lifecycle: inspect → explain a small plan and affected files → wait for
the owner to say implement → implement that task → run meaningful checks → show
the diff summary and manual checks → stop. An explicit implementation instruction
authorizes that task without another plan approval. Never progress to another task,
commit, push, merge, provision a paid service, or deploy without the owner's request.
Read-only inspection and agreed local verification need no extra permission.

## Read order and authority

Read this file, `docs/DEVELOPMENT_GUIDE.md`, `docs/PROGRESS.md`, and
`docs/REQUIREMENTS.md`. Then read the task's named specifications completely.
User directions take precedence. Requirements define behavior; DATA_MODEL defines
CMS names; DESIGN_SPEC defines visual values; AI_SPEC defines AI contracts.
DECISIONS records why; PROGRESS records evidence, not product scope.
If two specs conflict, point to the exact conflict before implementing it.

These specifications are already written. Do not draft replacements, change the
product direction, invent biography, or ask another agent to reconstruct context.
Unknown personal facts remain pending in CONTENT_INVENTORY and are not published.
Record approved scope changes in CHANGELOG and DECISIONS, updating affected specs
and task IDs together. Never mark a checkpoint passed without the stated evidence.

## Architecture and security

- Preserve npm workspaces `frontend` and `studio` and the root package-lock.json.
- Keep schema `_type: post` and `_type: settings`; do not rename them to blogPost
  or siteSettings. `siteSettings` is the singleton ID, not its type.
- Preserve unrelated user edits and existing Sanity preview/live integration.
- Generated Sanity files are regenerated, never handwritten. Schema changes must
  regenerate Studio types then frontend types sequentially (shared schema file).
- Only published/public/verified allowlisted records can enter public responses;
  AI additionally requires aiEligible. Public dataset filters are NOT access control.
- LLMs never write CMS content, execute tools, select CSS, HTML, routes, or URLs.
- Use server-only AI provider modules. The existing Sanity browserToken behavior
  is an authenticated Draft Mode exception; do not expose it in ordinary sessions.
- No secret values in chat, git, logs, fixtures, screenshots, or public variables.
- Use parameterized GROQ; no model-generated queries. No new SQL/vector database.
- Revalidate browser input, stored state, reference IDs, and model results at boundaries.

## Design implementation contract

Use `docs/DESIGN_SPEC.md` and `docs/design/reference.html`. The reference is a
reviewable UI prototype, not an application dependency or permission to publish demo
content. Follow the geometry, tokens, breakpoints, state table, and screenshot gates.
No invented gradients, bento sections, chatbot sidebar, extra destinations, fonts,
decorative cards, fake statistics, or copied third-party UI kits. Changes to the visual
direction need an explicit owner decision. Accessible reflow beats clipping to a pixel.

## Verification and reporting

Inspect package scripts before running them. Install only the task's agreed packages.
Use npm ci for reproducibility; do not delete the lockfile to bypass an error. Do not
run blanket format, audit fix --force, reset --hard, or sample-data import --replace.
Explain dependency compatibility failures instead of hiding them.

At task completion report: changed behavior; changed files; commands and actual
results; tests not run and why; browser checks still needed; remaining blockers;
updated progress entry. Distinguish source review, automated checks, visual review,
and live deployment evidence. Do not fabricate any of them.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

If the installed package lacks the referenced documentation directory, report that
fact and use official documentation matching the installed version. Do not migrate
Next.js to obtain docs. Read the repository Sanity skill before changing its caching
or live-content behavior; documentation-only changes do not require that skill.

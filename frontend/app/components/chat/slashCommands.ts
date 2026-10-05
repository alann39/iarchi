// Slash command registry — P3 (specs/04-TASKS.md TASK-16).
//
// Two classes:
// - prompt: injects a message into the chat; the AI streams the answer. Uses
//   the existing external-send path, including the hidden-prompt pattern from
//   specs/07-UX-FLOWS.md Flow 5 (API gets the full instruction, the bubble
//   shows a friendly label).
// - action: deterministic client-side effect. Never touches the LLM.

export type SlashClass = 'prompt' | 'action';

export interface SlashCommand {
  /** Name without the leading slash. Lowercase, single word, no spaces. */
  name: string;
  class: SlashClass;
  /** ≤40 chars — shown in the autocomplete menu. */
  description: string;
  /** prompt class only: text sent to the API. */
  apiText: string;
  /** prompt class only: text shown in the user bubble. */
  displayText: string;
}

// Hidden prompt per specs/07-UX-FLOWS.md Flow 5. The visitor taps the button
// (or types /story); the API receives the full instruction while the bubble
// shows a friendly label.
export const FULL_STORY_API_PROMPT = 'Tell me your full story as a narrative bio (max 400 words).';
export const FULL_STORY_LABEL = 'Tell me your full story';

const ACTION: Pick<SlashCommand, 'class' | 'apiText' | 'displayText'> = {
  class: 'action',
  apiText: '',
  displayText: '',
};

export const SLASH_COMMANDS: SlashCommand[] = [
  {name: 'projects', class: 'prompt', description: 'Selected work, annotated', apiText: 'Show me your work, annotated', displayText: 'Show me your work, annotated'},
  {name: 'experience', class: 'prompt', description: "Where he's worked", apiText: 'Where have you worked?', displayText: 'Where have you worked?'},
  {name: 'music', class: 'prompt', description: "What's on repeat", apiText: 'What music are you into?', displayText: 'What music are you into?'},
  {name: 'movies', class: 'prompt', description: "Films he'd rewatch", apiText: 'What are your favorite movies?', displayText: 'What are your favorite movies?'},
  {name: 'blog', class: 'prompt', description: 'Latest writing', apiText: 'What have you written lately?', displayText: 'What have you written lately?'},
  {name: 'story', class: 'prompt', description: 'The full story', apiText: FULL_STORY_API_PROMPT, displayText: FULL_STORY_LABEL},
  {name: 'cv', ...ACTION, description: 'Download the CV'},
  {name: 'contact', ...ACTION, description: 'Open the mailto sheet'},
  {name: 'clear', ...ACTION, description: 'Clear the chat'},
  {name: 'help', ...ACTION, description: 'List all commands'},
];

/**
 * Match a raw input against the registry. Unknown `/foo` (or anything with
 * a space, i.e. attempted args) returns null so the input falls through to
 * the normal LLM path — never an error state.
 */
export function matchSlashCommand(text: string): SlashCommand | null {
  const t = text.trim();
  if (!t.startsWith('/') || t.length < 2 || /\s/.test(t)) return null;
  const name = t.slice(1).toLowerCase();
  return SLASH_COMMANDS.find((c) => c.name === name) ?? null;
}

/** Prefix-filter for the autocomplete menu (query = text after `/`). */
export function filterSlashCommands(query: string): SlashCommand[] {
  const q = query.toLowerCase();
  return SLASH_COMMANDS.filter((c) => c.name.startsWith(q));
}

/** /help payload — authored in-chat message listing every command. */
export function buildHelpText(): string {
  const lines = SLASH_COMMANDS.map((c) => `- \`/${c.name}\` — ${c.description}`);
  return `Available commands:\n${lines.join('\n')} ■`;
}

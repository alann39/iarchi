// Shared chat message types — specs/06-UI-SPEC.md §7.

import type {
  ContactData,
  ExperienceCardData,
  PickData,
  ProfileData,
  ProjectCardData,
  SkillGroupData,
} from '@/lib/portfolio';

export type ChatRole = 'user' | 'assistant';

export type MessageStatus = 'streaming' | 'complete' | 'error';

/** Executed tool result payload — shapes from specs/03-CONTRACTS.md §3. */
export interface ToolResult {
  projects?: ProjectCardData[];
  experience?: ExperienceCardData[];
  groups?: SkillGroupData[];
  contacts?: ContactData[];
  profile?: ProfileData;
  picks?: PickData[];
}

/** A tool call executed server-side, delivered via SSE — specs/03-CONTRACTS.md §1. */
export interface ToolEvent {
  name: string;
  result: ToolResult;
  /** Story mode only (TASK-17): client renders the compact fan-stack variant. */
  presentation?: 'compact';
}

/**
 * Ordered content block of a story-mode answer (TASK-17). The server streams
 * text and tool events in document order; the client appends them here so
 * narrative and fan stacks interleave without fragile text markers.
 */
export type StoryBlock = {kind: 'text'; text: string} | {kind: 'tool'; tool: ToolEvent};

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status: MessageStatus;
  /** Machine-readable error code for error messages (e.g. RATE_LIMITED, LLM_ERROR). */
  errorCode?: string;
  /** Rich card data from tool calls, rendered by ToolRenderer (TASK-07). */
  tools?: ToolEvent[];
  /** Story mode (TASK-17): answer interleaves narrative text + fan stacks. */
  story?: boolean;
  /** Ordered blocks; maintained only when `story` is true. */
  blocks?: StoryBlock[];
}

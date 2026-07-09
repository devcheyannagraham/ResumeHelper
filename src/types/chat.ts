/**
 * Defines core chat data contracts shared by UI and services.
 * This file exists to keep message-related types in one place,
 * so service swaps (mock now, AWS-backed later) do not affect UI shape.
 */

/**
 * Identifies who authored a chat message.
 * This enables consistent styling and accessibility semantics in the UI.
 */
export type MessageRole = "user" | "bot";

/**
 * Represents one chat message shown in the transcript.
 * The UI uses this structure so rendering stays decoupled from data source details.
 */
export interface ChatMessage {
  role: MessageRole;
  text: string;
  time: string;
}

/**
 * Defines chat reply services and a temporary local implementation.
 * This file exists so UI logic can depend on an interface now,
 * then switch to an AWS-backed implementation later with minimal changes.
 */

/**
 * Describes the contract for generating assistant replies.
 * UI depends on this abstraction to avoid hardcoding transport or provider details.
 */
export interface ChatReplyService {
  /**
   * Creates a response for a user message.
   * This async contract matches real backend behavior and prevents future UI rewrites.
   * @param userText User message text after local validation and trimming.
   * @returns Generated assistant text for display.
   */
  generateReply(userText: string): Promise<string>;
}

/**
 * Provides a local development implementation that echoes user input.
 * This keeps the current UI functional while backend authentication and APIs are pending.
 */
export class MockChatReplyService implements ChatReplyService {
  /**
   * Generates a deterministic local response for quick UI iteration.
   * The method remains async so callers can later switch to network I/O seamlessly.
   * @param userText User message text after local validation and trimming.
   * @returns Echo-style reply text.
   */
  async generateReply(userText: string): Promise<string> {
    return `You said: ${userText}`;
  }
}

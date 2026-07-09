/**
 * Renders and manages the chat user interface behavior.
 * This file exists to isolate DOM concerns from service and bootstrap concerns,
 * keeping the UI stable when auth/provider integrations evolve.
 */

import type { ChatMessage } from "../types/chat.js";
import type { ChatReplyService } from "../services/chat-reply-service.js";

/**
 * Defines dependencies required by the chat UI module.
 * This contract keeps module boundaries explicit and easy to replace in future integrations.
 */
export interface ChatUiDependencies {
  replyService: ChatReplyService;
}

/**
 * Initializes chat UI event handlers and seed messages.
 * This function centralizes startup work so app bootstrap can remain minimal and reusable.
 * @param dependencies Runtime services required by the UI layer.
 * @throws Error when required DOM elements are missing.
 */
export function initializeChatUi(dependencies: ChatUiDependencies): void {
  const { replyService } = dependencies;
  const { messagesContainer, chatForm, chatInput } = getRequiredElements();

  appendMessage({
    role: "bot",
    text: "Hello! I am ready to help.",
    time: formatTime(new Date())
  });
  appendMessage({
    role: "bot",
    text: "Type something and press Enter.",
    time: formatTime(new Date())
  });

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = chatInput.value.trim();
    if (!value) {
      return;
    }

    appendMessage({
      role: "user",
      text: value,
      time: formatTime(new Date())
    });

    chatInput.value = "";
    chatInput.focus();

    setFormDisabled(true);

    try {
      const replyText = await replyService.generateReply(value);
      appendMessage({
        role: "bot",
        text: replyText,
        time: formatTime(new Date())
      });
    } catch {
      appendMessage({
        role: "bot",
        text: "Sorry, something went wrong. Please try again.",
        time: formatTime(new Date())
      });
    } finally {
      setFormDisabled(false);
      chatInput.focus();
    }
  });

  /**
   * Renders one message bubble and keeps the latest message in view.
   * This ensures consistent message presentation and scrolling behavior.
   * @param message Message data to render in the transcript.
   */
  function appendMessage(message: ChatMessage): void {
    const bubble = document.createElement("article");
    bubble.className = `message ${message.role}`;

    const textNode = document.createElement("div");
    textNode.textContent = message.text;

    const timeNode = document.createElement("div");
    timeNode.className = "message-time";
    timeNode.textContent = message.time;

    bubble.append(textNode, timeNode);
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Enables or disables form controls during async request processing.
   * This prevents duplicate submissions and race-prone UI behavior.
   * @param disabled Whether controls should be disabled.
   */
  function setFormDisabled(disabled: boolean): void {
    chatInput.disabled = disabled;

    const submitButton = chatForm.querySelector("button[type='submit']") as HTMLButtonElement | null;
    if (submitButton) {
      submitButton.disabled = disabled;
    }
  }
}

/**
 * Resolves and validates required DOM elements for the chat UI.
 * The explicit checks fail fast, making integration errors obvious during setup.
 * @returns Strongly typed DOM references used by the UI module.
 * @throws Error when one or more required elements are not found.
 */
function getRequiredElements(): {
  messagesContainer: HTMLElement;
  chatForm: HTMLFormElement;
  chatInput: HTMLInputElement;
} {
  const foundMessages = document.getElementById("messages");
  const foundForm = document.getElementById("chat-form") as HTMLFormElement | null;
  const foundInput = document.getElementById("chat-input") as HTMLInputElement | null;

  if (!foundMessages || !foundForm || !foundInput) {
    throw new Error("Required chat elements were not found in the page.");
  }

  return {
    messagesContainer: foundMessages,
    chatForm: foundForm,
    chatInput: foundInput
  };
}

/**
 * Formats a timestamp for compact display in message metadata.
 * Centralizing this formatting keeps message rendering consistent.
 * @param date Date to format.
 * @returns Human-readable local time string.
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

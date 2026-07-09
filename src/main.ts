/**
 * Bootstraps the browser chat client with runtime dependencies.
 * This file exists to keep startup wiring separate from UI and service logic,
 * so backend integration changes do not require UI rewrites.
 */
import { initializeChatUi } from "./app/chat-ui.js";
import { MockChatReplyService } from "./services/chat-reply-service.js";

startApplication();

/**
 * Starts the application by wiring dependencies and running UI initialization.
 * This keeps startup logic centralized and allows easy replacement of mock services later.
 */
function startApplication(): void {
  const replyService = new MockChatReplyService();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeChatUi({ replyService });
    }, { once: true });
    return;
  }

  initializeChatUi({ replyService });
}

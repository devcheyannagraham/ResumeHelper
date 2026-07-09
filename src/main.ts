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
 * The DOM-ready guard below is intentionally defensive so startup still works when this
 * module is loaded after DOMContentLoaded (for example through dynamic imports or HMR).
 *
 * You can remove the guard only when startup timing is guaranteed:
 * - This module is loaded exactly once from a static module script in index.html.
 * - The module is never dynamically imported or injected at runtime.
 * - Tooling does not re-run bootstrap logic after the initial page load.
 */
function startApplication(): void {
  const replyService = new MockChatReplyService();

  // Guard for late-loading execution paths where DOMContentLoaded may have already fired.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeChatUi({ replyService });
    }, { once: true });
    return;
  }

  // Fast path for normal module execution after the DOM is already ready.
  initializeChatUi({ replyService });
}

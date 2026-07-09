/**
 * Initializes the browser chat client.
 * This file exists to attach startup behavior and keep all chat runtime logic
 * scoped locally instead of leaking state into the global window scope.
 */
(() => {
  window.addEventListener("load", onWindowLoad);

  /**
   * Starts the chat application after the window has fully loaded.
   * This waits for load so required DOM nodes and styles are guaranteed to exist.
   */
  function onWindowLoad(): void {
    startChatInterface();
  }

  /**
   * Sets up chat state, validates required elements, and wires event handlers.
   * This central setup function keeps app initialization in one place for easier maintenance.
   */
  function startChatInterface(): void {
    type MessageRole = "user" | "bot";

    interface ChatMessage {
      role: MessageRole;
      text: string;
      time: string;
    }

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
      await wait(500);

      appendMessage({
        role: "bot",
        text: createBotReply(value),
        time: formatTime(new Date())
      });

      setFormDisabled(false);
    });

    /**
     * Creates and appends one visual chat bubble to the message container.
     * This function exists so message rendering stays consistent for both user and bot entries.
     * @param message The message payload to render in the UI.
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
     * Generates a simple bot response from user input.
     * This keeps the starter experience interactive without adding backend complexity.
     * @param userText The sanitized text submitted by the user.
     * @returns A short echo-style response.
     */
    function createBotReply(userText: string): string {
      return `You said: ${userText}`;
    }

    /**
     * Formats a date into a compact local time string for message metadata.
     * This provides readable timestamps so users can track conversation order.
     * @param date The date object to format.
     * @returns The formatted local time string.
     */
    function formatTime(date: Date): string {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }

    /**
     * Delays execution for a requested number of milliseconds.
     * This simulates async response timing to make the chat flow feel natural.
     * @param ms Delay duration in milliseconds.
     * @returns A promise that resolves after the delay finishes.
     */
    function wait(ms: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    /**
     * Enables or disables the input controls while a response is being prepared.
     * This avoids duplicate submissions and keeps UI state predictable during async work.
     * @param disabled Whether controls should be disabled.
     */
    function setFormDisabled(disabled: boolean): void {
      chatInput.disabled = disabled;

      const submitButton = chatForm.querySelector("button[type='submit']") as HTMLButtonElement | null;
      if (submitButton) {
        submitButton.disabled = disabled;
      }
    }

    /**
     * Resolves and validates all DOM nodes required by the chat experience.
     * This fails fast so configuration mistakes are discovered immediately.
     * @returns Strongly typed chat element references used by the app.
     * @throws Error when one or more required elements are missing.
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
  }
})();

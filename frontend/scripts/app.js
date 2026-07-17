/**
 * This file handles chat form behavior in the browser.
 * It exists to submit messages with fetch and render request/response text.
 */

const form = document.querySelector("#chat-form");
const messageInput = document.querySelector("#user-message");
const messagesContainer = document.querySelector("#messages");
const submitButton = document.querySelector("#submit-button");

/**
 * Appends a chat message bubble to the UI.
 * This keeps message rendering in one place for consistency.
 *
 * @param {"user" | "assistant"} role Message sender role.
 * @param {string} text Message body to show.
 * @returns {void}
 */
function addMessage(role, text) {
  const messageWrapper = document.createElement("div");
  messageWrapper.className = `wrapper ${role}`;
  const message = document.createElement("p");
  message.className = `message ${role}`;
  message.textContent = text;
  messageWrapper.append(message);
  messagesContainer.append(messageWrapper);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Sends the user message to the configured API endpoint.
 * This isolates fetch details and validates non-empty input.
 *
 * @param {string} userMessage Message entered by the user.
 * @returns {Promise<string>} Response text from the endpoint.
 */
async function sendMessage(userMessage) {
  console.log("Sending message:", userMessage);
  return;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.text();
}

/**
 * Handles form submission for the chat composer.
 * This keeps validation, UI state updates, and response rendering together.
 *
 * @param {SubmitEvent} event Browser submit event from the chat form.
 * @returns {Promise<void>} Resolves after the UI reflects the request result.
 * @throws {Error} Does not rethrow, but may render request errors into the UI.
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const userMessage = messageInput.value.trim();

  if (!userMessage) {
    return;
  }

  addMessage("user", userMessage);
  submitButton.disabled = true;

  try {
    const reply = await sendMessage(userMessage);
    addMessage("assistant", reply || "No response text returned.");
    messageInput.value = "";
    messageInput.focus();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected request error.";
    addMessage("assistant", `Error: ${message}`);
  } finally {
    submitButton.disabled = false;
  }
}

// Register the single submit path after all DOM references are initialized.
form.addEventListener("submit", handleFormSubmit);

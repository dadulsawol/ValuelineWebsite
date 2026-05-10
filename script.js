// script.js
// MOBILE MENU
try {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  // FAQ ACCORDION

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

      item.classList.toggle("active");

    });

  });

  // SCROLL ANIMATION

  const cards = document.querySelectorAll(
    ".service-card, .stat-card, .testimonial-card"
  );

  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0px)";

      }

    });

  },{
    threshold:0.2
  });

  cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "0.6s ease";

    observer.observe(card);

  });
  // simple form alert
  document.querySelectorAll(".form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Message sent successfully!");
    });
  });
}

catch (e) {
  console.warn("Some page elements not found:", e);
}

// =========================================================
// CHATBOT WIDGET
// =========================================================
 
// Replace this with your actual API Gateway invoke URL + /ask
const CHATBOT_API_URL = "https://5g1o6j93oi.execute-api.ap-southeast-1.amazonaws.com/ask";
 
// Inject the chatbot HTML into the page
const chatbotHTML = `
  <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chat">
    <i class="fa-solid fa-comments"></i>
  </button>
 
  <div id="chatbot-window" class="chatbot-window">
    <div class="chatbot-header">
      <div class="chatbot-header-info">
        <div class="chatbot-avatar">C</div>
        <div>
          <h4>CloudTech Support</h4>
          <span class="chatbot-status">● Online</span>
        </div>
      </div>
      <button id="chatbot-close" class="chatbot-close" aria-label="Close chat">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
 
    <div id="chatbot-messages" class="chatbot-messages">
      <div class="chatbot-message assistant">
        <div class="chatbot-bubble">
          Hi! 👋 I'm CloudTech's virtual assistant. How can I help you today?
        </div>
      </div>
    </div>
 
    <div class="chatbot-input">
      <input
        id="chatbot-input-field"
        type="text"
        placeholder="Type your question..."
        autocomplete="off"
      />
      <button id="chatbot-send" aria-label="Send">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
`;
 
document.body.insertAdjacentHTML("beforeend", chatbotHTML);
 
// Grab references
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input-field");
const chatbotSend = document.getElementById("chatbot-send");
 
// Toggle window open/close
chatbotToggle.addEventListener("click", () => {
  chatbotWindow.classList.add("open");
  chatbotToggle.style.display = "none";
  chatbotInput.focus();
});
 
chatbotClose.addEventListener("click", () => {
  chatbotWindow.classList.remove("open");
  chatbotToggle.style.display = "flex";
});
 
// Send a message
async function sendChatMessage() {
  const question = chatbotInput.value.trim();
  if (!question) return;
 
  // Add user message to UI
  appendMessage("user", question);
  chatbotInput.value = "";
  chatbotInput.disabled = true;
  chatbotSend.disabled = true;
 
  // Show typing indicator
  const typingEl = appendTypingIndicator();
 
  try {
    const response = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
 
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
 
    const data = await response.json();
    typingEl.remove();
 
    const answer = data.answer || "I'm sorry, I couldn't find an answer to that.";
    appendMessage("assistant", answer);
  } catch (err) {
    typingEl.remove();
    appendMessage(
      "assistant",
      "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      true
    );
    console.error("Chatbot error:", err);
  } finally {
    chatbotInput.disabled = false;
    chatbotSend.disabled = false;
    chatbotInput.focus();
  }
}
 
function appendMessage(role, text, isError = false) {
  const messageEl = document.createElement("div");
  messageEl.className = `chatbot-message ${role}`;

  const bubbleEl = document.createElement("div");
  bubbleEl.className = "chatbot-bubble";
  if (isError) bubbleEl.classList.add("error");

  // Render markdown for assistant messages, plain text for user messages
  if (role === "assistant" && !isError && typeof marked !== "undefined") {
    // Configure marked for safe, chat-friendly rendering
    marked.setOptions({
      breaks: true,        // single newlines become <br> (chat-style)
      gfm: true,           // GitHub-flavored markdown (tables, strikethrough, etc.)
    });
    bubbleEl.innerHTML = DOMPurify.sanitize(marked.parse(text));
  } else {
    // User messages and errors: plain text only (safer, no rendering surprises)
    text.split("\n").forEach((line, i) => {
      if (i > 0) bubbleEl.appendChild(document.createElement("br"));
      bubbleEl.appendChild(document.createTextNode(line));
    });
  }

  messageEl.appendChild(bubbleEl);
  chatbotMessages.appendChild(messageEl);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
 
function appendTypingIndicator() {
  const messageEl = document.createElement("div");
  messageEl.className = "chatbot-message assistant";
  messageEl.innerHTML = `
    <div class="chatbot-bubble typing">
      <span></span><span></span><span></span>
    </div>
  `;
  chatbotMessages.appendChild(messageEl);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return messageEl;
}
 
// Wire up send button + Enter key
chatbotSend.addEventListener("click", sendChatMessage);
chatbotInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChatMessage();
  }
});
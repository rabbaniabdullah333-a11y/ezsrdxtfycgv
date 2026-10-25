/**
 * ApexScale Commerce — Intelligent Rule-Based FAQ & Lead Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
  // Guard: requires SITE_CONFIG from main.js
  if (typeof SITE_CONFIG === "undefined") {
    console.warn("Chatbot: SITE_CONFIG not found. Ensure main.js loads before chatbot.js.");
    return;
  }
  // Chatbot knowledge base
  const FAQ_KNOWLEDGE = [
    {
      keywords: ["private label", "pl", "launch", "product hunting", "sourcing", "supplier"],
      title: "Amazon Private Label Support",
      reply: "Our Amazon Private Label service covers the end-to-end launch journey: data-driven product validation, Alibaba supplier sourcing, brand strategy, compliant listing creation, A+ content, FBA logistics planning, and PPC launch advertising across USA, UK, UAE, Saudi Arabia, and Canada.",
      actionText: "Enquire about Private Label",
      actionService: "Amazon Private Label"
    },
    {
      keywords: ["llc", "formation", "texas", "wyoming", "florida", "ein", "registered agent", "company"],
      title: "US LLC Formation Coordination",
      reply: "We coordinate US LLC formation in key states including Texas, Florida, and Wyoming. We also assist with EIN guidance, registered agent coordination, and business address options for eligible Amazon sellers. *Note: State filing requirements apply; this is corporate coordination, not formal legal/tax advice.*",
      actionText: "Enquire about LLC Formation",
      actionService: "LLC Formation"
    },
    {
      keywords: ["trademark", "brand registry", "uspto", "ukipo", "ip"],
      title: "Trademark & Brand Registry",
      reply: "We coordinate preliminary brand name conflict searches, filing guidance for US (USPTO) and UK (UKIPO) trademarks, and Amazon Brand Registry enrollment to unlock A+ Content, Brand Stores, and IP protection. *Registration is subject to official USPTO/UKIPO review.*",
      actionText: "Enquire about Trademark",
      actionService: "Trademark Services"
    },
    {
      keywords: ["reactivation", "suspended", "suspension", "poa", "plan of action", "appeal", "deactivated", "section 3"],
      title: "Amazon Account Reactivation & Appeals",
      reply: "We conduct root-cause audits of suspension notices and prepare structured, evidence-based Plans of Action (POA) addressing policy, verification, and performance issues. *Please note: All appeals must be truthful; Amazon holds final discretion and reinstatement cannot be legally guaranteed.*",
      actionText: "Get Account Appeal Review",
      actionService: "Amazon Account Reactivation"
    },
    {
      keywords: ["ppc", "audit", "advertising", "acos", "roas", "tacos", "ads"],
      title: "Amazon PPC Audit & Scaling",
      reply: "Our PPC audit analyzes campaign structures, bid efficiency, converting vs wasted search terms, negative keyword opportunities, and target ACOS alignment to cut wasted ad spend and scale top-converting ASINs.",
      actionText: "Request a PPC Audit",
      actionService: "Amazon PPC Audit"
    },
    {
      keywords: ["training", "course", "learn", "curriculum", "classes"],
      title: "Amazon Private Label Training",
      reply: "Our comprehensive 12-module practical training covers the complete Private Label methodology from FBA fundamentals, product research, sourcing, listing SEO, PPC advertising, to inventory profitability and account health management.",
      actionText: "View Training Curriculum",
      actionService: "Amazon Private Label Training"
    },
    {
      keywords: ["listing", "seo", "images", "a+", "bullet points", "storefront", "design"],
      title: "Listing Optimization & Creative Design",
      reply: "We build conversion-focused Amazon listings featuring keyword-optimized titles, persuasive bullets, backend search terms, lifestyle infographics, and branded A+ modules designed to maximize organic rank and conversions.",
      actionText: "Optimize My Listing",
      actionService: "Listing Optimization"
    },
    {
      keywords: ["pricing", "cost", "price", "fee", "rate", "quote"],
      title: "Pricing & Custom Quotes",
      reply: "Because every Amazon brand and account stage is unique, all services are tailored with clear, transparent custom quotes following an initial scope audit. You can get an instant direct consultation via WhatsApp.",
      actionText: "Request Instant Custom Quote",
      actionService: "Custom Quote Consultation"
    },
    {
      keywords: ["contact", "phone", "whatsapp", "number", "email", "support", "location"],
      title: "Direct Specialist Contact",
      reply: "You can reach our lead Amazon strategist directly on WhatsApp at +92 346 5172117 or by email at sefatamz@gmail.com. We operate across US, UK, and Middle East business hours.",
      actionText: "Open WhatsApp Now",
      actionService: "Direct Contact"
    }
  ];

  // Inject Chatbot DOM if not already present
  let wrapper = document.querySelector(".chatbot-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "chatbot-wrapper";
    wrapper.innerHTML = `
      <!-- Mobile Backdrop for Easy Outside Tap to Close -->
      <div class="chatbot-mobile-backdrop" id="chatbotMobileBackdrop"></div>

      <!-- Roaming Full Robot Assistant Launcher -->
      <div class="chatbot-roam-track" id="chatbotRoamTrack">
        <button class="chatbot-robot-launcher" id="chatbotLauncher" aria-label="Open ApexScale Support Chat" aria-expanded="false" title="Click to chat with AI Assistant">
          <div class="robot-speech-bubble" id="robotSpeechBubble">
            <span class="bubble-pulse-dot" aria-hidden="true"></span>
            <span class="speech-bubble-text" id="robotBubbleText">Hi! Ask me anything 👋</span>
          </div>
          <div class="robot-character-wrap">
            <img src="assets/images/chatbot-icon-new.jpg" alt="ApexScale AI Bot" class="chatbot-full-robot-img">
            <div class="robot-shadow"></div>
          </div>
          <span class="chatbot-badge"></span>
        </button>
      </div>

      <div class="chatbot-box" id="chatbotBox" role="dialog" aria-label="Support Assistant Chat Window">
        <!-- Mobile Top Handle Bar -->
        <div class="chatbot-mobile-drag-bar"></div>

        <div class="chatbot-header">
          <div class="chatbot-agent-info">
            <div class="chatbot-avatar">
              <img src="assets/images/chatbot-icon-new.jpg" alt="ApexScale Assistant" onerror="this.src='assets/images/favicon.svg'">
              <span class="chatbot-avatar-ring"></span>
            </div>
            <div class="chatbot-agent-details">
              <h4>ApexScale Assistant <span class="chatbot-verified-badge" title="Official Automated Assistant">✓</span></h4>
              <span class="chatbot-agent-status">
                <span class="pulse-dot"></span> Online • Instant Knowledge Base
              </span>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button class="chatbot-btn-tool" id="chatbotResetBtn" title="Reset Conversation" aria-label="Reset Conversation">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
            <button class="chatbot-btn-tool" id="chatbotCloseBtn" title="Close Chat" aria-label="Close Chat">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="chatbot-messages" id="chatbotMessages">
          <!-- Initial Welcome Message -->
          <div class="chat-bubble bot">
            <p><strong>Welcome to ApexScale Commerce!</strong> 👋</p>
            <p style="margin-top:6px;">I am your intelligent Amazon Private Label &amp; Brand Scaling assistant. How can I help your brand today?</p>
            <p style="margin-top:10px;font-size:0.8rem;color:#94A3B8;font-weight:600;">Popular topics:</p>
            <div class="chat-quick-chips">
              <button class="quick-chip" data-query="Amazon Private Label">📦 Private Label</button>
              <button class="quick-chip" data-query="LLC Formation">🏢 US LLC Formation</button>
              <button class="quick-chip" data-query="Trademark">⚖️ Trademark &amp; Registry</button>
              <button class="quick-chip" data-query="Reactivation">🛡️ Account Reactivation</button>
              <button class="quick-chip" data-query="PPC Audit">📈 PPC Audit &amp; Ads</button>
              <button class="quick-chip" data-query="Training">🎓 12-Module Training</button>
              <button class="quick-chip" data-query="Pricing">💰 Pricing &amp; Quotes</button>
              <button class="quick-chip" data-query="WhatsApp">💬 Chat on WhatsApp</button>
            </div>
          </div>
        </div>

        <div class="chatbot-footer">
          <form id="chatbotInputForm" class="chatbot-input-row">
            <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Ask about services, pricing, audit..." autocomplete="off">
            <button type="submit" class="chatbot-send-btn" aria-label="Send message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          <div class="chatbot-footer-support">
            <a href="https://wa.me/${SITE_CONFIG.whatsappNumber}" target="_blank" rel="noopener">
              <span class="wa-dot"></span>
              <span>Need human consultation? Chat directly on WhatsApp (+92 346 5172117)</span>
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);
  }

  const launcher = document.getElementById("chatbotLauncher");
  const chatBox = document.getElementById("chatbotBox");
  const closeBtn = document.getElementById("chatbotCloseBtn");
  const resetBtn = document.getElementById("chatbotResetBtn");
  const messagesContainer = document.getElementById("chatbotMessages");
  const inputForm = document.getElementById("chatbotInputForm");
  const chatInput = document.getElementById("chatbotInput");
  const speechBubble = document.getElementById("robotSpeechBubble");
  const mobileBackdrop = document.getElementById("chatbotMobileBackdrop");

  // Rotating friendly messages in speech bubble (without overwriting the pulse dot)
  const bubbleText = document.getElementById("robotBubbleText");
  if (bubbleText) {
    const robotMessages = [
      "Hi! Ask me anything 👋",
      "Amazon Private Label? 🚀",
      "Need US LLC or Trademark? 🏢",
      "Amazon PPC Audit? 📈",
      "I'm your AI Assistant! 🤖",
      "Click to chat with me! 💬"
    ];
    let msgIdx = 0;
    setInterval(() => {
      if (!chatBox.classList.contains("open")) {
        msgIdx = (msgIdx + 1) % robotMessages.length;
        bubbleText.textContent = robotMessages[msgIdx];
      }
    }, 4500);
  }

  function closeChat() {
    chatBox.classList.remove("open");
    wrapper.classList.remove("chat-open");
    launcher.setAttribute("aria-expanded", "false");
    document.body.classList.remove("chatbot-body-locked");
  }

  function openChat() {
    chatBox.classList.add("open");
    wrapper.classList.add("chat-open");
    launcher.setAttribute("aria-expanded", "true");
    if (window.innerWidth <= 768) {
      document.body.classList.add("chatbot-body-locked");
    }
    setTimeout(() => {
      chatInput.focus();
    }, 150);
  }

  // Toggle open
  function toggleChat() {
    if (chatBox.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  }

  launcher.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", closeChat);

  // Click backdrop on mobile to close
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeChat);
  }

  // ESC key to close chat
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatBox.classList.contains("open")) {
      closeChat();
    }
  });

  // Reset conversation
  resetBtn.addEventListener("click", () => {
    messagesContainer.innerHTML = `
      <div class="chat-bubble bot">
        <p><strong>Conversation reset.</strong> How can I help your brand today?</p>
        <p style="margin-top:10px;font-size:0.8rem;color:#94A3B8;font-weight:600;">Popular topics:</p>
        <div class="chat-quick-chips">
          <button class="quick-chip" data-query="Amazon Private Label">📦 Private Label</button>
          <button class="quick-chip" data-query="LLC Formation">🏢 US LLC Formation</button>
          <button class="quick-chip" data-query="Trademark">⚖️ Trademark &amp; Registry</button>
          <button class="quick-chip" data-query="Reactivation">🛡️ Account Reactivation</button>
          <button class="quick-chip" data-query="PPC Audit">📈 PPC Audit &amp; Ads</button>
          <button class="quick-chip" data-query="Training">🎓 12-Module Training</button>
          <button class="quick-chip" data-query="Pricing">💰 Pricing &amp; Quotes</button>
          <button class="quick-chip" data-query="WhatsApp">💬 Chat on WhatsApp</button>
        </div>
      </div>
    `;
  });

  // Process user query
  function handleQuery(queryText) {
    if (!queryText.trim()) return;

    // Add user message bubble
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = queryText;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Search Knowledge Base
    const cleanQuery = queryText.toLowerCase();
    let bestMatch = null;

    for (let item of FAQ_KNOWLEDGE) {
      for (let kw of item.keywords) {
        if (cleanQuery.includes(kw)) {
          bestMatch = item;
          break;
        }
      }
      if (bestMatch) break;
    }

    // Typing simulation delay
    setTimeout(() => {
      const botBubble = document.createElement("div");
      botBubble.className = "chat-bubble bot";

      if (bestMatch) {
        const waUrl = getWhatsAppQuoteUrl(bestMatch.actionService, "USA / Global");
        botBubble.innerHTML = `
          <p><strong>${bestMatch.title}</strong></p>
          <p style="margin-top:6px;">${bestMatch.reply}</p>
          <div style="margin-top:10px;">
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="display:inline-flex;padding:6px 12px;font-size:0.78rem;">
              <span>💬 ${bestMatch.actionText} on WhatsApp</span>
            </a>
          </div>
        `;
      } else {
        const defaultWa = getWhatsAppQuoteUrl(queryText, "USA / Global");
        botBubble.innerHTML = `
          <p>Thank you for asking about <em>"${escapeHtml(queryText)}"</em>.</p>
          <p style="margin-top:6px;">For tailored scope details or immediate quotes, our Amazon specialists are available on WhatsApp for direct consultation.</p>
          <div style="margin-top:10px;">
            <a href="${defaultWa}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="display:inline-flex;padding:6px 12px;font-size:0.78rem;">
              <span>Chat with Specialist on WhatsApp (+92 346 5172117)</span>
            </a>
          </div>
        `;
      }

      messagesContainer.appendChild(botBubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 380);
  }

  // Handle Form submit
  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = chatInput.value.trim();
    if (q) {
      chatInput.value = "";
      handleQuery(q);
    }
  });

  // Robust delegation for quick chip clicks (covers initial, reset, and appended chips without double triggers)
  messagesContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".quick-chip");
    if (chip && messagesContainer.contains(chip)) {
      const query = chip.getAttribute("data-query");
      if (query) {
        handleQuery(query);
      }
    }
  });

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});

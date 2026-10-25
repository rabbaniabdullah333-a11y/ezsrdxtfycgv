/**
 * ApexScale Commerce — Contact Form & Lead Handoff Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("leadContactForm");
  const modalOverlay = document.getElementById("leadModalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalSummary = document.getElementById("modalLeadSummary");
  const modalWaAction = document.getElementById("modalWaAction");
  const modalMailAction = document.getElementById("modalMailAction");

  if (!contactForm) return;

  // Real-time input validation on blur and input
  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      const result = FormValidator.validateField(input);
      if (!result.isValid) {
        FormValidator.showError(input, result.message);
      } else {
        FormValidator.clearError(input);
      }
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        const result = FormValidator.validateField(input);
        if (result.isValid) {
          FormValidator.clearError(input);
        }
      }
    });
  });

  // Pre-fill service from URL param or hash if available
  const urlParams = new URLSearchParams(window.location.search);
  const prefillService = urlParams.get("service") || decodeURIComponent(window.location.hash.replace("#", "") || "");
  if (prefillService) {
    const serviceSelect = contactForm.querySelector("[name='service']");
    if (serviceSelect) {
      for (let option of serviceSelect.options) {
        if (option.text.toLowerCase().includes(prefillService.toLowerCase()) || option.value.toLowerCase().includes(prefillService.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
  }

  // Handle form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;

    inputs.forEach(input => {
      const result = FormValidator.validateField(input);
      if (!result.isValid) {
        FormValidator.showError(input, result.message);
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = input;
      } else {
        FormValidator.clearError(input);
      }
    });

    if (!isFormValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // Collect form data
    const formData = new FormData(contactForm);
    const leadData = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      whatsapp: formData.get("whatsapp") || "",
      service: formData.get("service") || "Amazon Growth Services",
      marketplace: formData.get("marketplace") || "USA",
      message: formData.get("message") || "Ready to discuss quote and scope."
    };

    // Format WhatsApp message
    const waText = `*ApexScale Commerce Inquiry*\n\n` +
      `*Name:* ${leadData.name}\n` +
      `*Email:* ${leadData.email}\n` +
      `*WhatsApp:* ${leadData.whatsapp}\n` +
      `*Service Required:* ${leadData.service}\n` +
      `*Target Marketplace:* ${leadData.marketplace}\n\n` +
      `*Project Details:*\n${leadData.message}`;

    const waLink = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    
    // Format mailto link
    const mailSubject = encodeURIComponent(`ApexScale Quote Request: ${leadData.service} (${leadData.marketplace})`);
    const mailBody = encodeURIComponent(
      `Name: ${leadData.name}\n` +
      `Email: ${leadData.email}\n` +
      `WhatsApp: ${leadData.whatsapp}\n` +
      `Service: ${leadData.service}\n` +
      `Marketplace: ${leadData.marketplace}\n\n` +
      `Details:\n${leadData.message}`
    );
    const mailLink = `mailto:${SITE_CONFIG.email}?subject=${mailSubject}&body=${mailBody}`;

    // Display formatted summary in modal
    if (modalSummary) {
      modalSummary.innerHTML = `
        <p><strong>Name:</strong> ${escapeHtml(leadData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(leadData.email)}</p>
        <p><strong>WhatsApp:</strong> ${escapeHtml(leadData.whatsapp)}</p>
        <p><strong>Service:</strong> ${escapeHtml(leadData.service)}</p>
        <p><strong>Marketplace:</strong> ${escapeHtml(leadData.marketplace)}</p>
        <p style="margin-top:8px;"><strong>Project Summary:</strong> ${escapeHtml(leadData.message)}</p>
      `;
    }

    if (modalWaAction) {
      modalWaAction.onclick = () => {
        window.open(waLink, "_blank", "noopener,noreferrer");
      };
    }

    if (modalMailAction) {
      modalMailAction.onclick = () => {
        window.location.href = mailLink;
      };
    }

    // Show modal
    if (modalOverlay) {
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });

  // Modal close handlers
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      if (modalOverlay) modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});

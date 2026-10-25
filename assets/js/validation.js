/**
 * ApexScale Commerce — Client-side Form Validation Library
 */

const FormValidator = {
  // Regular expressions
  patterns: {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
    phone: /^(\+?[0-9\s\-()]{7,20})$/
  },

  /**
   * Validate a single input field
   * @param {HTMLElement} field 
   * @returns {{isValid: boolean, message: string}}
   */
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute("required");
    const name = field.getAttribute("name");
    const type = field.getAttribute("type");

    // Check required
    if (isRequired && !value) {
      return { isValid: false, message: "This field is required." };
    }

    if (!value && !isRequired) {
      return { isValid: true, message: "" };
    }

    // Email validation
    if (type === "email" || name === "email") {
      if (!this.patterns.email.test(value)) {
        return { isValid: false, message: "Please enter a valid email address (e.g., name@domain.com)." };
      }
    }

    // Phone / WhatsApp validation
    if (name === "whatsapp" || name === "phone") {
      if (!this.patterns.phone.test(value)) {
        return { isValid: false, message: "Please enter a valid phone or WhatsApp number with country code." };
      }
    }

    // Name field validation
    if (name === "name" || name === "fullName") {
      if (value.length < 2) {
        return { isValid: false, message: "Please enter your full name (minimum 2 characters)." };
      }
    }

    // Message details validation
    if (name === "message" || name === "details") {
      if (value.length < 10) {
        return { isValid: false, message: "Please provide at least 10 characters explaining your goals." };
      }
    }

    return { isValid: true, message: "" };
  },

  /**
   * Show error state on a field
   * @param {HTMLElement} field 
   * @param {string} message 
   */
  showError(field, message) {
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
    let feedback = field.parentNode.querySelector(".form-feedback");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "form-feedback";
      field.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = "block";
  },

  /**
   * Clear error state on a field
   * @param {HTMLElement} field 
   */
  clearError(field) {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    const feedback = field.parentNode.querySelector(".form-feedback");
    if (feedback) {
      feedback.style.display = "none";
      feedback.textContent = "";
    }
  }
};

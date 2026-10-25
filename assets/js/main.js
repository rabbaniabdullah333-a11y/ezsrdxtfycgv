/**
 * ApexScale Commerce — Core Site Configuration & Main Utilities
 * Centralized configuration used across all pages
 */

const SITE_CONFIG = {
  brandName: "ApexScale Commerce",
  legalName: "ApexScale Commerce Partners Ltd.",
  tagline: "Data-Driven Amazon Growth & Private Label Scaling",
  whatsappNumber: "923465172117",
  whatsappDisplay: "+92 346 5172117",
  whatsappUrl: "https://wa.me/923465172117",
  email: "sefatamz@gmail.com",
  founderName: "Sefatullah",
  founderRole: "Founder & Lead Amazon Private Label Specialist",
  experienceYears: "5+",
  socialHandle: "@ApexScaleCommerce",
  marketplaces: "USA, UK, UAE, Saudi Arabia, Canada, Germany",
  currentYear: new Date().getFullYear()
};

/**
 * Generate a pre-filled WhatsApp link with professional enquiry text
 * @param {string} service 
 * @param {string} marketplace 
 * @returns {string} URL
 */
function getWhatsAppQuoteUrl(service = "General Inquiry", marketplace = "USA") {
  const text = `Hello ApexScale Commerce team,\n\nI am interested in your ${service} service for the ${marketplace} marketplace.\n\nPlease share your consultation process, quote details, and next steps.\n\nThank you!`;
  return `${SITE_CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Bind dynamic copyright year if element exists
  const yearElements = document.querySelectorAll(".current-year");
  yearElements.forEach(el => {
    el.textContent = SITE_CONFIG.currentYear;
  });

  // Sticky header scroll behavior
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  // Dynamic WhatsApp buttons with data-service and data-marketplace attributes
  const waButtons = document.querySelectorAll("[data-wa-service]");
  waButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const service = btn.getAttribute("data-wa-service") || "Amazon Growth Inquiry";
      const marketplace = btn.getAttribute("data-wa-marketplace") || "USA / Global";
      const url = getWhatsAppQuoteUrl(service, marketplace);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
});

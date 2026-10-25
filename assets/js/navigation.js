/**
 * ApexScale Commerce — Premium Navigation Controller v2.0
 * Mobile menu, dropdown, active state management & keyboard accessibility
 */

document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn      = document.getElementById("burgerBtn");
  const mobileNav      = document.getElementById("mobileNav");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const mobileCloseBtn = document.getElementById("mobileCloseBtn");
  const navDropdowns   = document.querySelectorAll(".nav-dropdown");
  const mobileLinks    = document.querySelectorAll(".mobile-nav-link, .mobile-sublink");

  // ─── Mobile Menu Open/Close ────────────────────────────────────────────────
  function openMobileNav() {
    if (!mobileNav || !mobileBackdrop) return;
    mobileNav.classList.add("open");
    mobileBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "true");
    mobileNav.focus?.();
  }

  function closeMobileNav() {
    if (!mobileNav || !mobileBackdrop) return;
    mobileNav.classList.remove("open");
    mobileBackdrop.classList.remove("active");
    document.body.style.overflow = "";
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
  }

  if (burgerBtn)       burgerBtn.addEventListener("click", openMobileNav);
  if (mobileCloseBtn)  mobileCloseBtn.addEventListener("click", closeMobileNav);
  if (mobileBackdrop)  mobileBackdrop.addEventListener("click", closeMobileNav);

  // Close mobile nav on link click (smooth UX)
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Small delay so page can begin navigating
      setTimeout(closeMobileNav, 150);
    });
  });

  // ─── Keyboard Support ──────────────────────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeMobileNav();
      navDropdowns.forEach(dd => closeDropdown(dd));
    }
  });

  // ─── Desktop Dropdown Management ──────────────────────────────────────────
  function openDropdown(dd) {
    const toggle = dd.querySelector(".nav-dropdown-toggle");
    dd.classList.add("open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function closeDropdown(dd) {
    const toggle = dd.querySelector(".nav-dropdown-toggle");
    dd.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function closeAllDropdowns(except = null) {
    navDropdowns.forEach(dd => {
      if (dd !== except) closeDropdown(dd);
    });
  }

  navDropdowns.forEach(dd => {
    const toggle = dd.querySelector(".nav-dropdown-toggle");

    // Click toggle
    if (toggle) {
      toggle.addEventListener("click", e => {
        e.stopPropagation();
        const isOpen = dd.classList.contains("open");
        closeAllDropdowns(dd);
        isOpen ? closeDropdown(dd) : openDropdown(dd);
      });
    }

    // Keyboard: open on Enter/Space, close on Tab-out
    if (toggle) {
      toggle.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const isOpen = dd.classList.contains("open");
          closeAllDropdowns(dd);
          isOpen ? closeDropdown(dd) : openDropdown(dd);
        }
      });
    }
  });

  // Click outside → close all dropdowns
  document.addEventListener("click", e => {
    if (!e.target.closest(".nav-dropdown")) {
      closeAllDropdowns();
    }
  });

  // ─── Active Navigation Link Highlighting ───────────────────────────────────
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const allNavLinks = document.querySelectorAll(".nav-link, .mobile-nav-link, .dropdown-item, .mobile-sublink");

  allNavLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;

    // Normalize href (strip query/hash)
    const linkPage = href.split("?")[0].split("#")[0];

    if (linkPage === currentPath || (currentPath === "" && linkPage === "index.html")) {
      link.classList.add("active");

      // Also activate parent dropdown if applicable
      const parentDropdown = link.closest(".nav-dropdown");
      if (parentDropdown) {
        parentDropdown.classList.add("active");
        const toggle = parentDropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.classList.add("active");
      }
    }
  });

  // ─── Header Scroll Behavior (already in main.js, but add illumination) ────
  const header = document.querySelector(".site-header");
  if (header) {
    let lastScrollY = 0;
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;

      if (scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Optional: hide header on fast scroll down, show on up
      // (subtle behavior, not aggressive)
      lastScrollY = scrollY;
    }, { passive: true });
  }

  // ─── Smooth Active State for Service Pages Dropdown ───────────────────────
  // Ensure the Services dropdown shows as active on all service sub-pages
  const servicePages = [
    "services.html", "amazon-private-label.html", "llc-formation.html",
    "trademark-services.html", "graphics-design.html", "account-reactivation.html",
    "amazon-ppc-audit.html", "listing-optimization.html", "seller-account-creation.html",
    "payment-setup.html", "training.html"
  ];

  if (servicePages.includes(currentPath)) {
    const servicesDropdown = document.querySelector(".nav-dropdown");
    if (servicesDropdown) {
      servicesDropdown.classList.add("active");
      const toggle = servicesDropdown.querySelector(".nav-dropdown-toggle");
      if (toggle) toggle.classList.add("active");
    }
  }
});

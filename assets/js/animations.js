/**
 * ApexScale Commerce — Premium Scroll Reveal, Counter & Illumination System v2.0
 * Advanced IntersectionObserver-powered animations with full reduced-motion support
 */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── Scroll Reveal Observer ───────────────────────────────────────────────
  const REVEAL_SELECTORS = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
  const revealElements = document.querySelectorAll(REVEAL_SELECTORS);

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Reduced motion: immediately reveal everything
    revealElements.forEach(el => el.classList.add("active"));
  }

  // ─── Animated Number Counters ─────────────────────────────────────────────
  const counterElements = document.querySelectorAll("[data-counter]");

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-counter"));
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutExpo(progress);
      const currentVal = target * ease;

      el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => {
      const target = el.getAttribute("data-counter");
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      el.textContent = `${prefix}${target}${suffix}`;
    });
  }

  // ─── Premium Staggered Grid Card Reveals ──────────────────────────────────
  // Automatically assign reveal delays to grid items
  const grids = document.querySelectorAll(".grid-3, .grid-4");
  grids.forEach(grid => {
    const cards = grid.querySelectorAll(".service-card, .subservice-card, .step-card, .value-card");
    cards.forEach((card, idx) => {
      if (!card.classList.contains("reveal")) {
        card.classList.add("reveal");
      }
      const delayClass = `reveal-delay-${(idx % 3) + 1}`;
      if (!card.classList.contains(delayClass)) {
        card.classList.add(delayClass);
      }
    });
  });

  // Re-observe newly added reveal classes
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const newRevealEls = document.querySelectorAll(".reveal:not(.active)");
    const newObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    newRevealEls.forEach(el => newObserver.observe(el));
  }

  // ─── Illuminated Section Background Glow ──────────────────────────────────
  // Add dynamic glow effect to section-alt on scroll
  const sectionAlts = document.querySelectorAll(".section-alt");
  if (!prefersReducedMotion && sectionAlts.length > 0) {
    const glowObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.setProperty("--section-glow-opacity", "1");
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionAlts.forEach(el => glowObserver.observe(el));
  }

  // ─── Smooth Scroll for Anchor Links ───────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

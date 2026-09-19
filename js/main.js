// HARD2ACKRIGHT — main.js
// Placeholder for interactivity: smooth scroll, nav background on scroll, etc.

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav__inner");

  // Auto-update footer copyright year
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile nav (hamburger) ----------

  const burger = document.getElementById("navBurger");
  const mobileMenu = document.getElementById("navMobileMenu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const isOpen = burger.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", isOpen);
    });

    // Close the menu after tapping any link inside it
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Slightly darken the floating nav once the user scrolls past the hero top
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.style.background = "rgba(10, 10, 10, 0.85)";
    } else {
      nav.style.background = "rgba(10, 10, 10, 0.55)";
    }
  });

  // Smooth scroll for in-page nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------- Specs section: scroll-triggered reveal + count-up ----------

  const revealCards = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger each card's reveal slightly based on its position
          const card = entry.target;
          const index = Array.from(revealCards).indexOf(card);
          setTimeout(() => {
            card.classList.add("is-visible");
            runCountUp(card);
          }, index * 120);

          revealObserver.unobserve(card);
        }
      });
    },
    { threshold: 0.3 }
  );

  revealCards.forEach((card) => revealObserver.observe(card));

  // Animate any [data-count-to] number inside a revealed card from 0 to target
  function runCountUp(card) {
    const counter = card.querySelector("[data-count-to]");
    if (!counter) return;

    const target = parseFloat(counter.getAttribute("data-count-to"));
    const duration = 900; // ms
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;

      counter.textContent = target % 1 === 0
        ? Math.round(value)
        : value.toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
      }
    }

    requestAnimationFrame(step);
  }

  // ---------- How to Use: drill tab switcher ----------

  const drillTabs = document.querySelectorAll("[data-drill]");
  const drillDetails = document.querySelectorAll("[data-drill-detail]");

  drillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-drill");

      drillTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");

      drillDetails.forEach((detail) => {
        detail.classList.remove("is-active");
        // Restart the fade-in animation each time it's shown
        detail.style.animation = "none";
        detail.offsetHeight; // force reflow
        detail.style.animation = "";
      });

      const activeDetail = document.querySelector(
        `[data-drill-detail="${targetId}"]`
      );
      if (activeDetail) activeDetail.classList.add("is-active");
    });
  });

  // ---------- FAQ accordion ----------

  const faqItems = document.querySelectorAll("[data-faq]");

  function setFaqHeight(item) {
    const answer = item.querySelector(".faq__answer");
    if (item.classList.contains("is-open")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = "0px";
    }
  }

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq__question");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close all, then reopen the clicked one if it wasn't already open
      faqItems.forEach((i) => {
        i.classList.remove("is-open");
        setFaqHeight(i);
      });

      if (!isOpen) {
        item.classList.add("is-open");
        setFaqHeight(item);
      }
    });

    // Keep the open answer's height accurate if the window is resized
    // (e.g. rotating a phone, or text reflowing at a new breakpoint)
    window.addEventListener("resize", () => {
      if (item.classList.contains("is-open")) setFaqHeight(item);
    });
  });

  // Set initial height for the pre-opened FAQ item on page load
  faqItems.forEach((item) => {
    if (item.classList.contains("is-open")) setFaqHeight(item);
  });

  // ---------- Hero: scroll-driven zoom video ----------

  const heroPin = document.querySelector(".hero-pin");
  const heroVideo = document.getElementById("heroVideo");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (heroPin && heroVideo && !prefersReducedMotion) {
    const ZOOM_START = 1.6; // scale at the top of the pin zone
    const ZOOM_END = 1.0;   // scale once the pin zone is exhausted

    let ticking = false;

    function updateHeroZoom() {
      const rect = heroPin.getBoundingClientRect();
      const pinHeight = heroPin.offsetHeight; // 200vh worth of pixels
      const viewportHeight = window.innerHeight;

      // Scrollable distance within the pin zone is (pinHeight - viewportHeight),
      // since the last viewportHeight's worth is where the sticky child is
      // fully released and sitting at its final position.
      const scrollableDistance = pinHeight - viewportHeight;

      // How far we've scrolled into the pin zone: 0 at the very top of
      // .hero-pin, growing as rect.top moves negative.
      const scrolled = -rect.top;

      let progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 1;
      progress = Math.min(Math.max(progress, 0), 1); // clamp 0–1

      const currentScale = ZOOM_START + (ZOOM_END - ZOOM_START) * progress;
      heroVideo.style.transform = `scale(${currentScale})`;

      ticking = false;
    }

    // Throttle scroll handling to one calculation per animation frame
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateHeroZoom);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Run once on load in case the page loads already scrolled
    // (e.g. anchor-link navigation or a refresh mid-page)
    updateHeroZoom();

    // iOS Safari sometimes needs an explicit play() call even with the
    // autoplay attribute present, especially after being backgrounded.
    heroVideo.play().catch(() => {
      // Autoplay was blocked — poster/placeholder background remains visible,
      // which is an acceptable fallback rather than a broken page.
    });
  }
});
// HARD2ACKRIGHT — main.js
// Placeholder for interactivity: smooth scroll, nav background on scroll, etc.

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav__inner");

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
});
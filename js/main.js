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
});

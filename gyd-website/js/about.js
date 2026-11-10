/* =====================================================
   GET YOUR DOCTORATE — ABOUT PAGE JAVASCRIPT
   Optional entrance animation
   Content remains visible without this script
   ===================================================== */

(function () {
  "use strict";

  function initGydAbout() {
    var root = document.getElementById("gyd-about-page");

    /* Stop if the page is absent or already initialized. */
    if (!root || root.dataset.gydInitialized === "true") {
      return;
    }

    root.dataset.gydInitialized = "true";

    /*
     * Leave content unchanged when IntersectionObserver
     * is unavailable or reduced motion is preferred.
     */
    if (
      !("IntersectionObserver" in window) ||
      (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    ) {
      return;
    }

    var items = root.querySelectorAll(".gyd-reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("gyd-enter");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08
      }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* Initialize after the page markup is available. */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initGydAbout,
      {
        once: true
      }
    );
  } else {
    initGydAbout();
  }
})();
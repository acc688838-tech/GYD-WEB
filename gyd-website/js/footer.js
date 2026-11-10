/* =====================================================
   GET YOUR DOCTORATE — SHARED FOOTER JAVASCRIPT

   Includes:
   1. Automatic copyright year
   2. WhatsApp enquiry message
   3. Entrance-animation trigger
   4. Desktop pointer spotlight tracking
   ===================================================== */

(function () {
  "use strict";

  function initializeFooters() {
    /* ================= COPYRIGHT YEAR ================= */

    document
      .querySelectorAll(".gyd-copyright-year")
      .forEach(function (element) {
        element.textContent = new Date().getFullYear();
      });

    /* ================= FOOTER INITIALIZATION ================= */

    var footers = document.querySelectorAll(".gyd-footer");

    var reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    var finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    footers.forEach(function (footer) {
      /* Prevent duplicate initialization. */
      if (footer.dataset.gydEnhanced === "true") {
        return;
      }

      footer.dataset.gydEnhanced = "true";

      /* ================= WHATSAPP MESSAGE ================= */

      var phoneNumber = "917338890647";

      var message =
        "Hello, I would like to enquire about your research guidance services.";

      footer
        .querySelectorAll(".gyd-whatsapp")
        .forEach(function (link) {
          link.href =
            "https://wa.me/" +
            phoneNumber +
            "?text=" +
            encodeURIComponent(message);
        });

      /* ================= ONE-TIME ENTRANCE TRIGGER ================= */

      if (
        !reducedMotion.matches &&
        "IntersectionObserver" in window
      ) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) {
                return;
              }

              footer.classList.add("gyd-animate");
              observer.disconnect();
            });
          },
          {
            threshold: 0.12
          }
        );

        observer.observe(footer);

        footer.addEventListener("animationend", function (event) {
          if (
            event.animationName === "gyd-footer-rise" &&
            event.target.classList.contains("gyd-strip")
          ) {
            footer.classList.remove("gyd-animate");
          }
        });
      }

      /* ================= DESKTOP POINTER TRACKING ================= */

      var frameId = null;
      var pointerX = 0;
      var pointerY = 0;

      function stopSpotlight() {
        footer.classList.remove("gyd-pointer-active");

        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
      }

      footer.addEventListener(
        "pointermove",
        function (event) {
          if (
            reducedMotion.matches ||
            !finePointer.matches ||
            event.pointerType === "touch"
          ) {
            stopSpotlight();
            return;
          }

          var bounds = footer.getBoundingClientRect();

          pointerX = event.clientX - bounds.left;
          pointerY = event.clientY - bounds.top;

          if (frameId !== null) {
            return;
          }

          frameId = window.requestAnimationFrame(function () {
            footer.style.setProperty(
              "--gyd-pointer-x",
              pointerX + "px"
            );

            footer.style.setProperty(
              "--gyd-pointer-y",
              pointerY + "px"
            );

            footer.classList.add("gyd-pointer-active");

            frameId = null;
          });
        },
        {
          passive: true
        }
      );

      footer.addEventListener("pointerleave", stopSpotlight);
      footer.addEventListener("pointercancel", stopSpotlight);

      /* ================= REDUCED-MOTION CHANGES ================= */

      if (typeof reducedMotion.addEventListener === "function") {
        reducedMotion.addEventListener("change", function () {
          if (reducedMotion.matches) {
            stopSpotlight();
            footer.classList.remove("gyd-animate");
          }
        });
      }
    });
  }

  /* ================= START WHEN DOCUMENT IS READY ================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeFooters,
      {
        once: true
      }
    );
  } else {
    initializeFooters();
  }
})();
/* =====================================================
   GET YOUR DOCTORATE — PHD ADMISSION JAVASCRIPT

   Page scope: #gyd-admission

   Includes:
   1. Scroll-reveal animations
   2. Reading-progress bar
   3. Back-to-top button
   ===================================================== */

(function () {
  "use strict";

  function initGydAdmission() {
    var d = document;
    var root = d.documentElement;
    var win = window;

    var scope = d.getElementById("gyd-admission");

    /* Stop if this page is absent or already initialized. */
    if (!scope || scope.dataset.gydAdmissionInitialized === "true") {
      return;
    }

    scope.dataset.gydAdmissionInitialized = "true";

    var reduce = !!(
      win.matchMedia &&
      win.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    function $$(selector) {
      return Array.prototype.slice.call(
        scope.querySelectorAll(selector)
      );
    }


    /* ================= SCROLL REVEAL ================= */

    if ("IntersectionObserver" in win && !reduce) {
      root.classList.add("gyd-anim");

      var groups = [
        [".banner-arrow", "rv rv--left"],
        [".p2__bar", "rv"],
        [".adm-sub", "rv"],
        [".n-quote", "rv"],
        [".n-panel", "rv"],
        [".support__girl", "rv rv--zoom"],
        [".n-card", "rv"]
      ];

      var picked = [];

      groups.forEach(function (group) {
        $$(group[0]).forEach(function (element) {
          if (picked.indexOf(element) === -1) {
            element._xv = group[1];
            picked.push(element);
          }
        });
      });

      /* Stagger siblings by 90 ms, capped at six increments. */
      picked.forEach(function (element) {
        var parent = element.parentNode;

        parent._xn = parent._xn || 0;

        element.style.setProperty(
          "--d",
          Math.min(parent._xn++, 6) * 90 + "ms"
        );

        element.className += " " + element._xv;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            var element = entry.target;

            observer.unobserve(element);
            element.classList.add("in");

            /*
             * Remove animation helpers afterwards so the
             * original CSS hover transforms work normally.
             */
            win.setTimeout(function () {
              element.classList.remove(
                "rv",
                "rv--left",
                "rv--zoom",
                "in"
              );

              element.style.removeProperty("--d");
            }, 1700);
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -6% 0px"
        }
      );

      picked.forEach(function (element) {
        observer.observe(element);
      });
    }


    /* ================= PROGRESS BAR AND BACK TO TOP ================= */

    var bar = scope.querySelector(".x-progress");
    var toTop = scope.querySelector(".x-fab__top");
    var ticking = false;

    function update() {
      ticking = false;

      var y = win.pageYOffset || root.scrollTop;
      var max = root.scrollHeight - win.innerHeight;

      if (bar) {
        bar.style.setProperty(
          "--x-prog",
          max > 0
            ? Math.min(y / max, 1).toFixed(4)
            : "0"
        );
      }

      if (toTop) {
        toTop.classList.toggle("is-on", y > 700);
      }
    }

    function onScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      win.requestAnimationFrame(update);
    }

    if (toTop) {
      toTop.addEventListener("click", function () {
        win.scrollTo({
          top: 0,
          behavior: reduce ? "auto" : "smooth"
        });
      });
    }

    win.addEventListener("scroll", onScroll, {
      passive: true
    });

    win.addEventListener("resize", onScroll);

    update();
  }


  /* ================= START WHEN DOCUMENT IS READY ================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initGydAdmission,
      {
        once: true
      }
    );
  } else {
    initGydAdmission();
  }
})();
/* =====================================================
   GET YOUR DOCTORATE — SHARED HEADER
   Submenu toggle behaviour
   ===================================================== */

(function () {
  "use strict";

  function initGydHeader() {
    var btn = document.getElementById("subToggle");
    var menu = document.getElementById("submenu");

    /*
     * Your current header has no submenu button or container.
     * Leave the navigation unchanged when these are absent.
     */
    if (!btn || !menu) {
      return;
    }

    /* Prevent repeated event listeners. */
    if (btn.dataset.gydInitialized === "true") {
      return;
    }

    btn.dataset.gydInitialized = "true";

    function setOpen(open) {
      menu.classList.toggle("open", open);
      btn.textContent = open ? "−" : "+";
      btn.setAttribute("aria-expanded", String(open));
    }

    /* Match the button state to the existing menu state. */
    setOpen(menu.classList.contains("open"));

    btn.addEventListener("click", function (event) {
      event.preventDefault();

      setOpen(!menu.classList.contains("open"));
    });

    /* Close the submenu when clicking outside its parent. */
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".has-sub")) {
        setOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGydHeader, {
      once: true
    });
  } else {
    initGydHeader();
  }
})();
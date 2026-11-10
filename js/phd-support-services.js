/* =====================================================
   GET YOUR DOCTORATE — PHD SUPPORT & SERVICES

   Page scope: #gyd-support-page

   Includes:
   1. Scroll-reveal animations
   2. Reading-progress bar
   3. Sticky section navigation
   4. Active-section highlighting
   5. Floating WhatsApp button
   6. Back-to-top button
   ===================================================== */

(function () {
  "use strict";

  function initGydSupportServices() {
    var d = document;
    var root = d.documentElement;
    var win = window;
    var scope = d.getElementById("gyd-support-page");

    if (
      !scope ||
      scope.dataset.gydSupportInitialized === "true"
    ) {
      return;
    }

    scope.dataset.gydSupportInitialized = "true";

    var reduce = !!(
      win.matchMedia &&
      win.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    var hasIO = "IntersectionObserver" in win;

    function $(selector, context) {
      return (context || scope).querySelector(selector);
    }

    function $$(selector, context) {
      return Array.prototype.slice.call(
        (context || scope).querySelectorAll(selector)
      );
    }

    function behavior() {
      return reduce ? "auto" : "smooth";
    }


    /* ================= SCROLL REVEAL ================= */

    if (hasIO && !reduce) {
      root.classList.add("anim");

      var groups = [
        [".banner-arrow", "rv rv--left"],
        [".band", "rv rv--left"],
        [".p2bar", "rv"],
        [".title", "rv"],
        [".intro-main", "rv"],
        [".badge", "rv rv--zoom"],
        [".card", "rv"],
        [".cta-panel", "rv"],
        [".checklist li", "rv"],
        [".panel", "rv"],
        [".item", "rv"],
        [".lead-in", "rv"],
        [".pub-list li", "rv"],
        [".final-body", "rv"],
        [".foot-col", "rv"]
      ];

      var picked = [];

      groups.forEach(function (group) {
        $$(group[0]).forEach(function (element) {
          if (picked.indexOf(element) !== -1) {
            return;
          }

          element.className += " " + group[1];
          element._rv = group[1];
          picked.push(element);
        });
      });

      /* Keep the original sibling-based animation stagger. */
      picked.forEach(function (element) {
        var firstClass = element.classList[0];

        var siblings = $$(
          ":scope > ." + firstClass,
          element.parentNode
        );

        var index = siblings.indexOf(element);

        element.style.setProperty(
          "--d",
          Math.min(Math.max(index, 0), 6) * 90 + "ms"
        );
      });

      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            var element = entry.target;

            revealObserver.unobserve(element);
            element.classList.add("in");

            /*
             * Remove helper classes after the entrance
             * so the original hover transforms work again.
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
        revealObserver.observe(element);
      });
    }


    /* ================= ORIGINAL SVG ICONS ================= */

    var ICON_CAP =
      '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M22 10L12 5 2 10l10 5 10-5z"/>' +
        '<path d="M6 12v5c3 3 9 3 12 0v-5"/>' +
      "</svg>";

    var ICON_CHAT =
      '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 ' +
        '8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9' +
        'L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 ' +
        '8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9' +
        'h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
      "</svg>";

    var ICON_UP =
      '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' +
        '<line x1="12" y1="19" x2="12" y2="5"/>' +
        '<polyline points="5 12 12 5 19 12"/>' +
      "</svg>";


    /* ================= READING-PROGRESS BAR ================= */

    var progress = d.createElement("div");

    progress.className = "progress";
    progress.setAttribute("aria-hidden", "true");

    scope.appendChild(progress);


    /* ================= STICKY SECTION MENU ================= */

    var menu = [
      ["Presentation", "services"],
      ["Viva Voce", "viva"],
      ["Guidance", "guidance"],
      ["Originality", "originality"],
      ["Publication", "publication"]
    ];

    var nav = d.createElement("nav");

    nav.className = "nav";
    nav.setAttribute("aria-label", "Page sections");

    var html =
      '<div class="wrap nav-in">' +
        '<a class="nav-brand" href="#top" data-top>' +
          ICON_CAP +
          "<span>GET YOUR DOCTORATE</span>" +
        "</a>" +
        '<div class="nav-links">';

    menu.forEach(function (item) {
      html +=
        '<a href="#' + item[1] + '">' +
          item[0] +
        "</a>";
    });

    html +=
        "</div>" +
        '<a class="nav-cta" href="#contact">Contact</a>' +
      "</div>";

    nav.innerHTML = html;

    scope.appendChild(nav);


    /* ================= FLOATING BUTTONS ================= */

    var fab = d.createElement("div");

    fab.className = "fab";

    fab.innerHTML =
      '<a class="fab-wa" ' +
        'href="https://wa.me/917338890647" ' +
        'target="_blank" ' +
        'rel="noopener" ' +
        'aria-label="Chat on WhatsApp">' +
          ICON_CHAT +
      "</a>" +
      '<button class="fab-top" ' +
        'type="button" ' +
        'aria-label="Back to top">' +
          ICON_UP +
      "</button>";

    scope.appendChild(fab);

    var toTop = $(".fab-top", fab);

    function scrollTop() {
      win.scrollTo({
        top: 0,
        behavior: behavior()
      });
    }

    toTop.addEventListener("click", scrollTop);

    $("[data-top]", nav).addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        scrollTop();
      }
    );


    /* ================= SECTION-LINK SCROLLING ================= */

    /*
     * The original page enabled smooth scrolling globally.
     * Handle this page's internal links here instead, keeping
     * other pages and the shared navigation unaffected.
     */
    $$('#gyd-support-page a[href^="#"]', d).forEach(
      function (link) {
        if (link.hasAttribute("data-top")) {
          return;
        }

        link.addEventListener("click", function (event) {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          var href = link.getAttribute("href");

          if (!href || href === "#") {
            return;
          }

          var target = d.getElementById(href.slice(1));

          if (!target || !scope.contains(target)) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: behavior(),
            block: "start"
          });
        });
      }
    );


    /* ================= SCROLL STATE ================= */

    var links = $$(".nav-links a", nav);

    var targets = menu.map(function (item) {
      return d.getElementById(item[1]);
    });

    var navAt = 500;
    var ticking = false;
    var active = -2;

    function measure() {
      var hero = $(".hero-wrap");

      if (hero) {
        navAt = hero.offsetHeight * 0.8;
      }
    }

    function update() {
      ticking = false;

      var y = win.pageYOffset || root.scrollTop;
      var max = root.scrollHeight - win.innerHeight;

      progress.style.setProperty(
        "--prog",
        max > 0
          ? Math.min(y / max, 1).toFixed(4)
          : "0"
      );

      nav.classList.toggle("on", y > navAt);
      toTop.classList.toggle("on", y > 700);

      /*
       * Highlight the last section whose top has passed
       * 40% of the viewport height.
       */
      var index = -1;
      var line = win.innerHeight * 0.4;

      for (var i = 0; i < targets.length; i++) {
        if (
          targets[i] &&
          targets[i].getBoundingClientRect().top <= line
        ) {
          index = i;
        }
      }

      if (index !== active) {
        active = index;

        links.forEach(function (link, linkIndex) {
          if (linkIndex === index) {
            link.setAttribute("aria-current", "true");

            var box = link.parentNode;

            if (box.scrollWidth > box.clientWidth) {
              box.scrollLeft =
                link.offsetLeft -
                box.clientWidth / 2 +
                link.offsetWidth / 2;
            }
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    }

    function onScroll() {
      if (ticking) {
        return;
      }

      ticking = true;
      win.requestAnimationFrame(update);
    }


    /* ================= EVENT LISTENERS ================= */

    win.addEventListener("scroll", onScroll, {
      passive: true
    });

    win.addEventListener("resize", function () {
      measure();
      onScroll();
    });

    win.addEventListener("load", function () {
      measure();
      onScroll();
    });

    measure();
    update();
  }


  /* ================= START WHEN DOCUMENT IS READY ================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initGydSupportServices,
      {
        once: true
      }
    );
  } else {
    initGydSupportServices();
  }
})();
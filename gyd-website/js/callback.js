/* =====================================================
   GET YOUR DOCTORATE — CALLBACK FORM

   Uses existing markup:
   #gyd-front-dialog
   #gyd-front-form
   #gyd-front-submit
   #gyd-front-message
   #gyd-front-close

   WordPress AJAX actions:
   gydcb_nonce
   gydcb_submit
   ===================================================== */

(function () {
  "use strict";

  function initCallback() {
    if (window.gydFrontendCallbackReady) {
      return;
    }

    const dialog = document.getElementById("gyd-front-dialog");
    const form = document.getElementById("gyd-front-form");

    if (!dialog || !form) {
      return;
    }

    const phone = form.elements.phone;
    const country = form.elements.country_code;
    const consent = form.elements.consent;

    const submit = document.getElementById("gyd-front-submit");
    const message = document.getElementById("gyd-front-message");
    const close = document.getElementById("gyd-front-close");

    /* Stop safely if required form elements are missing. */
    if (
      !phone ||
      !country ||
      !consent ||
      !submit ||
      !message ||
      !close
    ) {
      return;
    }

    window.gydFrontendCallbackReady = true;

    /* Original WordPress endpoint. */
    const endpoint =
      "https://getyourdoctorate.org/wp-admin/admin-ajax.php";

    let nonce = "";
    let busy = false;
    let previousFocus = null;
    let previousOverflow = "";
    let openingRequest = 0;


    /* ================= CREATE CALLBACK BUTTON ================= */

    const trigger = document.createElement("button");

    trigger.id = "gyd-front-callback";
    trigger.type = "button";
    trigger.title = "Request a call back";

    trigger.setAttribute("aria-label", "Request a call back");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "gyd-front-dialog");

    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2
          A19.8 19.8 0 0 1 3.1 5.2
          A2 2 0 0 1 5.1 3h3
          a2 2 0 0 1 2 1.7
          c.1 1 .4 1.9.7 2.7
          a2 2 0 0 1-.5 2.1L9 10.8
          a16 16 0 0 0 4.2 4.2l1.3-1.3
          a2 2 0 0 1 2.1-.5
          c.8.3 1.7.6 2.7.7
          a2 2 0 0 1 2.7 3z"/>
        <path d="M15 3h6v6m0-6-6 6"/>
      </svg>
    `;


    /* ================= POSITION BELOW WHATSAPP ================= */

    function placeButton() {
      const candidates = [
        ...document.querySelectorAll(".x-fab .x-fab__wa")
      ];

      const whatsapp = candidates.find(function (element) {
        const style = getComputedStyle(element);

        return (
          element.getClientRects().length > 0 &&
          style.visibility !== "hidden" &&
          style.display !== "none"
        );
      });

      if (whatsapp && whatsapp.nextElementSibling !== trigger) {
        whatsapp.after(trigger);
      }
    }

    placeButton();

    /*
     * Also handles a WhatsApp button added later
     * by the home-page enhancement script.
     */
    const observer = new MutationObserver(placeButton);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("resize", placeButton);


    /* ================= PHONE VALIDATION ================= */

    function validPhone() {
      const value = phone.value.trim();

      if (country.value === "+91") {
        return /^[6-9][0-9]{9}$/.test(value);
      }

      return (
        /^[0-9]{6,14}$/.test(value) &&
        country.value.replace("+", "").length + value.length <= 15
      );
    }


    /* ================= SUBMIT BUTTON STATE ================= */

    function updateButton() {
      submit.disabled =
        busy ||
        !nonce ||
        !validPhone() ||
        !consent.checked;
    }

    form.addEventListener("input", updateButton);
    country.addEventListener("change", updateButton);


    /* ================= AJAX HELPER ================= */

    async function post(body) {
      const response = await fetch(endpoint, {
        method: "POST",
        body: body,
        credentials: "same-origin",
        cache: "no-store"
      });

      let result;

      try {
        result = await response.json();
      } catch (error) {
        throw new Error(
          "Server response invalid. Check that the callback plugin is active."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.data?.message ||
          "Unable to process the request. Please try again."
        );
      }

      return result.data;
    }


    /* ================= OPEN DIALOG AND FETCH NONCE ================= */

    trigger.addEventListener("click", async function () {
      if (dialog.open) {
        return;
      }

      previousFocus = document.activeElement;
      previousOverflow =
        document.documentElement.style.overflow;

      const requestId = ++openingRequest;

      nonce = "";
      message.textContent = "Loading secure form…";
      updateButton();

      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      phone.focus();

      try {
        const body = new URLSearchParams({
          action: "gydcb_nonce"
        });

        const data = await post(body);

        if (requestId !== openingRequest || !dialog.open) {
          return;
        }

        nonce = data.nonce;
        message.textContent = "";
      } catch (error) {
        if (requestId === openingRequest && dialog.open) {
          message.textContent = error.message;
        }
      }

      updateButton();
    });


    /* ================= CLOSE BUTTON ================= */

    close.addEventListener("click", function () {
      dialog.close();
    });


    /* ================= CLOSE ON BACKDROP CLICK ================= */

    dialog.addEventListener("click", function (event) {
      const rect = dialog.getBoundingClientRect();

      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (event.target === dialog && outside) {
        dialog.close();
      }
    });


    /* ================= RESTORE SCROLL AND FOCUS ================= */

    dialog.addEventListener("close", function () {
      openingRequest++;

      document.documentElement.style.overflow =
        previousOverflow;

      if (previousFocus) {
        previousFocus.focus();
      }
    });


    /* ================= SUBMIT CALLBACK REQUEST ================= */

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (
        busy ||
        !nonce ||
        !validPhone() ||
        !consent.checked
      ) {
        return;
      }

      busy = true;
      updateButton();

      submit.textContent = "Submitting…";
      message.textContent = "";

      const body = new FormData(form);

      body.set("phone", phone.value.trim());
      body.set("action", "gydcb_submit");
      body.set("nonce", nonce);

      body.set(
        "source_url",
        location.origin + location.pathname
      );

      try {
        const data = await post(body);

        form.reset();
        message.textContent = data.message;
      } catch (error) {
        message.textContent = error.message;
      } finally {
        busy = false;
        submit.textContent = "Request a call back";
        updateButton();
      }
    });

    /* Start with submission disabled until requirements are met. */
    updateButton();
  }


  /* ================= START WHEN DOCUMENT IS READY ================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initCallback,
      {
        once: true
      }
    );
  } else {
    initCallback();
  }
})();
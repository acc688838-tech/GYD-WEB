/* =====================================================
   GET YOUR DOCTORATE — HOME PAGE JAVASCRIPT

   Includes:
   1. Image placeholder helper
   2. Scroll reveal
   3. Count-up numbers
   4. Reading-progress bar
   5. Sticky section menu with scroll-spy
   6. Floating WhatsApp and back-to-top buttons

   The callback form is in js/callback.js.
   ===================================================== */


/* ---------------------------------------------------------------
   Marks any <img> that has not been mapped yet, so the layout still
   reads as a placeholder. Once the real files exist this does nothing.
   Set SHOW_LABELS to false to hide the file-name hints.
   --------------------------------------------------------------- */

(function () {
  var SHOW_LABELS = true;

  document.querySelectorAll('[data-ph]').forEach(function (box) {
    var img = box.querySelector('img');
    if (!img) return;

    function missing() {
      box.classList.add('img-missing');
      if (SHOW_LABELS) box.setAttribute('data-label', box.getAttribute('data-ph'));
    }

    img.addEventListener('error', missing);
    if (img.complete && img.naturalWidth === 0) missing();
  });
})();


/* =====================================================================
   ENHANCEMENTS — behaviour layer (pairs with home.css)
   Progressive: if this file fails or is removed, the page still shows
   everything. No markup is edited; everything is added from here.
   ===================================================================== */

(function () {
  'use strict';

  var d = document, root = d.documentElement, win = window;
  var reduce = !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in win;

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function behavior() { return reduce ? 'auto' : 'smooth'; }

  /* ---------- 0 · anchor ids the original markup doesn't have ---------- */
  var support = $('section.support');
  if (support && !support.id) support.id = 'research-support';
  $$('.p2__bar').forEach(function (bar) {
    if (!bar.id && /12-STEP/i.test(bar.textContent)) bar.id = 'journey';
  });

  /* ---------- 1 · scroll reveal ---------- */
  if (hasIO && !reduce) {
    root.classList.add('x-anim');

    var groups = [
      ['.banner-arrow', 'rv rv--left'],
      ['.band', 'rv rv--left'],
      ['.p2__bar', 'rv'],
      ['.support__item', 'rv'],
      ['.support__girl', 'rv rv--zoom'],
      ['.step', 'rv'],
      ['.n-intro__main', 'rv'],
      ['.n-stat', 'rv rv--zoom'],
      ['.n-quote', 'rv'],
      ['.n-rating__card', 'rv'],
      ['.n-card', 'rv'],
      ['.n-feature', 'rv'],
      ['.n-panel', 'rv'],
      ['.n-why__grid > div', 'rv'],
      ['.n-check li', 'rv'],
      ['.n-acc__item', 'rv'],
      ['.n-cta__body', 'rv'],
      ['.footer__col', 'rv']
    ];

    var picked = [];
    groups.forEach(function (g) {
      $$(g[0]).forEach(function (el) {
        if (picked.indexOf(el) === -1) { el._xv = g[1]; picked.push(el); }
      });
    });

    // stagger siblings: 0, 90, 180 ... (capped) so rows of cards cascade in
    picked.forEach(function (el) {
      var p = el.parentNode;
      p._xn = p._xn || 0;
      el.style.setProperty('--d', Math.min(p._xn++, 6) * 90 + 'ms');
      el.className += ' ' + el._xv;
    });

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        revealIO.unobserve(el);
        el.classList.add('in');
        // drop the helper classes afterwards so normal :hover transforms work again
        setTimeout(function () {
          el.classList.remove('rv', 'rv--left', 'rv--zoom', 'in');
          el.style.removeProperty('--d');
        }, 1700);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    picked.forEach(function (el) { revealIO.observe(el); });

    // one-shot "drawn / filled" states: timeline lines, rating stars
    var oneShot = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('x-in');
        oneShot.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    $$('.t-row, .n-stars').forEach(function (el) { oneShot.observe(el); });

    /* ---------- 2 · count-up numbers ---------- */
    var counted = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        counted.unobserve(e.target);
        countUp(e.target);
      });
    }, { threshold: 0.6 });
    $$('.n-stat__num, .n-rating__num, .n-rating__count').forEach(function (el) { counted.observe(el); });
  }

  function countUp(el) {
    var node = null, i;
    for (i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3 && /\d/.test(el.childNodes[i].nodeValue)) { node = el.childNodes[i]; break; }
    }
    if (!node) return;
    var text = node.nodeValue, m = text.match(/\d+(?:\.\d+)?/);
    if (!m) return;
    var target = parseFloat(m[0]);
    var decimals = (m[0].split('.')[1] || '').length;
    var pre = text.slice(0, m.index), post = text.slice(m.index + m[0].length);
    var start = null, dur = 1500;
    node.nodeValue = pre + (0).toFixed(decimals) + post;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.nodeValue = pre + (target * eased).toFixed(decimals) + post;
      if (p < 1) win.requestAnimationFrame(tick);
    }
    win.requestAnimationFrame(tick);
  }

  /* ---------- 3 · progress bar, sticky menu, floating buttons ---------- */
  var ICON_CAP = '<svg class="x-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
  var ICON_CHAT = '<svg class="x-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var ICON_UP = '<svg class="x-ico" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';

  var progress = d.createElement('div');
  progress.className = 'x-progress';
  progress.setAttribute('aria-hidden', 'true');
  d.body.appendChild(progress);

  var menu = [
    ['Support', '#research-support'],
    ['Journey', '#journey'],
    ['About', '#about'],
    ['Services', '#services'],
    ['Why Us', '#why-choose-us'],
    ['Terms', '#terms'],
    ['Refund', '#refund-policy']
  ].filter(function (item) { return $(item[1]); });

  var nav = d.createElement('nav');
  nav.className = 'x-nav';
  nav.setAttribute('aria-label', 'Page sections');
  var html = '<div class="wrap x-nav__in">' +
    '<a class="x-nav__brand" href="#" data-x-top>' + ICON_CAP + '<span>GET YOUR DOCTORATE</span></a>' +
    '<div class="x-nav__links">';
  menu.forEach(function (item) { html += '<a href="' + item[1] + '">' + item[0] + '</a>'; });
  html += '</div>';
  if ($('#support')) html += '<a class="x-nav__cta" href="#support">Contact</a>';
  html += '</div>';
  nav.innerHTML = html;
  d.body.appendChild(nav);

  var fab = d.createElement('div');
  fab.className = 'x-fab';
  var wa = $('.n-btn--wa');
  var fabHtml = '';
  if (wa && wa.getAttribute('href')) {
    fabHtml += '<a class="x-fab__wa" href="' + wa.getAttribute('href') + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + ICON_CHAT + '</a>';
  }
  fabHtml += '<button class="x-fab__top" type="button" aria-label="Back to top">' + ICON_UP + '</button>';
  fab.innerHTML = fabHtml;
  d.body.appendChild(fab);
  var toTop = $('.x-fab__top', fab);

  function scrollTop() { win.scrollTo({ top: 0, behavior: behavior() }); }
  toTop.addEventListener('click', scrollTop);
  $('[data-x-top]', nav).addEventListener('click', function (ev) { ev.preventDefault(); scrollTop(); });

  var navLinks = $$('.x-nav__links a', nav);
  var spyTargets = menu.map(function (item) { return $(item[1]); });
  var navAt = 500, ticking = false, activeIdx = -2;

  function measure() {
    var hero = $('.hero');
    if (hero) {
      var r = hero.getBoundingClientRect();
      navAt = r.top + (win.pageYOffset || root.scrollTop) + r.height * 0.8;
    }
  }

  function update() {
    ticking = false;
    var y = win.pageYOffset || root.scrollTop;
    var max = root.scrollHeight - win.innerHeight;
    progress.style.setProperty('--x-prog', max > 0 ? Math.min(y / max, 1).toFixed(4) : '0');
    nav.classList.toggle('is-on', y > navAt);
    toTop.classList.toggle('is-on', y > 700);

    // scroll-spy: the last section whose top has passed ~40% of the viewport
    var idx = -1, line = win.innerHeight * 0.4;
    for (var i = 0; i < spyTargets.length; i++) {
      if (spyTargets[i].getBoundingClientRect().top <= line) idx = i;
    }
    if (idx !== activeIdx) {
      activeIdx = idx;
      navLinks.forEach(function (a, n) {
        if (n === idx) {
          a.setAttribute('aria-current', 'true');
          // keep the active link visible in the scrollable menu on small screens
          var box = a.parentNode;
          if (box.scrollWidth > box.clientWidth) box.scrollLeft = a.offsetLeft - box.clientWidth / 2 + a.offsetWidth / 2;
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(update);
  }

  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', function () { measure(); onScroll(); });
  win.addEventListener('load', function () { measure(); onScroll(); });
  measure();
  update();
})();
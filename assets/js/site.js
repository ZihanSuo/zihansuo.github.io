/* Zihan Suo — site behaviour. No external dependencies (CDN-free by design). */
(function () {
  'use strict';
  var root = document.documentElement;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- language toggle ---- */
  var langBtn = document.getElementById('lang-btn');
  function paintLang() {
    var cur = root.getAttribute('data-active-lang') || 'en';
    if (langBtn) langBtn.textContent = (cur === 'en') ? '中文' : 'EN';
    root.setAttribute('lang', cur === 'zh' ? 'zh-CN' : 'en');
  }
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = (root.getAttribute('data-active-lang') === 'en') ? 'zh' : 'en';
      root.setAttribute('data-active-lang', next);
      store('lang', next);
      paintLang();
    });
  }
  paintLang();

  /* ---- theme toggle ---- */
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var explicit = root.getAttribute('data-theme');
      var dark = explicit
        ? explicit === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
    });
  }

  /* ---- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function sizeNav() {
    if (!nav) return;
    if (window.innerWidth <= 820) {
      nav.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    } else {
      nav.hidden = false;
    }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.hidden;
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  sizeNav();
  window.addEventListener('resize', sizeNav);

  /* ---- reveal on scroll ---- */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  Array.prototype.forEach.call(items, function (el) { io.observe(el); });
})();

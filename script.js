(function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  var initialTheme = getStoredTheme() ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      /* localStorage unavailable (private mode); theme still applies for this visit */
    }
  });

  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    mobileMenu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  }

  menuToggle.addEventListener('click', function () {
    if (mobileMenu.hidden) openMenu(); else closeMenu();
  });

  mobileMenu.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !mobileMenu.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxClose = document.getElementById('lightbox-close');
  var lastTrigger = null;

  document.querySelectorAll('.shot').forEach(function (button) {
    button.addEventListener('click', function () {
      var img = button.querySelector('img');
      lightboxImage.src = button.getAttribute('data-full');
      lightboxImage.alt = img.getAttribute('alt');
      lastTrigger = button;
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener('click', function () {
    lightbox.close();
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('close', function () {
    if (lastTrigger) lastTrigger.focus();
  });

  var navLinks = document.querySelectorAll('.site-nav a, .mobile-menu a');
  var sections = document.querySelectorAll('main .section[id]');

  function setActiveSection(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
  }

  if (sections.length) {
    var sectionList = Array.prototype.slice.call(sections);
    var lastSectionId = sectionList[sectionList.length - 1].id;

    function updateActiveSection() {
      var triggerLine = window.scrollY + window.innerHeight * 0.35;
      var current = sectionList[0].id;
      sectionList.forEach(function (section) {
        if (triggerLine >= section.offsetTop) current = section.id;
      });
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = lastSectionId;
      setActiveSection(current);
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();
  }

  var backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = ' · ' + new Date().getFullYear();
})();

// ==========================================================================
// Omnacare — main.js (vanilla JS, no dependencies)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Scroll-to-top button ---- */
  var scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', function () {
      scrollTop.classList.toggle('is-active', window.scrollY > 400);
    });
    scrollTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Contact form validation ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusBox = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      var required = form.querySelectorAll('[required]');
      var missing = [];

      required.forEach(function (field) {
        if (!field.value.trim()) {
          missing.push(field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : field.name);
          field.style.borderColor = '#b3261e';
        } else {
          field.style.borderColor = '';
        }
      });

      var emailField = form.querySelector('input[type="email"]');
      var emailValid = emailField ? /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(emailField.value.trim()) : true;
      if (emailField && !emailValid) {
        missing.push('a valid E-mail address');
        emailField.style.borderColor = '#b3261e';
      }

      if (missing.length) {
        e.preventDefault();
        statusBox.textContent = 'Please check the following: ' + missing.join(', ') + '.';
        statusBox.className = 'form-status is-visible form-status--error';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // If validation passes, the form submits normally to whatever
      // endpoint is set in the form's action attribute (see comment in HTML).
    });
  }

});

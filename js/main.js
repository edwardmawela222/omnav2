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

  /* ---- Hide header on scroll down, show on scroll up ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastScrollY = window.scrollY;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // scrolling down, and past the top buffer
            header.classList.add('is-hidden');
            navLinks && navLinks.classList.remove('is-open');
          } else {
            // scrolling up
            header.classList.remove('is-hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
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
        return;
      }

      // No form endpoint configured (static hosting can't accept POSTs):
      // open the visitor's email app with the message pre-filled instead.
      var mailto = form.getAttribute('data-mailto');
      if (!form.getAttribute('action') && mailto) {
        e.preventDefault();
        var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
        var body = 'Name: ' + val('full-name') +
          '\nE-mail: ' + val('email') +
          '\nContact Number: ' + val('phone') +
          '\n\n' + val('message');
        window.location.href = 'mailto:' + mailto +
          '?subject=' + encodeURIComponent(val('subject')) +
          '&body=' + encodeURIComponent(body);
        statusBox.textContent = 'Your email app should now open with your message ready to send. If it doesn\'t, please email us at ' + mailto + ' or WhatsApp 076 034 4131.';
        statusBox.className = 'form-status is-visible form-status--success';
      }
      // Otherwise the form submits normally to whatever endpoint is set
      // in the form's action attribute (see comment in HTML).
    });
  }

});

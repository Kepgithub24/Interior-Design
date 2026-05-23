/* =============================================
   LUMIÈRE — Luxury Interior Design
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================
     NAVBAR — SCROLL BEHAVIOUR
     ===================== */
  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    backToTop.classList.toggle('visible', y > 320);
  }, { passive: true });

  /* =====================
     HAMBURGER MENU
     ===================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* =====================
     DARK / LIGHT MODE
     ===================== */
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;
  const saved       = localStorage.getItem('lumiere-theme') || 'light';
  html.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lumiere-theme', next);
  });

  /* =====================
     SMOOTH SCROLL
     ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe
    ? (() => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              navItems.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
              });
            }
          });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => obs.observe(s));
      })()
    : null;

  /* =====================
     FADE-IN ON SCROLL
     ===================== */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* =====================
     STATS COUNTER
     ===================== */
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const dur    = 1500; // ms
      const step   = 16;   // ~60fps
      const inc    = target / (dur / step);
      let current  = 0;

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current);
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, step);

      statsObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

  /* =====================
     PORTFOLIO FILTER
     ===================== */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* =====================
     LIGHTBOX
     ===================== */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose  = document.getElementById('lightboxClose');

  const openLightbox = (src, alt, caption) => {
    lightboxImg.src         = src;
    lightboxImg.alt         = alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  portfolioItems.forEach(item => {
    const open = () => {
      const img     = item.querySelector('img');
      const title   = item.querySelector('.portfolio-overlay h3')?.textContent || '';
      const bigSrc  = img.src.replace('w=600', 'w=1200');
      openLightbox(bigSrc, img.alt, title);
    };

    item.addEventListener('click', open);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  /* =====================
     TESTIMONIAL CAROUSEL
     ===================== */
  const cards   = document.querySelectorAll('.testimonial-card');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current   = 0;
  let autoplay;

  const goTo = index => {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].removeAttribute('aria-current');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
  };

  const startAutoplay = () => {
    autoplay = setInterval(() => goTo(current + 1), 5500);
  };

  const resetAutoplay = () => {
    clearInterval(autoplay);
    startAutoplay();
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.getAttribute('data-index'), 10));
      resetAutoplay();
    });
  });

  const carouselWrapper = document.getElementById('carouselWrapper');
  carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
  carouselWrapper.addEventListener('mouseleave', startAutoplay);

  startAutoplay();

  /* =====================
     BACK TO TOP
     ===================== */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =====================
     CONTACT FORM
     ===================== */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  const toast     = document.getElementById('toast');

  let toastTimer;

  const showToast = (msg, type = 'success') => {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className   = `toast ${type} show`;
    toastTimer = setTimeout(() => { toast.className = 'toast'; }, 5000);
  };

  const setLoading = isLoading => {
    btnText.style.display   = isLoading ? 'none'         : 'inline';
    btnLoader.style.display = isLoading ? 'inline-flex'  : 'none';
    submitBtn.disabled      = isLoading;
    submitBtn.setAttribute('aria-busy', isLoading);
  };

  /* Field validation */
  const rules = {
    name:    { el: null, errId: 'nameError',    test: v => v.trim().length >= 2,         msg: 'Please enter your full name.' },
    email:   { el: null, errId: 'emailError',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
    phone:   { el: null, errId: 'phoneError',   test: v => v.replace(/\D/g, '').length >= 7,             msg: 'Please enter a valid phone number.' },
    message: { el: null, errId: 'messageError', test: v => v.trim().length >= 10,        msg: 'Please enter a message (min. 10 characters).' },
  };

  Object.keys(rules).forEach(key => {
    rules[key].el = document.getElementById(key);
  });

  const clearError = key => {
    rules[key].el.classList.remove('error');
    document.getElementById(rules[key].errId).textContent = '';
  };

  const setError = (key, msg) => {
    rules[key].el.classList.add('error');
    document.getElementById(rules[key].errId).textContent = msg;
  };

  /* Live validation on blur */
  Object.keys(rules).forEach(key => {
    rules[key].el.addEventListener('blur', () => {
      const r = rules[key];
      r.test(r.el.value) ? clearError(key) : setError(key, r.msg);
    });

    rules[key].el.addEventListener('input', () => {
      if (rules[key].el.classList.contains('error')) {
        const r = rules[key];
        if (r.test(r.el.value)) clearError(key);
      }
    });
  });

  const validateAll = () => {
    let valid = true;
    Object.keys(rules).forEach(key => {
      const r = rules[key];
      if (r.test(r.el.value)) {
        clearError(key);
      } else {
        setError(key, r.msg);
        valid = false;
      }
    });
    return valid;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) {
      /* Focus first invalid field */
      const first = Object.values(rules).find(r => r.el.classList.contains('error'));
      if (first) first.el.focus();
      return;
    }

    setLoading(true);

    const payload = {
      name:      rules.name.el.value.trim(),
      email:     rules.email.el.value.trim(),
      phone:     rules.phone.el.value.trim(),
      message:   rules.message.el.value.trim(),
      _captcha:  'false',
      _template: 'table',
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/bwongzh@gmail.com', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        showToast('✓ Enquiry sent! We\'ll be in touch within 24 hours.', 'success');
        form.reset();
        Object.keys(rules).forEach(k => clearError(k));
      } else {
        throw new Error('FormSubmit returned unsuccessful');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showToast('Something went wrong. Please try again or email us directly.', 'error');
    } finally {
      setLoading(false);
    }
  });

});

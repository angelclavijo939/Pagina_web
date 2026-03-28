/* ============================================
   NEXUS TECH - MAIN JAVASCRIPT
   ============================================ */

// ── PRELOADER ───────────────────────────────
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('hide')) {
    preloader.classList.add('hide');
    setTimeout(() => preloader.remove(), 500);
  }
}
setTimeout(hidePreloader, 2000);
window.addEventListener('load', () => setTimeout(hidePreloader, 300));

document.addEventListener('DOMContentLoaded', function() {

// ── HEADER SCROLL ───────────────────────────
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── HAMBURGER MENU ──────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── SCROLL REVEAL ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── HERO PARTICLES ──────────────────────────
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${Math.random() * 4 + 4}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ── LIKE BUTTON TOGGLE ──────────────────────
document.querySelectorAll('.blog-likes').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('liked');
    const count = btn.querySelector('.like-count');
    if (count) {
      const n = parseInt(count.textContent);
      count.textContent = btn.classList.contains('liked') ? n + 1 : n - 1;
    }
  });
});

// ── SMOOTH SCROLL NAV ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── ACTIVE NAV LINK ─────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  sections.forEach(sec => {
    const sTop = sec.offsetTop - 100;
    const sHeight = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
    if (link) {
      if (scrollY > sTop && scrollY <= sTop + sHeight) {
        link.style.color = 'var(--accent-cyan)';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ── ANIMATED COUNTER ────────────────────────
function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── ATOM PARALLAX ───────────────────────────
window.addEventListener('scroll', () => {
  const atom = document.querySelector('.atom-bg');
  if (atom) {
    const scrolled = window.pageYOffset;
    atom.style.transform = `translateY(calc(-50% + ${scrolled * 0.05}px)) rotate(${scrolled * 0.02}deg)`;
  }
});

// ── CONTACT FORM VALIDATION ─────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // Clear errors
    contactForm.querySelectorAll('.form-msg').forEach(m => m.classList.remove('show'));
    contactForm.querySelectorAll('input, textarea').forEach(f => f.classList.remove('error'));

    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const correo = document.getElementById('correo');
    const telefono = document.getElementById('telefono');
    const mensaje = document.getElementById('mensaje');

    // Names uppercase
    if (nombres && nombres.value.trim() === '') {
      showError(nombres, 'El nombre es requerido');
      valid = false;
    } else if (nombres) {
      nombres.value = nombres.value.toUpperCase();
    }

    if (apellidos && apellidos.value.trim() === '') {
      showError(apellidos, 'Los apellidos son requeridos');
      valid = false;
    } else if (apellidos) {
      apellidos.value = apellidos.value.toUpperCase();
    }

    // Email
    if (correo && (!correo.value.includes('@') || correo.value.trim() === '')) {
      showError(correo, 'El correo debe contener @');
      valid = false;
    }

    // Phone
    if (telefono && telefono.value.trim() === '') {
      showError(telefono, 'El teléfono es requerido');
      valid = false;
    } else if (telefono && !/^[\d\s\+\-\(\)]{7,15}$/.test(telefono.value)) {
      showError(telefono, 'Teléfono inválido');
      valid = false;
    }

    if (mensaje && mensaje.value.trim() === '') {
      showError(mensaje, 'El mensaje es requerido');
      valid = false;
    }

    if (!valid) return;

    // Submit
    const btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const formData = {
      nombres: nombres.value,
      apellidos: apellidos.value,
      correo: correo.value,
      telefono: telefono.value,
      mensaje: mensaje.value
    };

    try {
      const res = await fetch('/api/save_contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        // Limpiar formulario
        contactForm.reset();
        // Mostrar mensaje de éxito
        const successEl = document.getElementById('formSuccess');
        if (successEl) {
          successEl.style.display = 'block';
          successEl.style.color = 'var(--accent-cyan)';
          successEl.style.padding = '20px';
          successEl.style.textAlign = 'center';
          successEl.style.fontSize = '1.1rem';
          successEl.textContent = '✅ ¡Mensaje enviado con éxito! Te contactaremos pronto.';
        }
        contactForm.style.display = 'none';
      } else if (data.error === 'duplicate') {
        showError(telefono, 'Este teléfono ya está registrado');
        btn.textContent = 'Enviar Mensaje';
        btn.disabled = false;
      } else {
        btn.textContent = 'Enviar Mensaje';
        btn.disabled = false;
        // Mostrar error visible
        const successEl = document.getElementById('formSuccess');
        if (successEl) {
          successEl.style.display = 'block';
          successEl.style.color = '#ff4d6d';
          successEl.style.padding = '20px';
          successEl.style.textAlign = 'center';
          successEl.textContent = '❌ Error al enviar. Por favor intenta de nuevo.';
        }
      }
    } catch (err) {
      console.error(err);
      btn.textContent = 'Enviar Mensaje';
      btn.disabled = false;
    }
  });

  // Auto uppercase on input
  ['nombres', 'apellidos'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const pos = el.selectionStart;
        el.value = el.value.toUpperCase();
        el.setSelectionRange(pos, pos);
      });
    }
  });
}

function showError(field, msg) {
  field.classList.add('error');
  const errEl = field.parentElement.querySelector('.form-msg');
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.add('show');
  }
}

// ── NEWSLETTER FORM ─────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input && input.value.includes('@')) {
      input.value = '';
      const btn = newsletterForm.querySelector('button');
      btn.textContent = '✓';
      setTimeout(() => btn.textContent = '→', 2000);
    }
  });
}

// ── TYPED TEXT EFFECT ───────────────────────
function typeEffect(el, texts, speed = 80) {
  if (!el) return;
  let i = 0, j = 0, deleting = false;
  setInterval(() => {
    const current = texts[i];
    el.textContent = deleting ? current.substring(0, j--) : current.substring(0, j++);
    if (!deleting && j === current.length + 1) {
      deleting = true;
      setTimeout(() => {}, 1500);
    }
    if (deleting && j === 0) {
      deleting = false;
      i = (i + 1) % texts.length;
    }
  }, speed);
}

}); // END DOMContentLoaded

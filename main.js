/* ============================================================
   NEXUS TECH — main.js
   ============================================================ */

/* ── PRELOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    setTimeout(() => pre.classList.add('hide'), 800);
    setTimeout(() => pre.remove(), 1400);
  }
});

/* ── HEADER SCROLL ──────────────────────────────────────────── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── HAMBURGER MENU ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un enlace
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── PARTÍCULAS HERO ────────────────────────────────────────── */
const particleContainer = document.getElementById('heroParticles');
if (particleContainer) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-delay:${Math.random() * 6}s;
      animation-duration:${Math.random() * 4 + 4}s;
    `;
    particleContainer.appendChild(p);
  }
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── BLOG LIKES ─────────────────────────────────────────────── */
function toggleLike(el) {
  const countEl = el.querySelector('.like-count');
  const isLiked = el.classList.toggle('liked');
  const count   = parseInt(countEl.textContent, 10);
  countEl.textContent = isLiked ? count + 1 : count - 1;
  el.querySelector('span').textContent = isLiked ? '♥' : '♡';
}

/* ── NEWSLETTER ─────────────────────────────────────────────── */
function subscribeNewsletter(btn) {
  const input = btn.previousElementSibling;
  const val   = input.value.trim();
  if (!val || !val.includes('@')) {
    input.style.borderColor = '#ff4d6d';
    setTimeout(() => input.style.borderColor = '', 2000);
    return;
  }
  btn.textContent = '✓';
  btn.style.background = '#25d366';
  input.value = '';
  input.placeholder = '¡Suscrito!';
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
const btnSubmit = document.getElementById('btnSubmit');
if (btnSubmit) {
  btnSubmit.addEventListener('click', submitContactForm);
}

function showMsg(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function markError(id, hasError) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('error', hasError);
}

function submitContactForm() {
  const nombres   = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const correo    = document.getElementById('correo');
  const telefono  = document.getElementById('telefono');
  const mensaje   = document.getElementById('mensaje');

  let valid = true;

  // Nombres — solo letras, convertir a mayúsculas
  const nombresVal = nombres.value.trim().toUpperCase();
  nombres.value = nombresVal;
  const nombresOk = /^[A-ZÁÉÍÓÚÑÜA-Z\s]{2,}$/i.test(nombresVal);
  markError('nombres', !nombresOk);
  showMsg('msg-nombres', !nombresOk);
  if (!nombresOk) valid = false;

  // Apellidos — solo letras, convertir a mayúsculas
  const apellidosVal = apellidos.value.trim().toUpperCase();
  apellidos.value = apellidosVal;
  const apellidosOk = /^[A-ZÁÉÍÓÚÑÜA-Z\s]{2,}$/i.test(apellidosVal);
  markError('apellidos', !apellidosOk);
  showMsg('msg-apellidos', !apellidosOk);
  if (!apellidosOk) valid = false;

  // Correo — debe contener @
  const correoVal = correo.value.trim();
  const correoOk  = correoVal.includes('@') && correoVal.length > 5;
  markError('correo', !correoOk);
  showMsg('msg-correo', !correoOk);
  if (!correoOk) valid = false;

  // Teléfono — numérico requerido
  const telefonoVal = telefono.value.trim();
  const telefonoOk  = /^\d{7,15}$/.test(telefonoVal);
  markError('telefono', !telefonoOk);
  showMsg('msg-telefono', !telefonoOk);
  if (!telefonoOk) valid = false;

  // Mensaje
  const mensajeVal = mensaje.value.trim();
  const mensajeOk  = mensajeVal.length >= 10;
  markError('mensaje', !mensajeOk);
  showMsg('msg-mensaje', !mensajeOk);
  if (!mensajeOk) valid = false;

  if (!valid) return;

  // Enviar vía AJAX al PHP
  btnSubmit.disabled  = true;
  btnSubmit.textContent = 'Enviando...';

  const formData = new FormData();
  formData.append('nombres',   nombresVal);
  formData.append('apellidos', apellidosVal);
  formData.append('correo',    correoVal);
  formData.append('telefono',  telefonoVal);
  formData.append('mensaje',   mensajeVal);

  fetch('contacto.php', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById('contactFormWrap').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        const errMsg = data.error || 'Error al enviar. Inténtalo de nuevo.';
        alert(errMsg);
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Enviar Mensaje →';
      }
    })
    .catch(() => {
      alert('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Enviar Mensaje →';
    });
}

/* ── AUTO UPPERCASE EN INPUTS ───────────────────────────────── */
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

/* ── SMOOTH SCROLL para anclas ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   DIK BEAUTY SALON — JavaScript
   Handles: Particles, Navbar, Tabs, Scroll Reveal, Form
   ============================================================ */

// ============================================================
// 1. PARTICLE BACKGROUND
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:   -(Math.random() * 0.5 + 0.1),
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#e91e8c' : '#c9a84c',
      life:  Math.random() * 200 + 100,
      age:   0,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 100; i++) {
      const p = createParticle();
      p.y = Math.random() * H; // scatter initially
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.age++;

      const ratio = p.age / p.life;
      const a = ratio < 0.2 ? ratio / 0.2 : ratio > 0.8 ? (1 - ratio) / 0.2 : 1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(a * p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      if (p.age >= p.life || p.y < -10) {
        particles[i] = createParticle();
        particles[i].y = H + 5;
      }
    });
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();


// ============================================================
// 2. NAVBAR — scroll & mobile toggle
// ============================================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav highlight based on scroll
const sections = ['home', 'services', 'gallery', 'about', 'contact'];

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (!el || !link) return;
    if (el.offsetTop <= scrollY && el.offsetTop + el.offsetHeight > scrollY) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// Smooth anchor scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ============================================================
// 3. SERVICE TABS
// ============================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-content-${target}`).classList.add('active');
  });
});


// ============================================================
// 4. SCROLL REVEAL ANIMATIONS
// ============================================================
function initReveal() {
  const revealEls = [
    '.section-header',
    '.service-card',
    '.gallery-item',
    '.contact-card',
    '.pillar',
    '.about-img-frame',
    '.about-content-col',
    '.contact-form-col',
  ];

  const allReveal = [];
  revealEls.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
      allReveal.push(el);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  allReveal.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);


// ============================================================
// 5. GALLERY LIGHTBOX (simple)
// ============================================================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    const caption = item.querySelector('.gallery-overlay span').textContent;
    openLightbox(src, caption);
  });
});

function openLightbox(src, caption) {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px;cursor:pointer;animation:lbFadeIn 0.3s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes lbFadeIn{from{opacity:0}to{opacity:1}}`;
  overlay.appendChild(style);

  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = `
    max-width:90vw;max-height:80vh;object-fit:contain;
    border-radius:16px;border:1px solid rgba(233,30,140,0.4);
    box-shadow:0 0 60px rgba(233,30,140,0.3);
  `;

  const cap = document.createElement('p');
  cap.textContent = caption;
  cap.style.cssText = `
    margin-top:16px;font-size:0.9rem;color:rgba(240,240,248,0.7);
    font-family:'Outfit',sans-serif;letter-spacing:1px;
  `;

  const closeHint = document.createElement('p');
  closeHint.textContent = '× Click anywhere to close';
  closeHint.style.cssText = `
    position:absolute;top:20px;right:24px;font-size:0.85rem;
    color:rgba(240,240,248,0.4);font-family:'Outfit',sans-serif;
  `;

  overlay.appendChild(img);
  overlay.appendChild(cap);
  overlay.appendChild(closeHint);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', () => overlay.remove());
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
  });
}


// ============================================================
// 6. CONTACT FORM
// ============================================================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Send Message ✦';
    btn.disabled = false;
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('contact-form').reset();

    setTimeout(() => {
      document.getElementById('form-success').style.display = 'none';
    }, 5000);
  }, 1200);
}


// ============================================================
// 7. FLOATING CALL BUTTON (mobile)
// ============================================================
(function initFloatingBtn() {
  const fab = document.createElement('a');
  fab.href = 'tel:0778059914';
  fab.id = 'floating-call-btn';
  fab.innerHTML = '📞';
  fab.setAttribute('aria-label', 'Call DIK Salon');
  fab.style.cssText = `
    position:fixed;bottom:28px;right:24px;z-index:200;
    width:56px;height:56px;border-radius:50%;
    background:linear-gradient(135deg,#e91e8c,#b5076a);
    display:flex;align-items:center;justify-content:center;
    font-size:1.4rem;box-shadow:0 4px 24px rgba(233,30,140,0.5);
    transition:transform 0.3s ease,box-shadow 0.3s ease;
    animation:pulse 2.5s ease-in-out infinite;
  `;

  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
    @keyframes pulse {
      0%,100%{box-shadow:0 4px 24px rgba(233,30,140,0.5),0 0 0 0 rgba(233,30,140,0.3);}
      50%{box-shadow:0 4px 24px rgba(233,30,140,0.5),0 0 0 12px rgba(233,30,140,0);}
    }
  `;
  document.head.appendChild(pulseStyle);

  fab.addEventListener('mouseenter', () => {
    fab.style.transform = 'scale(1.12)';
    fab.style.boxShadow = '0 8px 32px rgba(233,30,140,0.7)';
  });
  fab.addEventListener('mouseleave', () => {
    fab.style.transform = '';
    fab.style.boxShadow = '';
  });

  document.body.appendChild(fab);
})();

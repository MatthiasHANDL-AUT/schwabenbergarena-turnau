// Header scroll state
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
burger && burger.addEventListener('click', () => nav.classList.toggle('open'));
nav && nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open')));

// Snowfall on hero / page heroes
document.querySelectorAll('.snow-canvas').forEach(snowCanvas => {
  const ctx = snowCanvas.getContext('2d');
  const hero = snowCanvas.closest('.hero, .page-hero');
  let flakes = [];
  const resize = () => {
    snowCanvas.width = hero.offsetWidth;
    snowCanvas.height = hero.offsetHeight;
    const count = Math.min(140, Math.floor(snowCanvas.width / 12));
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      r: Math.random() * 2.2 + .6,
      speed: Math.random() * 1.2 + .4,
      drift: Math.random() * .8 - .4,
      opacity: Math.random() * .5 + .3
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    flakes.forEach(f => {
      f.y += f.speed;
      f.x += f.drift;
      if (f.y > snowCanvas.height) { f.y = -4; f.x = Math.random() * snowCanvas.width; }
      if (f.x > snowCanvas.width) f.x = 0;
      if (f.x < 0) f.x = snowCanvas.width;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
});

// Hero slideshow
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 1) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
}

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Lightbox gallery
const gallery = document.querySelectorAll('.gallery');
gallery.forEach(g => {
  const items = [...g.querySelectorAll('img')];
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lb-close" aria-label="Schließen">&times;</button>
    <button class="lb-nav lb-prev" aria-label="Zurück">&#8249;</button>
    <img alt="">
    <button class="lb-nav lb-next" aria-label="Weiter">&#8250;</button>
    <div class="lb-cap"></div>`;
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const cap = box.querySelector('.lb-cap');
  let idx = 0;
  const show = i => {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src;
    cap.textContent = items[idx].alt || '';
  };
  items.forEach((it, i) => it.closest('figure').addEventListener('click', () => { show(i); box.classList.add('open'); }));
  box.querySelector('.lb-close').addEventListener('click', () => box.classList.remove('open'));
  box.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', e => { if (e.target === box) box.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') box.classList.remove('open');
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
});

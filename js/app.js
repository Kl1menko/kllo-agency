// Mobile nav toggle
const toggle = document.querySelector('.ko-nav__toggle');
const panel = document.querySelector('.ko-nav__panel');
if (toggle && panel) {
  const OPEN_LABEL = 'Відкрити меню';
  const CLOSE_LABEL = 'Закрити меню';

  const setLabel = (isOpen) => {
    toggle.setAttribute('aria-label', isOpen ? CLOSE_LABEL : OPEN_LABEL);
  };

  const openNav = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
    panel.classList.add('is-open');
    panel.scrollTop = 0;
    document.body.classList.add('is-nav-open');
    setLabel(true);
  };
  const closeNav = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    panel.classList.remove('is-open');
    document.body.classList.remove('is-nav-open');
    setLabel(false);
  };
  setLabel(false);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closeNav() : openNav();
  });
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
  const desktopMQ = window.matchMedia('(min-width: 841px)');
  const handleMQ = (event) => {
    if (event.matches) {
      closeNav();
    }
  };
  if (typeof desktopMQ.addEventListener === 'function') {
    desktopMQ.addEventListener('change', handleMQ);
  } else if (typeof desktopMQ.addListener === 'function') {
    desktopMQ.addListener(handleMQ);
  }
  document.addEventListener('click', (event) => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (
      expanded &&
      !panel.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeNav();
    }
  });
  document.addEventListener('keydown', (event) => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded && event.key === 'Escape') {
      closeNav();
    }
  });
}

// Sticky header shadow
const header = document.querySelector('[data-sticky]');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.boxShadow = y > 6 ? '0 8px 24px rgba(0,0,0,.25)' : 'none';
  lastY = y;
});

// Smooth anchor
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if(el){e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'});} 
  })
});

// Chips → hidden input
const chips = document.querySelectorAll('.chip');
const interest = document.querySelector('input[name="interest"]');
chips.forEach(ch=>{
  ch.addEventListener('click',()=>{
    ch.classList.toggle('is-active');
    const values = Array.from(document.querySelectorAll('.chip.is-active')).map(c=>c.dataset.value);
    if (interest) interest.value = values.join(', ');
  })
});

// Form validation (very light)
const form = document.querySelector('.form');
if(form){
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = form.querySelector('input[name="email"]');
    const name = form.querySelector('input[name="name"]');
    let ok = true;
    [email,name].forEach(input=>{
      if(!input.value.trim()){ ok=false; input.style.outline='2px solid rgba(212,107,255,.6)'; }
    })
    if(!ok) return;
    // TODO: інтеграція: fetch('/api', {method:'POST', body:new FormData(form)})
    alert('Дякуємо! Ми звʼяжемось протягом дня.');
    form.reset();
    document.querySelectorAll('.chip.is-active').forEach(c=>c.classList.remove('is-active'));
    if (interest) interest.value = '';
  })
}

// Intersection reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} })
},{threshold:.12});

[...document.querySelectorAll('.card,.form,.hero__card')].forEach(el=>{
  el.classList.add('reveal'); io.observe(el);
});

// Footer year
const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();

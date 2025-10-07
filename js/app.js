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

// Duplicate marquee chips via JS so markup stays DRY
document.querySelectorAll('.difference__chips-track').forEach((track) => {
  const sets = track.querySelectorAll('.difference__chips-set');
  if (!sets.length) return;
  if (sets.length === 1) {
    const clone = sets[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  } else {
    sets.forEach((set, index) => {
      if (index > 0) {
        set.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

// Sticky header shadow
const header = document.querySelector('[data-sticky]');
if (header) {
  const toggleShadow = () => {
    const y = window.scrollY;
    header.style.boxShadow = y > 6 ? '0 8px 24px rgba(0, 0, 0, 0.25)' : 'none';
  };
  toggleShadow();
  window.addEventListener('scroll', toggleShadow);
}

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
    const isActive = ch.classList.toggle('is-active');
    ch.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    const values = Array.from(document.querySelectorAll('.chip.is-active')).map(c=>c.dataset.value);
    if (interest) interest.value = values.join(', ');
  })
});

// Form validation (very light)
const form = document.querySelector('.form');
if(form){
  const requiredFields = ['email','name']
    .map(name=>form.querySelector(`input[name="${name}"]`))
    .filter(Boolean);
  const setFieldError = (input, hasError) => {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('field--error', hasError);
  };
  requiredFields.forEach(input=>{
    input.addEventListener('input', ()=>{
      setFieldError(input, !input.value.trim());
    });
  });
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let ok = true;
    requiredFields.forEach(input=>{
      const hasError = !input.value.trim();
      setFieldError(input, hasError);
      if(hasError){ ok=false; }
    });
    if(!ok) return;
    // TODO: інтеграція: fetch('/api', {method:'POST', body:new FormData(form)})
    alert('Дякуємо! Ми звʼяжемось протягом дня.');
    form.reset();
    requiredFields.forEach(input=>setFieldError(input,false));
    document.querySelectorAll('.chip.is-active').forEach(c=>{
      c.classList.remove('is-active');
      c.setAttribute('aria-pressed','false');
    });
    if (interest) interest.value = '';
  })
}

// Intersection reveal
const revealTargets = document.querySelectorAll('.card,.form,.hero__card');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} })
  },{threshold:.12});
  revealTargets.forEach(el=>{
    el.classList.add('reveal'); io.observe(el);
  });
} else {
  revealTargets.forEach(el=>{
    el.classList.add('is-in');
  });
}

// Footer year
const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();


// Mobile nav
const burger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', ()=> navLinks.classList.toggle('open'));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.startsWith('#')){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
      navLinks.classList.remove('open');
    }
  });
});

// Counters
function countUp(el, target, speed=16, steps=120){
  let cur = 0;
  const inc = target/steps;
  const iv = setInterval(()=>{
    cur += inc;
    if(cur >= target){ cur = target; clearInterval(iv); }
    el.textContent = Math.round(cur);
  }, speed);
}
document.querySelectorAll('[data-count]').forEach(el=> countUp(el, +el.dataset.count));

// Modal API
const modal = document.querySelector('.modal');
function openModal(html){
  if(!modal) return;
  modal.querySelector('.modal-body').innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal?.classList.remove('open');
  document.body.style.overflow = 'auto';
}
modal?.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

// Schedule filter
const filterBtns = document.querySelectorAll('[data-filter]');
filterBtns.forEach(btn=> btn.addEventListener('click', ()=>{
  filterBtns.forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const sport = btn.dataset.filter;
  document.querySelectorAll('.game').forEach(g=>{
    g.style.display = (sport==='all' || g.dataset.sport===sport)? 'flex':'none';
  });
}));

// Contact form (fake submit)
const form = document.querySelector('form[data-form="contact"]');
form?.addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(form);
  const name = fd.get('name') || 'Friend';
  openModal(`<div class="center">
    <h2>Thanks, ${name}!</h2>
    <p>Your message has been received. We'll get back to you soon.</p>
    <button class="btn submit" onclick="closeModal()">Close</button>
  </div>`);
  form.reset();
});

// Lightbox for gallery
document.querySelectorAll('[data-lightbox] img').forEach(img=>{
  img.addEventListener('click', ()=>{
    openModal(`<img src="${img.src}" alt="" style="width:100%;height:auto">`);
  });
});



// RU Athletics – shared JS (nav, footer, interactivity, lightbox, schedule filter)
(function(){
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  const NAV = `
  <header class="header">
    <div class="container nav">
      <a class="brand" href="/"><img src="/assets/media/football.jpg" alt="RU"/>RU Athletics</a>
      <nav>
        <ul class="nav-links" id="navLinks">
          <li><a href="/" data-m="home">Home</a></li>
          <li><a href="/sports/" data-m="sports">Sports</a></li>
          <li><a href="/news/" data-m="news">News</a></li>
          <li><a href="/schedule/" data-m="schedule">Schedule</a></li>
          <li><a href="/teams/" data-m="teams">Teams</a></li>
          <li><a href="/tickets/" data-m="tickets">Tickets</a></li>
          <li><a href="/gallery/" data-m="gallery">Media</a></li>
          <li><a href="/about/" data-m="about">About</a></li>
          <li><a href="/contact/" data-m="contact">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="btn outline btn-outline" href="/policies/accessibility.html">Accessibility</a>
        <div class="hamburger" id="hamburger" aria-label="Menu" role="button" tabindex="0"><span></span></div>
      </div>
    </div>
  </header>`;

  const FOOT = `
  <footer class="footer">
    <div class="container">
      <div class="cols">
        <div>
          <h4>RU Athletics</h4>
          <p>Excellence in sports, excellence in life.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><a href="/sports/">Sports</a><br><a href="/news/">News</a><br><a href="/schedule/">Schedule</a></p>
        </div>
        <div>
          <h4>Support</h4>
          <p><a href="/tickets/">Tickets</a><br><a href="/policies/privacy.html">Privacy</a><br><a href="/sitemap.html">Sitemap</a></p>
        </div>
        <div>
          <h4>Connect</h4>
          <p><a href="/contact/">Contact</a><br><a href="/gallery/">Media</a><br><a href="/about/">About</a></p>
        </div>
      </div>
      <div class="center" style="margin-top:14px"><small>© <span id="year"></span> RU Athletics. All rights reserved.</small></div>
    </div>
  </footer>`;

  if(header) header.innerHTML = NAV;
  if(footer) footer.innerHTML = FOOT;

  // Year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const toggleMenu = () => navLinks.classList.toggle('show');
  if(burger){
    burger.addEventListener('click', toggleMenu);
    burger.addEventListener('keypress', (e)=>{ if(e.key==='Enter') toggleMenu(); });
  }
  document.addEventListener('click', (e)=>{
    if(navLinks && navLinks.classList.contains('show')){
      if(!e.target.closest('.nav') || e.target.matches('.nav-links a')) navLinks.classList.remove('show');
    }
  });

  // Active link
  const map = {
    "/": "home",
    "/index.html": "home",
    "/sports/": "sports",
    "/news/": "news",
    "/schedule/": "schedule",
    "/teams/": "teams",
    "/tickets/": "tickets",
    "/gallery/": "gallery",
    "/about/": "about",
    "/contact/": "contact"
  };
  const path = window.location.pathname;
  const activeKey = Object.keys(map).find(k => path === k || path.startsWith(k)) || "/";
  const activeName = map[activeKey];
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.dataset.m === activeName) a.classList.add('active');
  });

  // Counter animation
  const counters = document.querySelectorAll('[data-counter]');
  let countersStarted = false;
  const startCounters = () => {
    counters.forEach(el => {
      const end = parseInt(el.getAttribute('data-counter'),10) || 0;
      let val = 0;
      const step = Math.max(1, Math.floor(end / 100));
      const tick = () => {
        val += step;
        if(val >= end){ el.textContent = end.toLocaleString(); }
        else { el.textContent = val.toLocaleString(); requestAnimationFrame(tick); }
      };
      tick();
    });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if(en.isIntersecting && !countersStarted){ countersStarted = true; startCounters(); } });
  }, { threshold:.2 });
  counters.forEach(c => io.observe(c));

  // Lightbox (gallery)
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<span class="close" aria-label="Close">×</span><img alt="preview">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  lb.addEventListener('click',()=> lb.classList.remove('show'));
  document.querySelectorAll('[data-lightbox]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const src = a.getAttribute('href') || a.querySelector('img')?.src;
      lbImg.src = src;
      lb.classList.add('show');
    });
  });

  // Schedule filter (reads data-sport on items)
  const filterWrap = document.querySelector('[data-filter-wrap]');
  if(filterWrap){
    const buttons = filterWrap.querySelectorAll('button[data-filter]');
    const items = document.querySelectorAll('.item[data-sport]');
    buttons.forEach(btn => btn.addEventListener('click', ()=>{
      const v = btn.getAttribute('data-filter');
      buttons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      items.forEach(it => {
        it.style.display = (v==='all' || it.dataset.sport===v) ? 'grid' : 'none';
      });
    }));
  }

  // Video modal (simple)
  document.querySelectorAll('[data-modal="video"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-src') || '/assets/media/highlights.mp4';
      const backdrop = document.createElement('div');
      backdrop.className = 'lightbox show';
      backdrop.innerHTML = '<span class="close">×</span><video controls autoplay style="max-width:92vw; max-height:85vh; border-radius:16px; box-shadow:0 30px 80px rgba(0,0,0,.6)"></video>';
      backdrop.querySelector('video').src = url;
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', ()=> backdrop.remove());
    });
  });

  // Contact form (basic validation + localStorage inbox)
  const form = document.querySelector('form[data-contact]');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if(!data.name || !data.email) { alert('Please complete the form.'); return; }
      const inbox = JSON.parse(localStorage.getItem('ru_inbox') || '[]');
      inbox.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem('ru_inbox', JSON.stringify(inbox));
      form.reset();
      alert('Thanks! Your message has been received.');
    });
  }
})();

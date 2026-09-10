(function(){
  var cs = document.currentScript;
  if(cs && !window.__nf1SharedScriptsInjected){
    window.__nf1SharedScriptsInjected = true;
    ['assistant.js','testimonials.js'].forEach(function(name){
      try{
        var s = document.createElement('script');
        s.src = new URL(name, cs.src).href;
        document.head.appendChild(s);
      }catch(e){}
    });
  }
})();

document.addEventListener('DOMContentLoaded',()=>{
 const year=document.querySelectorAll('#currentYear');year.forEach(e=>e.textContent=new Date().getFullYear());
 const body=document.body; body.classList.add('light'); body.classList.remove('dark'); localStorage.setItem('nforceone-theme','light');
 const menu=document.getElementById('mobileMenu'),nav=document.querySelector('.main-nav,.navbar nav');
 menu?.addEventListener('click',()=>{nav?.classList.toggle('open');menu.setAttribute('aria-expanded',nav?.classList.contains('open')?'true':'false')});
 document.querySelectorAll('.nav-dropdown>button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const parent=b.parentElement;document.querySelectorAll('.nav-dropdown').forEach(d=>{if(d!==parent)d.classList.remove('open')});parent.classList.toggle('open');b.setAttribute('aria-expanded',parent.classList.contains('open')?'true':'false')}));
 document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown').forEach(d=>{d.classList.remove('open');d.querySelector('button')?.setAttribute('aria-expanded','false')})});
 document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
 if('IntersectionObserver'in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
 document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem('nf-session');location.href='login.html'}));

 // Active page/section indicator.
 const links=[...document.querySelectorAll('.main-nav>a')];
 const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
 const setActive=({href='',button=false}={})=>{
   links.forEach(a=>a.classList.remove('active'));
   dropdowns.forEach(d=>d.querySelector('button')?.classList.remove('active-nav'));
   if(button){const d=dropdowns.find(x=>x.querySelector('button')?.textContent.trim().toLowerCase().startsWith(button));d?.querySelector('button')?.classList.add('active-nav');return}
   const target=links.find(a=>a.getAttribute('href')===href);
   if(target)target.classList.add('active');
 };
 const path=location.pathname.toLowerCase();
 if(path.endsWith('/index.html')||path.endsWith('/NforceOne_Website/')||path.endsWith('/site')){
   setActive({href:'index.html'});
   const sections=[['services','services'],['top','home']];
   if('IntersectionObserver'in window){
     const so=new IntersectionObserver(entries=>entries.forEach(entry=>{
       if(!entry.isIntersecting)return;
       const id=entry.target.id;
       if(id==='services')setActive({button:'capabilities'});
       else if(id==='top')setActive({href:'index.html'});
     }),{rootMargin:'-35% 0px -55% 0px',threshold:0});
     sections.forEach(([id])=>{const el=document.getElementById(id);if(el)so.observe(el)});
   }
 }else if(path.includes('industry')) setActive({button:'industries'});
 else if(path.includes('products')) setActive({href:'products.html'});
 else if(path.includes('case-stud')) setActive({href:'case-studies.html'});
 else if(path.includes('engineering')||path.includes('service-details')||path.includes('data')||path.includes('ai')||path.includes('qa')||path.includes('api')) setActive({button:'capabilities'});
 else if(path.includes('careers')) setActive({href:'careers.html'});
 else if(path.includes('contact')) setActive({href:'contact.html'});
});

/* Page-specific visual setup and unique image fallback. */
(function(){
 const path=location.pathname.toLowerCase();
 const params=new URLSearchParams(location.search);
 if(path.endsWith('/service-details.html')||path.endsWith('service-details.html')) document.body.classList.add('service-'+(params.get('service')||'software'));
 const pageImages={
   home:['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80'],
   engineering:['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'],
   data:['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80'],
   ai:['https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80'],
   qa:['https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'],
   nf1:['https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80'],
   industries:['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1559526324-5939d68a0d9b?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80']
 };
 let key='home';
 if(path.includes('engineering'))key='engineering'; else if(path.includes('data'))key='data'; else if(path.includes('nf1'))key='nf1'; else if(path.includes('/qa'))key='qa'; else if(path.includes('/ai'))key='ai'; else if(path.includes('industr'))key='industries';
 const images=pageImages[key]||pageImages.home;
 let i=0;
 document.querySelectorAll('.content-grid>.content-card,.process>.content-card,.content-split>.content-card,.qa-grid>.qa-card,.qa-target-card').forEach((card)=>{
   if(!card.querySelector(':scope > .card-edge')){
     const edge=document.createElement('span'); edge.className='card-edge'; edge.setAttribute('aria-hidden','true'); card.prepend(edge);
   }
   const bg=getComputedStyle(card).backgroundImage;
   if(!bg || bg==='none'){
     card.style.backgroundImage='url("'+images[i%images.length]+'")';
     card.classList.add('image-backed-card');
   }
   i++;
 });
})();

/* ===== Visible card interaction: mouse-follow tilt + unique card classes ===== */
document.addEventListener('DOMContentLoaded',()=>{
  const cards=[...document.querySelectorAll('.content-card,.qa-card,.qa-target-card,.stat,.panel,.auth-card')];
  cards.forEach((card,index)=>{
    card.classList.add('interactive-card','card-motion-'+((index%6)+1));
    card.addEventListener('pointermove',e=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--ry',(x*4).toFixed(2)+'deg');
      card.style.setProperty('--rx',(-y*3).toFixed(2)+'deg');
    });
    card.addEventListener('pointerleave',()=>{
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--rx','0deg');
    });
  });
});

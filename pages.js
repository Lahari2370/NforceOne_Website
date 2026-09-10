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
 const body=document.body; body.classList.add('light'); localStorage.setItem('nforceone-theme','light');
 const menu=document.getElementById('mobileMenu'),nav=document.querySelector('.main-nav,.navbar nav');menu?.addEventListener('click',()=>{nav?.classList.toggle('open');menu.setAttribute('aria-expanded',nav?.classList.contains('open')?'true':'false')});
 document.querySelectorAll('.nav-dropdown>button').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));
 const reveal=()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))};
 if('IntersectionObserver'in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))}else reveal();
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
 document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem('nf-session');location.href='login.html'}));
});

/* Final page-specific visual setup. */
(function(){
  const path=location.pathname.toLowerCase();
  const params=new URLSearchParams(location.search);
  if(path.endsWith('/service-details.html')||path.endsWith('service-details.html')){
    const key=params.get('service')||'software';
    document.body.classList.add('service-'+key);
  }
  const images=[
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ];
  let i=0;
  document.querySelectorAll('.content-grid>.content-card,.process>.content-card,.content-split>.content-card,.qa-grid>.qa-card').forEach(card=>{
    const bg=getComputedStyle(card).backgroundImage;
    if(!bg || bg==='none'){
      card.style.backgroundImage='url("'+images[i%images.length]+'")';
      card.classList.add('image-backed-card');
      i++;
    }
  });
})();

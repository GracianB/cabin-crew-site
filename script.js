'use strict';
const observer = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }, {threshold:0.09}) : null;
if (observer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { document.querySelectorAll('.chapter h2, .copy, .timeline article, .qualification, .project-grid a').forEach(el=>{el.classList.add('reveal');observer.observe(el)}); }

/* V2 navigation and reading progress: no dependencies */
const menuButton=document.querySelector('.mobile-menu-button');
const navigation=document.getElementById('main-navigation');
if(menuButton&&navigation){
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menuButton.setAttribute('aria-expanded',String(open));
    if(open) navigation.querySelector('a')?.focus();
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    navigation.classList.toggle('is-open',open);
  });
  navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
    navigation.classList.remove('is-open');
  }));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && navigation.classList.contains('is-open')){
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Open navigation');
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 951px)').addEventListener?.('change',e=>{
    if(e.matches){navigation.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');}
  });
}
const progress=document.getElementById('reading-progress-fill');
let progressScheduled=false;
function paintProgress(){
  progressScheduled=false;
  if(!progress)return;
  const maximum=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(maximum>0?Math.min(100,Math.max(0,scrollY/maximum*100)):0)+'%';
}
window.addEventListener('scroll',()=>{if(!progressScheduled){progressScheduled=true;requestAnimationFrame(paintProgress)}},{passive:true});
window.addEventListener('resize',paintProgress);
paintProgress();

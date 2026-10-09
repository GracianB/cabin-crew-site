'use strict';
(()=>{
const back=document.querySelector('.v6-up');
let queued=false;
const updateBack=()=>{queued=false;back?.classList.toggle('visible',scrollY>550)};
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateBack)}},{passive:true});updateBack();
const nav=document.getElementById('main-navigation');
if(nav&&'IntersectionObserver'in window){
 const links=[...nav.querySelectorAll('a[href^="#"]')];
 const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
 const io=new IntersectionObserver(entries=>{
  const current=entries.find(e=>e.isIntersecting);
  if(!current)return;
  links.forEach(a=>{if(a.getAttribute('href')==='#'+current.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 },{rootMargin:'-15% 0px -68% 0px',threshold:0});
 sections.forEach(s=>io.observe(s));
}
const status=document.getElementById('v6-status');
function notify(message){if(status)status.textContent=message}
document.getElementById('v6-copy')?.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(location.href.split('#')[0]);notify('Portfolio link copied.')}
 catch{notify('Clipboard unavailable. Copy the address from the browser address bar.')}
});
document.getElementById('v6-print')?.addEventListener('click',()=>print());
const counter=document.getElementById('v6-count');
const stops=[...document.querySelectorAll('[data-stop]')];
function updateCounter(){
 const i=stops.findIndex(b=>b.getAttribute('aria-pressed')==='true');
 if(counter)counter.textContent=String(Math.max(0,i)+1).padStart(2,'0')+' / '+String(stops.length).padStart(2,'0');
}
stops.forEach(b=>b.addEventListener('click',updateCounter));
document.getElementById('v4-stop-prev')?.addEventListener('click',updateCounter);
document.getElementById('v4-stop-next')?.addEventListener('click',updateCounter);
updateCounter();
})();
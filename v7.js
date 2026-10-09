'use strict';
/* V7 gentle UX: no tracking, network calls or auto-playing media. */
(()=>{
 const nav=document.getElementById('main-navigation');
 const button=document.querySelector('.mobile-menu-button');
 if(!nav||!button)return;
 const close=()=>{
   nav.classList.remove('is-open');
   button.setAttribute('aria-expanded','false');
   button.setAttribute('aria-label','Open navigation');
 };
 document.addEventListener('pointerdown',event=>{
   if(nav.classList.contains('is-open')&&!nav.contains(event.target)&&!button.contains(event.target))close();
 });
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&nav.classList.contains('is-open')){close();button.focus();}
 });
})();

'use strict';
/* V4 interaction: intentionally small, local, keyboard-friendly. */
(()=>{
const chapters=[
{city:'Murcia',role:'THE FOUNDATION',copy:'I studied Tourism in Murcia and learned that hospitality begins with attention to the person in front of you.',lesson:'Curiosity and respect for each guest.'},
{city:'Bergamo',role:'ITALY · ERASMUS & RETAIL',copy:'Studying at the University of Bergamo while working in retail taught me independence, the everyday use of Italian and how to connect across cultures.',lesson:'Listen closely and adapt to a new environment.'},
{city:'Madrid',role:'PREMIUM CUSTOMER EXPERIENCE',copy:'Leading shops and teams in Madrid taught me how service expectations, empathy and operational responsibility work together.',lesson:'Stay composed, accountable and helpful under pressure.'},
{city:'Lisbon',role:'MAJOREL · GOOGLE/YOUTUBE PROJECT',copy:'During the pandemic I moved to Portugal for a multicultural content-quality role. I also supported wellbeing initiatives for colleagues.',lesson:'Respect different perspectives and support the team.'},
{city:'International',role:'MINDEREST & BODYTONE',copy:'From global Customer Success relationships to service operations and data, I learned that trust is earned by showing up when things are difficult.',lesson:'Listen, act, follow through and keep learning.'},
{city:'Back to aviation',role:'CABIN CREW · A CONSCIOUS CHOICE',copy:'I previously completed TCP training at ESATUR, with simulator experience in Mallorca. My qualification is no longer current. Now I return to aviation ready for airline training and safety assessments.',lesson:'Bring maturity, care and a learner’s mindset.'}
];
const stops=Array.from(document.querySelectorAll('[data-stop]'));let current=0;
const fields={city:document.getElementById('v4-panel-city'),role:document.getElementById('v4-panel-role'),copy:document.getElementById('v4-panel-copy'),lesson:document.getElementById('v4-panel-lesson'),index:document.getElementById('v4-panel-index')};
const previous=document.getElementById('v4-stop-prev'),next=document.getElementById('v4-stop-next');
function show(i,focus=false){if(i<0||i>=chapters.length)return;current=i;let c=chapters[i];if(!fields.city)return;fields.city.textContent=c.city;fields.role.textContent=c.role;fields.copy.textContent=c.copy;fields.lesson.replaceChildren();const strong=document.createElement('strong');strong.textContent='What I carry forward: ';fields.lesson.append(strong,document.createTextNode(c.lesson));fields.index.textContent=String(i+1).padStart(2,'0')+' / 06';stops.forEach((b,j)=>{b.classList.toggle('is-active',i===j);b.setAttribute('aria-pressed',String(i===j))});previous.disabled=i===0;next.disabled=i===chapters.length-1;if(focus)stops[i]?.focus();}
stops.forEach((b,i)=>{b.addEventListener('click',()=>show(i));b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();show(Math.min(chapters.length-1,i+1),true)}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();show(Math.max(0,i-1),true)}})});
previous?.addEventListener('click',()=>show(current-1));next?.addEventListener('click',()=>show(current+1));show(0);
const dialog=document.getElementById('v4-brief-dialog'),open=document.getElementById('open-brief');
const close=()=>{if(dialog?.open)dialog.close();open?.focus()};
open?.addEventListener('click',()=>{if(dialog?.showModal)dialog.showModal();else document.getElementById('story')?.scrollIntoView()});
document.getElementById('close-brief')?.addEventListener('click',close);
document.getElementById('v4-dialog-done')?.addEventListener('click',close);
document.getElementById('v4-dialog-training')?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)close()});
})();
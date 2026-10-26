const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');else if(entry.boundingClientRect.top>0&&!reduced)entry.target.classList.remove('visible')}),{threshold:.1});reveals.forEach(el=>observer.observe(el));
const ribbon=document.querySelector('.ribbon-scroll');
const ribbonTrack=ribbon?.querySelector('.ticker>div');
let ribbonTravel=0,ribbonStart=0,ribbonEnd=1,ribbonPosition=0,ribbonTarget=0,ribbonFrame=0;
function animateRibbon(){
 ribbonPosition+=(ribbonTarget-ribbonPosition)*.16;
 if(Math.abs(ribbonTarget-ribbonPosition)<.2)ribbonPosition=ribbonTarget;
 if(ribbonTrack)ribbonTrack.style.transform=`translate3d(${-ribbonPosition}px,0,0)`;
 ribbonFrame=ribbonPosition!==ribbonTarget?requestAnimationFrame(animateRibbon):0;
}
function updateRibbon(y=scrollY){
 if(!ribbon||reduced)return;
 const progress=Math.max(0,Math.min(1,(y-ribbonStart)/(ribbonEnd-ribbonStart)));
 ribbonTarget=progress*ribbonTravel;
 if(!ribbonFrame)ribbonFrame=requestAnimationFrame(animateRibbon);
}
function measureRibbon(){
 if(!ribbon||reduced)return;
 const box=ribbon.getBoundingClientRect();
 ribbonTravel=Math.max(0,ribbonTrack.scrollWidth-ribbon.querySelector('.ticker').clientWidth);
 const top=box.top+scrollY;
 ribbonStart=top-innerHeight;
 ribbonEnd=top+box.height;
 updateRibbon();
}
addEventListener('resize',measureRibbon);
document.fonts.ready.then(measureRibbon);
measureRibbon();
let queued=false;function scrollUpdate(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max?y/max*100:0}%`;if(!reduced){if(document.querySelector('.sculpture'))document.querySelector('.sculpture').style.transform=`rotate(${y*.045-25}deg) rotateY(${y*.035}deg)`;updateRibbon(y);document.querySelector('.statement')?.style.setProperty('--spin',`${y*.045}deg`)}queued=false}addEventListener('scroll',()=>{if(!queued){requestAnimationFrame(scrollUpdate);queued=true}},{passive:true});scrollUpdate();
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('input[name="service"]').forEach(input=>input.checked=input.value===link.dataset.service)}));
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#brief-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),services=data.getAll('service');if(!services.length){document.querySelector('#form-status').textContent='Please select at least one service.';document.querySelector('input[name="service"]').focus();return}const brief=`TERVYX TECHNOLOGIES — PROJECT BRIEF\nCode the Future\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nServices: ${services.join(', ')}\n\nProject idea\n${data.get('idea')}\n\nPrepared on ${new Date().toLocaleDateString()}\n`;const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='TERVYX-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Your brief is ready. Save it and share it with TERVYX to begin the conversation.'});

const requestedService=new URLSearchParams(location.search).get("service");const serviceNames={"web-development":"Web Development","app-development":"App Development","digital-marketing":"Digital Marketing"};if(serviceNames[requestedService])document.querySelectorAll("input[name=service]").forEach(input=>input.checked=input.value===serviceNames[requestedService]);

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');else if(entry.boundingClientRect.top>0&&!reduced)entry.target.classList.remove('visible')}),{threshold:.1});reveals.forEach(el=>observer.observe(el));
const ribbon=document.querySelector('.ribbon-scroll');
const ribbonTrack=ribbon?.querySelector('.ticker>div');
let ribbonTravel=0,ribbonStart=0,ribbonPosition=0;
function updateRibbon(){
 if(ribbonTrack)ribbonTrack.style.setProperty('--ticker',`${-ribbonPosition}px`);
}
function measureRibbon(){
 if(!ribbon||reduced)return;
 ribbonTravel=Math.max(0,ribbonTrack.scrollWidth-ribbon.querySelector('.ticker').clientWidth);
 ribbonStart=Math.max(0,ribbon.getBoundingClientRect().top+scrollY-innerHeight*.35);
 ribbonPosition=Math.min(ribbonTravel,ribbonPosition);
 updateRibbon();
}
function consumeRibbon(delta,event){
 if(!ribbon||reduced||!delta||!ribbonTravel)return false;
 const y=scrollY,down=delta>0;
 const crossing=down?y<=ribbonStart+1&&y+delta>=ribbonStart:y>=ribbonStart-1&&y+delta<=ribbonStart;
 const available=down?ribbonPosition<ribbonTravel:ribbonPosition>0;
 if(!crossing||!available)return false;
 event.preventDefault();
 const toAnchor=ribbonStart-y;
 const movement=delta-toAnchor;
 const next=Math.max(0,Math.min(ribbonTravel,ribbonPosition+movement));
 const consumed=next-ribbonPosition;
 ribbonPosition=next;
 updateRibbon();
 window.scrollTo({top:ribbonStart+movement-consumed,behavior:'instant'});
 return true;
}
addEventListener('wheel',event=>{
 if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
 const multiplier=event.deltaMode===1?16:event.deltaMode===2?innerHeight:1;
 consumeRibbon(event.deltaY*multiplier,event);
},{passive:false});
let touchY=null;
addEventListener('touchstart',event=>{touchY=event.touches.length===1?event.touches[0].clientY:null},{passive:true});
addEventListener('touchmove',event=>{if(touchY===null||event.touches.length!==1)return;const next=event.touches[0].clientY;consumeRibbon(touchY-next,event);touchY=next},{passive:false});
addEventListener('keydown',event=>{
 if(event.target.closest('input,textarea,select,button,a,[contenteditable]')||event.metaKey||event.ctrlKey||event.altKey)return;
 const deltas={ArrowDown:60,ArrowUp:-60,PageDown:innerHeight*.8,PageUp:-innerHeight*.8,' ':innerHeight*.8*(event.shiftKey?-1:1)};
 if(deltas[event.key])consumeRibbon(deltas[event.key],event);
});
addEventListener('resize',measureRibbon);
document.fonts.ready.then(measureRibbon);
measureRibbon();
let queued=false;function scrollUpdate(){const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${max?y/max*100:0}%`;if(!reduced){if(document.querySelector('.sculpture'))document.querySelector('.sculpture').style.transform=`rotate(${y*.045-25}deg) rotateY(${y*.035}deg)`;updateRibbon(y);document.querySelector('.statement')?.style.setProperty('--spin',`${y*.045}deg`)}queued=false}addEventListener('scroll',()=>{if(!queued){requestAnimationFrame(scrollUpdate);queued=true}},{passive:true});scrollUpdate();
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('input[name="service"]').forEach(input=>input.checked=input.value===link.dataset.service)}));
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#brief-form')?.addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget,data=new FormData(form),services=data.getAll('service');if(!services.length){document.querySelector('#form-status').textContent='Please select at least one service.';document.querySelector('input[name="service"]').focus();return}const brief=`TERVYX TECHNOLOGIES — PROJECT BRIEF\nCode the Future\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nServices: ${services.join(', ')}\n\nProject idea\n${data.get('idea')}\n\nPrepared on ${new Date().toLocaleDateString()}\n`;const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='TERVYX-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Your brief is ready. Save it and share it with TERVYX to begin the conversation.'});

const requestedService=new URLSearchParams(location.search).get("service");const serviceNames={"web-development":"Web Development","app-development":"App Development","digital-marketing":"Digital Marketing"};if(serviceNames[requestedService])document.querySelectorAll("input[name=service]").forEach(input=>input.checked=input.value===serviceNames[requestedService]);

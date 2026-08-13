const GARAGE={phone:'',whatsapp:'',maps:'',tiktok:''};
const $=s=>document.querySelectorAll(s);
const setLinks=(selector,url)=>$(selector).forEach(a=>{if(url){a.href=url;a.target='_blank';a.rel='noopener'}else a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#contact').scrollIntoView({behavior:'smooth'})})});
setLinks('[data-phone]',GARAGE.phone?'tel:'+GARAGE.phone:'');
setLinks('[data-whatsapp]',GARAGE.whatsapp?'https://wa.me/'+GARAGE.whatsapp.replace(/\D/g,''):'');
setLinks('[data-maps]',GARAGE.maps||'');
setLinks('[data-tiktok]',GARAGE.tiktok||'');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-links');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelector('#year').textContent=new Date().getFullYear();

// When the real business details are confirmed, edit only GARAGE above.
// Example: phone:'+97798XXXXXXXX', whatsapp:'97798XXXXXXXX', maps:'https://maps.google.com/?q=...', tiktok:'https://www.tiktok.com/@...'

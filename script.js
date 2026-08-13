const GARAGE={
  // Add verified business details here. Do not publish invented information.
  phone:'',
  whatsapp:'',
  maps:'',
  tiktok:'',
  address:'Exact address — to be confirmed',
  hours:'Opening hours — to be confirmed'
};

const $=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const contact=document.querySelector('#contact');

function wireLinks(selector,url,fallback='#contact'){
  $(selector).forEach(link=>{
    if(url){
      link.href=url;
      if(/^https?:\/\//i.test(url)){link.target='_blank';link.rel='noopener noreferrer';}
    }else{
      link.href=fallback;
      link.addEventListener('click',event=>{
        event.preventDefault();
        contact?.scrollIntoView({behavior:'smooth',block:'start'});
      });
    }
  });
}

const cleanNumber=value=>String(value||'').replace(/\D/g,'');
wireLinks('[data-phone]',GARAGE.phone?'tel:'+GARAGE.phone:'');
wireLinks('[data-whatsapp]',GARAGE.whatsapp?'https://wa.me/'+cleanNumber(GARAGE.whatsapp):'');
wireLinks('[data-maps]',GARAGE.maps||'');
wireLinks('[data-tiktok]',GARAGE.tiktok||'');

$('[data-phone-text]').forEach(el=>el.textContent=GARAGE.phone||'Phone number — to be confirmed');
$('[data-address]').forEach(el=>el.textContent=GARAGE.address);
$('[data-hours]').forEach(el=>el.textContent=GARAGE.hours);

const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');

menu?.addEventListener('click',()=>{
  const open=nav?.classList.toggle('open')??false;
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  menu.classList.toggle('active',open);
});

$('[href^="#"]').forEach(link=>link.addEventListener('click',()=>{
  if(nav?.classList.contains('open')){
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Open navigation');
  }
}));

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav?.classList.contains('open')){
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Open navigation');
    menu?.focus();
  }
});

document.querySelector('#year').textContent=new Date().getFullYear();

// Keep the configuration above as the single source of truth for future contact updates.

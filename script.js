const GARAGE={phone:'',whatsapp:'',maps:'',tiktok:'',address:'Exact address — to be confirmed',hours:'Opening hours — to be confirmed'};
const $=(s,r=document)=>Array.from(r.querySelectorAll(s));
const cleanNumber=v=>String(v||'').replace(/\D/g,'');
const storeKey='dkg-admin-v1';
const loadStore=()=>{try{return JSON.parse(localStorage.getItem(storeKey))||{gallery:[],videos:[],business:{}}}catch{return{gallery:[],videos:[],business:{}}}};
let STORE=loadStore();
const saveStore=()=>localStorage.setItem(storeKey,JSON.stringify(STORE));
const contact=document.querySelector('#contact');

function wireLinks(selector,url,fallback='#contact'){$(selector).forEach(link=>{if(url){link.href=url;if(/^https?:\/\//i.test(url)){link.target='_blank';link.rel='noopener noreferrer'}}else{link.href=fallback;link.addEventListener('click',e=>{e.preventDefault();contact?.scrollIntoView({behavior:'smooth'})})}})}
function applyBusiness(){const b={...GARAGE,...STORE.business};wireLinks('[data-phone]',b.phone?'tel:'+b.phone:'');wireLinks('[data-whatsapp]',b.whatsapp?'https://wa.me/'+cleanNumber(b.whatsapp):'');wireLinks('[data-maps]',b.maps||'');wireLinks('[data-tiktok]',b.tiktok||'');$('[data-phone-text]').forEach(e=>e.textContent=b.phone||'Phone number — to be confirmed');$('[data-address]').forEach(e=>e.textContent=b.address||GARAGE.address);$('[data-hours]').forEach(e=>e.textContent=b.hours||GARAGE.hours)}
applyBusiness();

const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav-links');
menu?.addEventListener('click',()=>{const open=nav?.classList.toggle('open')??false;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
$('[href^="#"]').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');closeAdmin()}});
document.querySelector('#year').textContent=new Date().getFullYear();

// Admin UI — browser-local content manager. This is intentionally not presented as secure authentication.
const fab=document.querySelector('#admin-fab'),floatLinks=document.querySelector('#admin-float-links'),overlay=document.querySelector('#admin-overlay'),closeBtn=document.querySelector('#admin-close');
function openAdmin(tab='admin-gallery'){overlay.hidden=false;document.body.style.overflow='hidden';floatLinks?.classList.remove('open');switchTab(tab);renderAdmin();}
function closeAdmin(){if(!overlay)return;overlay.hidden=true;document.body.style.overflow='';}
function switchTab(id){$('.admin-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));$('.admin-tab').forEach(t=>t.classList.toggle('active',t.id===id))}
fab?.addEventListener('click',()=>floatLinks?.classList.toggle('open'));
closeBtn?.addEventListener('click',closeAdmin);
overlay?.addEventListener('click',e=>{if(e.target===overlay)closeAdmin()});
$('[data-admin-action]').forEach(b=>b.addEventListener('click',()=>openAdmin(b.dataset.adminAction==='video'?'admin-videos':b.dataset.adminAction==='settings'?'admin-business':'admin-gallery')));
$('.admin-tabs button').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));

function renderGallery(){const grid=document.querySelector('#gallery-grid'),list=document.querySelector('#admin-gallery-items');if(!grid||!list)return;grid.querySelectorAll('.dynamic-photo').forEach(e=>e.remove());list.innerHTML='';STORE.gallery.forEach((item,i)=>{const figure=document.createElement('figure');figure.className='photo dynamic-photo';figure.innerHTML='<img loading="lazy" alt=""><figcaption></figcaption>';figure.querySelector('img').src=item.src;figure.querySelector('img').alt=item.caption||'Dada Ko Garage';figure.querySelector('figcaption').textContent=item.caption||'Dada Ko Garage';grid.appendChild(figure);const row=document.createElement('div');row.className='admin-item';row.innerHTML='<img alt=""><div><strong></strong><small>Gallery image</small></div><button class="admin-delete" type="button">DELETE</button>';row.querySelector('img').src=item.src;row.querySelector('strong').textContent=item.caption||'Untitled image';row.querySelector('.admin-delete').onclick=()=>{STORE.gallery.splice(i,1);saveStore();renderAdmin()};list.appendChild(row)});if(!STORE.gallery.length)list.innerHTML='<div class="admin-empty">No admin-added images yet.</div>'}
function renderVideos(){const list=document.querySelector('#video-list'),admin=document.querySelector('#admin-video-items');if(!list||!admin)return;list.innerHTML='';admin.innerHTML='';if(!STORE.videos.length){list.innerHTML='<div class="video-card"><div class="play">▶</div><strong>OFFICIAL GARAGE VIDEOS</strong><small>Add TikTok links from Admin.</small></div>';admin.innerHTML='<div class="admin-empty">No TikTok links yet.</div>';return}STORE.videos.forEach((item,i)=>{const card=document.createElement('article');card.className='video-link-card';card.innerHTML='<div class="play">▶</div><strong></strong><small>TikTok / Dada Ko Garage</small><a target="_blank" rel="noopener noreferrer">Open video ↗</a>';card.querySelector('strong').textContent=item.title||'Dada Ko Garage video';card.querySelector('a').href=item.url;list.appendChild(card);const row=document.createElement('div');row.className='admin-item';row.innerHTML='<div style="width:58px;height:48px;display:grid;place-items:center;background:#222;font-size:20px">▶</div><div><strong></strong><small></small></div><button class="admin-delete" type="button">DELETE</button>';row.querySelector('strong').textContent=item.title||'TikTok video';row.querySelector('small').textContent=item.url;row.querySelector('.admin-delete').onclick=()=>{STORE.videos.splice(i,1);saveStore();renderAdmin()};admin.appendChild(row)})}
function fillBusiness(){const b={...GARAGE,...STORE.business};[['business-phone',b.phone],['business-whatsapp',b.whatsapp],['business-maps',b.maps],['business-address',b.address],['business-hours',b.hours],['business-tiktok',b.tiktok]].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v||''})}
function renderAdmin(){renderGallery();renderVideos();fillBusiness();applyBusiness()}

const galleryForm=document.querySelector('#gallery-form');
galleryForm?.addEventListener('submit',async e=>{e.preventDefault();const url=document.querySelector('#image-url').value.trim(),file=document.querySelector('#image-file').files[0],caption=document.querySelector('#image-caption').value.trim();if(!url&&!file)return alert('Add an image URL or choose an image.');let src=url;if(file){if(file.size>2_000_000)return alert('That image is over 2 MB. Compress it first for better mobile performance.');src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}STORE.gallery.unshift({src,caption});saveStore();galleryForm.reset();renderAdmin()});
const videoForm=document.querySelector('#video-form');
videoForm?.addEventListener('submit',e=>{e.preventDefault();const url=document.querySelector('#tiktok-url').value.trim(),title=document.querySelector('#video-title').value.trim();if(!/^https?:\/\/(www\.)?tiktok\.com\//i.test(url))return alert('Enter a valid TikTok URL.');STORE.videos.unshift({url,title});saveStore();videoForm.reset();renderAdmin()});
const businessForm=document.querySelector('#business-form');
businessForm?.addEventListener('submit',e=>{e.preventDefault();STORE.business={phone:document.querySelector('#business-phone').value.trim(),whatsapp:document.querySelector('#business-whatsapp').value.trim(),maps:document.querySelector('#business-maps').value.trim(),address:document.querySelector('#business-address').value.trim(),hours:document.querySelector('#business-hours').value.trim(),tiktok:document.querySelector('#business-tiktok').value.trim()};saveStore();applyBusiness();alert('Business details saved on this browser.');});

renderAdmin();

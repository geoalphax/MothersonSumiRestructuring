/* ===== Restructuring Academy: shared site shell ===== */
(function(){
const PAGE=document.body.dataset.page||'home';
const store={get(k,d){try{const v=localStorage.getItem('ra-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('ra-'+k,JSON.stringify(v))}catch(e){}}};
window.raStore=store;
const root=document.documentElement;
/* theme */
const THEMES=['auto','light','dark'];
const ICON={auto:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor"/></svg>',
 light:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.2" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4"/></g></svg>',
 dark:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7z" fill="currentColor"/></svg>'};
let theme=store.get('theme','auto');
function applyTheme(t){theme=t;if(t==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);
 const b=document.getElementById('themeBtn');if(b){b.innerHTML=ICON[t]+'<span class="lbl">'+({auto:'Auto',light:'Light',dark:'Dark'})[t]+'</span>';b.setAttribute('aria-label','Theme: '+t+'. Click to change.')}store.set('theme',t)}
window.cycleTheme=()=>{applyTheme(THEMES[(THEMES.indexOf(theme)+1)%3]);toast('Theme: '+({auto:'follows your device',light:'light',dark:'dark'})[theme])};
applyTheme(theme);
/* toast */
let tt;function toast(m){const t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1900)}
window.hubToast=toast;
/* done tracking (per page) */
const done=new Set(store.get('done-'+PAGE,[]));
if(PAGE!=='home')document.querySelectorAll('main section[id]').forEach(s=>{const h=s.querySelector(':scope > .lesson');if(!h)return;
 const b=document.createElement('button');b.className='donebtn';b.type='button';b.dataset.sid=s.id;
 const paint=()=>{const on=done.has(s.id);b.setAttribute('aria-pressed',on);b.textContent=on?'✓ Understood':'Mark understood'};paint();
 b.onclick=()=>{done.has(s.id)?done.delete(s.id):done.add(s.id);store.set('done-'+PAGE,[...done]);store.set('total-'+PAGE,document.querySelectorAll('.donebtn').length);paint();updateDone();if(done.has(s.id))toast('Marked as understood.')};h.appendChild(b)});
const totalBtns=document.querySelectorAll('.donebtn').length;if(totalBtns)store.set('total-'+PAGE,totalBtns);
function updateDone(){const chip=document.getElementById('doneChip');if(!chip)return;if(!totalBtns){chip.hidden=true;return}
 const n=[...document.querySelectorAll('.donebtn')].filter(b=>done.has(b.dataset.sid)).length;chip.textContent=`${n}/${totalBtns} understood`}
window.raUpdateDone=updateDone;updateDone();
/* reading progress + to top */
const rb=document.getElementById('readbar'),tp=document.getElementById('totop');
function onScroll(){const h=document.documentElement.scrollHeight-innerHeight;if(rb)rb.style.width=(h>0?scrollY/h*100:0)+'%';if(tp)tp.classList.toggle('show',scrollY>900)}
addEventListener('scroll',onScroll,{passive:true});if(tp)tp.onclick=()=>scrollTo({top:0,behavior:'smooth'});onScroll();
/* palette: this page's sections + other pages */
const PAGES=[['index.html','Home','Start here: learning path and progress'],['motherson.html','Motherson','The Motherson case, maths and assignment'],['schemes.html','Schemes 101','How schemes of arrangement work'],['practice.html','Practice Lab','Method, worked examples, 24 cases']];
const pal=document.getElementById('pal'),pin=document.getElementById('palIn'),pl=document.getElementById('palList');let items=[],sel=0;
function collect(){items=[];document.querySelectorAll('main section[id]').forEach(s=>{const h=s.querySelector('.lesson h2, h2');if(h)items.push({href:'#'+s.id,title:h.textContent.replace(/✓ Understood|Mark understood/,'').trim(),tag:'This page'})});
 document.querySelectorAll('.case[id]').forEach(c=>{const h=c.querySelector('h3');if(h)items.push({href:'#'+c.id,title:h.textContent,tag:'Case'})});
 PAGES.forEach(p=>items.push({href:p[0],title:p[1]+': '+p[2],tag:'Page'}))}
function renderPal(){const q=pin.value.toLowerCase().trim();const f=items.filter(i=>!q||i.title.toLowerCase().includes(q)||i.tag.toLowerCase().includes(q));sel=Math.min(sel,Math.max(0,f.length-1));
 pl.innerHTML=f.map((i,k)=>`<button data-k="${k}" class="${k===sel?'on':''}"><span class="t">${i.tag}</span>${i.title}</button>`).join('')||'<div class="palhint">No matches</div>';
 [...pl.querySelectorAll('button')].forEach((b,k)=>b.onclick=()=>go(f[k]));pal._f=f}
function go(i){closePal();if(i.href.startsWith('#')){const t=document.querySelector(i.href);if(t){t.scrollIntoView({behavior:'smooth'});if(t.tagName==='DETAILS')t.open=true;if(window.raOpenCase)window.raOpenCase(t.id)}}else location.href=i.href}
function openPal(){if(!pal)return;collect();pal.hidden=false;pin.value='';sel=0;renderPal();setTimeout(()=>pin.focus(),10)}
function closePal(){if(pal)pal.hidden=true}
window.openPal=openPal;
if(pin){pin.addEventListener('input',()=>{sel=0;renderPal()});
 pin.addEventListener('keydown',e=>{const f=pal._f||[];if(e.key==='ArrowDown'){sel=Math.min(sel+1,f.length-1);renderPal();e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);renderPal();e.preventDefault()}else if(e.key==='Enter'&&f[sel]){go(f[sel])}else if(e.key==='Escape')closePal()});
 pal.addEventListener('click',e=>{if(e.target===pal)closePal()})}
/* shortcuts */
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==='/'||e.key==='k'){e.preventDefault();openPal()}else if(e.key==='d'){cycleTheme()}
 else if(['1','2','3','4'].includes(e.key)){location.href=PAGES[+e.key-1][0]}
 else if(e.key==='?'){toast('Shortcuts: / search · d theme · 1 Home · 2 Motherson · 3 Schemes · 4 Practice')}else if(e.key==='Escape'&&pal&&!pal.hidden)closePal()});
/* deep link highlight */
function flash(id){const t=document.getElementById(id);if(!t)return;t.classList.add('flash');setTimeout(()=>t.classList.remove('flash'),2200)}
if(location.hash){const id=location.hash.slice(1);setTimeout(()=>{const t=document.getElementById(id);if(t){if(window.raOpenCase)window.raOpenCase(id);t.scrollIntoView();flash(id)}},120)}
addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(window.raOpenCase)window.raOpenCase(id);flash(id)});
})();

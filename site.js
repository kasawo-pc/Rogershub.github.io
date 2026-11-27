(()=>{const btn=document.getElementById('menuBtn'),nav=document.getElementById('navLinks');
if(btn&&nav){
 const links=nav.querySelectorAll('a'),mobile=()=>window.matchMedia('(max-width:720px)').matches;
 btn.setAttribute('aria-controls','navLinks');
 const closeMenu=(restore=false)=>{
  nav.classList.remove('open');btn.setAttribute('aria-expanded','false');
  btn.textContent='☰';btn.setAttribute('aria-label','Open navigation');
  document.body.classList.remove('menu-open');
  if(restore&&mobile())btn.focus();
 };
 const openMenu=()=>{
  nav.classList.add('open');btn.setAttribute('aria-expanded','true');
  btn.textContent='✕';btn.setAttribute('aria-label','Close navigation');
  document.body.classList.add('menu-open');
  if(mobile()&&links.length)links[0].focus();
 };
 btn.addEventListener('click',()=>nav.classList.contains('open')?closeMenu(true):openMenu());
 links.forEach(a=>a.addEventListener('click',()=>closeMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){e.preventDefault();closeMenu(true);}});
 document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!btn.contains(e.target))closeMenu(false);});
 window.addEventListener('resize',()=>{if(nav.classList.contains('open')&&!mobile())closeMenu(false);},{passive:true});
}if(window.supabase){try{const c=window.supabase.createClient('https://kmdshraspqvmuqgmzigw.supabase.co','sb_publishable_gtYteZIQR0X3_ttYZZ0ZCw_F-TC2Qxd');const applyAuth=(session)=>{document.querySelectorAll('a[href="login.html"],a[href="signup.html"],a[href="/login.html"],a[href="/signup.html"]').forEach(a=>{a.hidden=!!session;a.style.display=session?'none':'';});document.querySelectorAll('.nav-actions').forEach(n=>{let d=n.querySelector('[data-rh-dashboard]');if(session&&!d){d=document.createElement('a');d.href='member-dashboard.html';d.className='btn small';d.textContent='Member dashboard';d.setAttribute('data-rh-dashboard','');n.appendChild(d);}else if(!session&&d)d.remove();});if(session&&(location.pathname.endsWith('/login.html')||location.pathname.endsWith('/signup.html')))location.replace('member-dashboard.html');};c.auth.getSession().then(({data})=>applyAuth(data?.session||null));c.auth.onAuthStateChange((_event,session)=>applyAuth(session));}catch(e){console.warn('Rogers Hub auth navigation:',e);}}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();const top=document.getElementById('backTop');if(top){window.addEventListener('scroll',()=>top.classList.toggle('show',scrollY>400),{passive:true});top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));}if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.card,.panel,.quote,.article,.feature,.form').forEach(e=>{e.classList.add('reveal');io.observe(e)});}
const currency=document.getElementById('currency');if(currency){const note=document.getElementById('rateNote');const fmt=n=>currency.value==='USD'?'$'+(n/3700).toLocaleString('en-US',{maximumFractionDigits:0}):'UGX '+Math.round(n).toLocaleString('en-US');const update=()=>{document.querySelectorAll('[data-low][data-high]').forEach(el=>el.textContent=fmt(+el.dataset.low)+' – '+fmt(+el.dataset.high));if(note)note.textContent=currency.value==='USD'?'Indicative reference only: UGX 3,700 per $1. Confirm the current rate before payment.':'USD display uses an indicative UGX 3,700 per $1 reference.'};currency.addEventListener('change',update);update();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));const f=b.dataset.filter;document.querySelectorAll('.gallery-item').forEach(c=>c.hidden=!(f==='all'||c.dataset.category===f));}));
document.querySelectorAll('form[data-whatsapp]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);let lines=[];for(const [k,v]of d.entries())lines.push(k.replace(/[_-]/g,' ')+': '+v);const msg='Hello Rogers, I am contacting you through Rogers Tech Hub.\n'+lines.join('\n');location.href='https://wa.me/256741798579?text='+encodeURIComponent(msg);}));
/* Rogers Tech Hub assistant: protected server-backed AI mode. */
(function(){
 if(document.getElementById('rh-assistant'))return;
 const root=document.createElement('section');root.id='rh-assistant';root.className='rh-assistant';
 root.innerHTML='<button class="rh-launcher" type="button" aria-label="Open Rogers Tech Hub assistant" aria-expanded="false"><span aria-hidden="true">✦</span><span class="rh-launch-text">Ask Rogers Tech Hub</span></button><div class="rh-panel" role="dialog" aria-label="Rogers Tech Hub assistant" aria-modal="false" hidden><header class="rh-head"><div><strong>Rogers Tech Hub Assistant</strong><small>AI website helper</small></div><button class="rh-close" type="button" aria-label="Close assistant">×</button></header><div class="rh-messages" aria-live="polite"><div class="rh-message rh-bot">Hi! 👋 I’m the Rogers Tech Hub AI assistant. Ask me about our website services, packages, pricing or how to get in touch.</div></div><div class="rh-prompts"><button type="button">Show me your prices</button><button type="button">I need a website</button><button type="button">How do I contact you?</button></div><form class="rh-form"><label class="rh-sr" for="rh-question">Your question</label><input id="rh-question" name="question" maxlength="500" placeholder="Type your question..." autocomplete="off" required><button type="submit" aria-label="Send message">➤</button></form><div class="rh-foot">AI assistant · <a href="https://wa.me/256741798579" target="_blank" rel="noopener">Talk to Rogers on WhatsApp</a></div></div>';
 document.body.appendChild(root);
 const panel=root.querySelector('.rh-panel'),launcher=root.querySelector('.rh-launcher'),close=root.querySelector('.rh-close'),messages=root.querySelector('.rh-messages'),form=root.querySelector('.rh-form'),input=root.querySelector('#rh-question'),submit=form.querySelector('button[type="submit"]');
 const open=()=>{panel.hidden=false;launcher.setAttribute('aria-expanded','true');input.focus();},shut=()=>{panel.hidden=true;launcher.setAttribute('aria-expanded','false');launcher.focus();};
 launcher.addEventListener('click',()=>panel.hidden?open():shut());close.addEventListener('click',shut);
 function add(text,who){const el=document.createElement('div');el.className='rh-message '+(who==='user'?'rh-user':'rh-bot');el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el;}
 async function send(q){
  const clean=q.trim();if(!clean||submit.disabled)return;
  add(clean,'user');input.value='';submit.disabled=true;input.disabled=true;
  const waiting=add('Thinking…','bot');
  try{
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:clean})});
   const data=await response.json().catch(()=>({}));
   waiting.remove();
   if(!response.ok)throw new Error(data.error||'The assistant is temporarily unavailable.');
   add(data.answer||'I could not prepare a reply. Please try again.','bot');
  }catch(error){
   waiting.remove();
   add(error.message||'I could not connect. Please try again or contact Rogers on WhatsApp.','bot');
  }finally{submit.disabled=false;input.disabled=false;input.focus();}
 }
 form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
 root.querySelectorAll('.rh-prompts button').forEach(b=>b.addEventListener('click',()=>send(b.textContent)));
})();
})();
